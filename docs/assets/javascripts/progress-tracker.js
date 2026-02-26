/**
 * Zephyr Learning System - Progress Tracker
 * 学习进度跟踪模块
 * 
 * 功能：
 * - 记录用户访问的页面
 * - 计算学习进度百分比
 * - 管理进度数据（导出/导入/重置）
 * - 显示进度可视化
 */

(function() {
  'use strict';

  // ==================== 常量定义 ====================
  
  const STORAGE_KEY = 'zephyrLearningProgress';
  const COMPLETION_SHOWN_KEY = 'zephyrCompletionShown';
  
  // 学习阶段定义
  const STAGES = {
    'prerequisites': {
      name: '前置必备知识',
      pages: [
        'prerequisites/index',
        'prerequisites/c-language',
        'prerequisites/embedded-basics',
        'prerequisites/rtos-concepts',
        'prerequisites/tools'
      ]
    },
    'stage1-foundation': {
      name: '第一阶段：入门筑基期',
      pages: [
        'stage1-foundation/index',
        'stage1-foundation/introduction',
        'stage1-foundation/environment-setup',
        'stage1-foundation/west-tool',
        'stage1-foundation/project-structure',
        'stage1-foundation/basic-examples'
      ]
    },
    'stage2-intermediate': {
      name: '第二阶段：进阶实战期',
      pages: [
        'stage2-intermediate/index',
        'stage2-intermediate/kernel-mechanisms',
        'stage2-intermediate/kconfig-devicetree',
        'stage2-intermediate/driver-development',
        'stage2-intermediate/subsystems'
      ]
    },
    'stage3-advanced': {
      name: '第三阶段：高级深耕期',
      pages: [
        'stage3-advanced/index',
        'stage3-advanced/kernel-source',
        'stage3-advanced/bsp-porting',
        'stage3-advanced/optimization',
        'stage3-advanced/security'
      ]
    },
    'stage4-expert': {
      name: '第四阶段：专业精通期',
      pages: [
        'stage4-expert/index',
        'stage4-expert/architecture-design',
        'stage4-expert/community-contribution',
        'stage4-expert/technical-evangelism'
      ]
    }
  };

  // ==================== 数据结构 ====================
  
  /**
   * 进度数据结构
   * @typedef {Object} ProgressData
   * @property {string[]} visitedPages - 已访问页面列表
   * @property {Object.<string, boolean>} completedStages - 已完成阶段
   * @property {string} lastVisit - 最后访问时间
   * @property {number} totalReadingTime - 总阅读时间（秒）
   */

  // ==================== 核心功能 ====================
  
  /**
   * 获取进度数据
   * @returns {ProgressData}
   */
  function getProgress() {
    const defaultProgress = {
      visitedPages: [],
      completedStages: {
        'prerequisites': false,
        'stage1-foundation': false,
        'stage2-intermediate': false,
        'stage3-advanced': false,
        'stage4-expert': false
      },
      lastVisit: new Date().toISOString(),
      totalReadingTime: 0
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const progress = JSON.parse(stored);
        // 确保数据结构完整
        return {
          ...defaultProgress,
          ...progress,
          completedStages: {
            ...defaultProgress.completedStages,
            ...(progress.completedStages || {})
          }
        };
      }
    } catch (error) {
      console.error('Failed to load progress data:', error);
    }

    return defaultProgress;
  }

  /**
   * 保存进度数据
   * @param {ProgressData} progress
   */
  function saveProgress(progress) {
    try {
      progress.lastVisit = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress data:', error);
    }
  }

  /**
   * 获取当前页面ID
   * @returns {string}
   */
  function getCurrentPageId() {
    const path = window.location.pathname;
    // 移除开头的 / 和结尾的 .html 或 /
    let pageId = path.replace(/^\//, '').replace(/\/$/, '').replace(/\.html$/, '');
    
    // 处理首页
    if (pageId === '' || pageId === 'index') {
      return 'index';
    }
    
    return pageId;
  }

  /**
   * 记录页面访问
   * @param {string} pageId
   */
  function recordPageVisit(pageId) {
    const progress = getProgress();
    
    // 避免重复记录
    if (!progress.visitedPages.includes(pageId)) {
      progress.visitedPages.push(pageId);
      saveProgress(progress);
      
      // 检查阶段完成情况
      checkStageCompletion(pageId);
    }
  }

  /**
   * 获取阶段的总页面数
   * @param {string} stageId
   * @returns {number}
   */
  function getTotalPages(stageId) {
    return STAGES[stageId] ? STAGES[stageId].pages.length : 0;
  }

  /**
   * 获取阶段的已访问页面数
   * @param {string} stageId
   * @returns {number}
   */
  function getVisitedCount(stageId) {
    const progress = getProgress();
    const stagePages = STAGES[stageId] ? STAGES[stageId].pages : [];
    
    return stagePages.filter(page => progress.visitedPages.includes(page)).length;
  }

  /**
   * 计算阶段完成百分比
   * @param {string} stageId
   * @returns {number}
   */
  function getStagePercentage(stageId) {
    const total = getTotalPages(stageId);
    if (total === 0) return 0;
    
    const visited = getVisitedCount(stageId);
    return (visited / total) * 100;
  }

  /**
   * 获取阶段显示名称
   * @param {string} stageId
   * @returns {string}
   */
  function getStageDisplayName(stageId) {
    return STAGES[stageId] ? STAGES[stageId].name : stageId;
  }

  /**
   * 检查页面是否已访问
   * @param {string} pageId
   * @returns {boolean}
   */
  function isPageVisited(pageId) {
    const progress = getProgress();
    return progress.visitedPages.includes(pageId);
  }

  /**
   * 获取页面所属阶段
   * @param {string} pageId
   * @returns {string|null}
   */
  function getPageStage(pageId) {
    for (const [stageId, stage] of Object.entries(STAGES)) {
      if (stage.pages.includes(pageId)) {
        return stageId;
      }
    }
    return null;
  }

  /**
   * 检查阶段完成情况
   * @param {string} pageId
   */
  function checkStageCompletion(pageId) {
    const stageId = getPageStage(pageId);
    if (!stageId) return;
    
    const percentage = getStagePercentage(stageId);
    
    if (percentage === 100 && !isStageCompletionShown(stageId)) {
      showCongratulationsModal(stageId);
      markStageCompletionShown(stageId);
      
      // 更新完成状态
      const progress = getProgress();
      progress.completedStages[stageId] = true;
      saveProgress(progress);
    }
  }

  /**
   * 检查阶段完成提示是否已显示
   * @param {string} stageId
   * @returns {boolean}
   */
  function isStageCompletionShown(stageId) {
    try {
      const shown = localStorage.getItem(COMPLETION_SHOWN_KEY);
      if (shown) {
        const shownStages = JSON.parse(shown);
        return shownStages.includes(stageId);
      }
    } catch (error) {
      console.error('Failed to check completion shown:', error);
    }
    return false;
  }

  /**
   * 标记阶段完成提示已显示
   * @param {string} stageId
   */
  function markStageCompletionShown(stageId) {
    try {
      let shownStages = [];
      const stored = localStorage.getItem(COMPLETION_SHOWN_KEY);
      if (stored) {
        shownStages = JSON.parse(stored);
      }
      if (!shownStages.includes(stageId)) {
        shownStages.push(stageId);
        localStorage.setItem(COMPLETION_SHOWN_KEY, JSON.stringify(shownStages));
      }
    } catch (error) {
      console.error('Failed to mark completion shown:', error);
    }
  }

  /**
   * 获取下一个阶段
   * @param {string} currentStageId
   * @returns {Object|null}
   */
  function getNextStage(currentStageId) {
    const stageIds = Object.keys(STAGES);
    const currentIndex = stageIds.indexOf(currentStageId);
    
    if (currentIndex >= 0 && currentIndex < stageIds.length - 1) {
      const nextStageId = stageIds[currentIndex + 1];
      const nextStage = STAGES[nextStageId];
      return {
        id: nextStageId,
        name: nextStage.name,
        url: '/' + nextStage.pages[0] + '/'
      };
    }
    
    return null;
  }

  /**
   * 生成整体进度概览
   * @returns {Object}
   */
  function generateProgressOverview() {
    const overview = {
      totalPages: 0,
      visitedPages: 0,
      stages: []
    };
    
    for (const [stageId, stage] of Object.entries(STAGES)) {
      const total = getTotalPages(stageId);
      const visited = getVisitedCount(stageId);
      const percentage = getStagePercentage(stageId);
      
      overview.totalPages += total;
      overview.visitedPages += visited;
      overview.stages.push({
        id: stageId,
        name: stage.name,
        total,
        visited,
        percentage,
        completed: percentage === 100
      });
    }
    
    overview.overallPercentage = overview.totalPages > 0 
      ? (overview.visitedPages / overview.totalPages) * 100 
      : 0;
    
    return overview;
  }

  /**
   * 重置进度
   */
  function resetProgress() {
    if (confirm('确定要重置所有学习进度吗？此操作不可撤销。')) {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(COMPLETION_SHOWN_KEY);
        window.location.reload();
      } catch (error) {
        console.error('Failed to reset progress:', error);
        alert('重置进度失败，请稍后重试。');
      }
    }
  }

  /**
   * 导出进度
   */
  function exportProgress() {
    try {
      const progress = getProgress();
      const dataStr = JSON.stringify(progress, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `zephyr-learning-progress-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export progress:', error);
      alert('导出进度失败，请稍后重试。');
    }
  }

  /**
   * 导入进度
   * @param {File} file
   */
  function importProgress(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const progress = JSON.parse(e.target.result);
        
        // 验证数据格式
        if (validateProgressData(progress)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
          alert('进度导入成功！页面将刷新以应用新进度。');
          window.location.reload();
        } else {
          alert('进度文件格式无效，请检查文件内容。');
        }
      } catch (error) {
        console.error('Failed to import progress:', error);
        alert('进度文件解析失败：' + error.message);
      }
    };
    
    reader.onerror = function() {
      alert('读取文件失败，请稍后重试。');
    };
    
    reader.readAsText(file);
  }

  /**
   * 验证进度数据格式
   * @param {*} data
   * @returns {boolean}
   */
  function validateProgressData(data) {
    return data && 
           Array.isArray(data.visitedPages) &&
           typeof data.completedStages === 'object' &&
           typeof data.lastVisit === 'string';
  }

  /**
   * 显示祝贺弹窗
   * @param {string} stageId
   */
  function showCongratulationsModal(stageId) {
    const stageName = getStageDisplayName(stageId);
    const nextStage = getNextStage(stageId);
    
    const modal = document.createElement('div');
    modal.className = 'congratulations-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>🎉 恭喜完成 ${stageName}！</h2>
        <p>你已经完成了本阶段的所有学习内容。</p>
        ${nextStage ? `
          <p>准备好进入下一阶段了吗？</p>
          <a href="${nextStage.url}" class="btn-primary">
            开始学习：${nextStage.name}
          </a>
        ` : `
          <p>你已经完成了所有学习阶段，太棒了！🎊</p>
        `}
        <button class="btn-secondary" onclick="this.closest('.congratulations-modal').remove()">关闭</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击背景关闭
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // ==================== 防抖函数 ====================
  
  /**
   * 防抖函数
   * @param {Function} func
   * @param {number} wait
   * @returns {Function}
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ==================== 初始化 ====================
  
  /**
   * 初始化进度跟踪
   */
  function init() {
    // 记录当前页面访问
    const pageId = getCurrentPageId();
    if (pageId && pageId !== 'index' && pageId !== 'about') {
      recordPageVisit(pageId);
    }
  }

  // ==================== 导出 API ====================
  
  // 将 API 暴露到全局
  window.ProgressTracker = {
    getProgress,
    saveProgress,
    getCurrentPageId,
    recordPageVisit,
    getTotalPages,
    getVisitedCount,
    getStagePercentage,
    getStageDisplayName,
    isPageVisited,
    getPageStage,
    generateProgressOverview,
    resetProgress,
    exportProgress,
    importProgress,
    validateProgressData,
    STAGES
  };

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
