/**
 * Zephyr Learning System - Progress Display
 * 学习进度显示模块
 * 
 * 功能：
 * - 在导航菜单中标记已访问页面
 * - 在阶段索引页显示进度条
 * - 在首页显示整体进度概览
 * - 进度数据可视化
 */

(function() {
  'use strict';

  // 确保 ProgressTracker 已加载
  if (typeof window.ProgressTracker === 'undefined') {
    console.error('ProgressTracker not loaded. Please include progress-tracker.js first.');
    return;
  }

  const PT = window.ProgressTracker;

  // ==================== 导航菜单标记 ====================
  
  /**
   * 标记已访问的页面
   */
  function markVisitedPages() {
    // 查找所有导航链接
    const navLinks = document.querySelectorAll('.md-nav__link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      // 提取页面ID
      const pageId = extractPageIdFromHref(href);
      if (!pageId) return;
      
      // 检查是否已访问
      if (PT.isPageVisited(pageId)) {
        // 添加已访问标记
        if (!link.querySelector('.visited-icon')) {
          const icon = document.createElement('span');
          icon.className = 'visited-icon';
          icon.innerHTML = ' ✓';
          icon.title = '已完成';
          link.appendChild(icon);
        }
        
        // 添加 CSS 类
        link.classList.add('visited');
      }
    });
  }

  /**
   * 从 href 提取页面ID
   * @param {string} href
   * @returns {string|null}
   */
  function extractPageIdFromHref(href) {
    if (!href) return null;
    
    // 移除域名和协议
    let path = href.replace(/^https?:\/\/[^\/]+/, '');
    
    // 移除开头的 /（如果有）
    path = path.replace(/^\//, '');
    
    // 移除结尾的 / 和 .html
    path = path.replace(/\/$/, '').replace(/\.html$/, '');
    
    // 处理特殊情况
    if (path === '' || path === 'index' || path === 'index.html') {
      return null; // 首页不标记
    }
    
    return path;
  }

  // ==================== 进度条组件 ====================
  
  /**
   * 创建进度条 HTML
   * @param {string} stageId
   * @param {number} percentage
   * @param {number} visited
   * @param {number} total
   * @returns {string}
   */
  function createProgressBar(stageId, percentage, visited, total) {
    return `
      <div class="progress-container" data-stage="${stageId}">
        <div class="progress-label">
          <span class="progress-title">学习进度</span>
          <span class="progress-percentage">${percentage.toFixed(0)}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="progress-stats">
          <span>${visited} / ${total} 页已完成</span>
        </div>
      </div>
    `;
  }

  /**
   * 在阶段索引页显示进度条
   */
  function displayStageProgress() {
    const pageId = PT.getCurrentPageId();
    const stageId = PT.getPageStage(pageId);
    
    // 只在阶段索引页显示
    if (!stageId || !pageId.endsWith('/index')) {
      return;
    }
    
    // 移除已存在的进度条（避免重复）
    const existingProgress = document.querySelector('.progress-container');
    if (existingProgress) {
      existingProgress.remove();
    }
    
    const total = PT.getTotalPages(stageId);
    const visited = PT.getVisitedCount(stageId);
    const percentage = PT.getStagePercentage(stageId);
    
    // 查找插入位置（第一个 h2 之后）
    const firstH2 = document.querySelector('.md-content h2');
    if (firstH2) {
      const progressHTML = createProgressBar(stageId, percentage, visited, total);
      firstH2.insertAdjacentHTML('afterend', progressHTML);
    }
  }

  // ==================== 整体进度概览 ====================
  
  /**
   * 创建整体进度概览 HTML
   * @returns {string}
   */
  function createProgressOverview() {
    const overview = PT.generateProgressOverview();
    
    let html = `
      <div class="progress-overview">
        <h2>📊 学习进度总览</h2>
        <div class="overall-progress">
          <div class="progress-label">
            <span class="progress-title">整体进度</span>
            <span class="progress-percentage">${overview.overallPercentage.toFixed(0)}%</span>
          </div>
          <div class="progress-bar progress-bar-large">
            <div class="progress-fill" style="width: ${overview.overallPercentage}%"></div>
          </div>
          <div class="progress-stats">
            <span>${overview.visitedPages} / ${overview.totalPages} 页已完成</span>
          </div>
        </div>
        
        <h3>各阶段进度</h3>
        <div class="stages-progress">
    `;
    
    overview.stages.forEach(stage => {
      const statusIcon = stage.completed ? '✅' : '📖';
      const statusText = stage.completed ? '已完成' : '进行中';
      
      html += `
        <div class="stage-progress-card ${stage.completed ? 'completed' : ''}">
          <div class="stage-header">
            <span class="stage-icon">${statusIcon}</span>
            <span class="stage-name">${stage.name}</span>
            <span class="stage-status">${statusText}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${stage.percentage}%"></div>
          </div>
          <div class="progress-stats">
            <span>${stage.visited} / ${stage.total} 页</span>
            <span class="progress-percentage">${stage.percentage.toFixed(0)}%</span>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
    
    return html;
  }

  /**
   * 在首页显示进度概览
   */
  function displayHomeProgress() {
    const pageId = PT.getCurrentPageId();
    
    // 只在首页显示
    if (pageId !== 'index' && pageId !== '') {
      return;
    }
    
    // 移除已存在的进度概览（避免重复）
    const existingOverview = document.querySelector('.progress-overview');
    if (existingOverview) {
      existingOverview.remove();
    }
    
    // 查找插入位置（第一个 h2 之后）
    const firstH2 = document.querySelector('.md-content h2');
    if (firstH2) {
      const overviewHTML = createProgressOverview();
      firstH2.insertAdjacentHTML('afterend', overviewHTML);
    }
  }

  // ==================== 进度统计卡片 ====================
  
  /**
   * 创建进度统计卡片
   * @returns {string}
   */
  function createProgressStatsCard() {
    const overview = PT.generateProgressOverview();
    const progress = PT.getProgress();
    
    const completedStages = overview.stages.filter(s => s.completed).length;
    const totalStages = overview.stages.length;
    
    // 计算学习天数
    const firstVisit = new Date(progress.lastVisit);
    const today = new Date();
    const daysSinceStart = Math.max(1, Math.ceil((today - firstVisit) / (1000 * 60 * 60 * 24)));
    
    return `
      <div class="progress-stats-card">
        <div class="stat-item">
          <div class="stat-value">${overview.visitedPages}</div>
          <div class="stat-label">已学习页面</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${completedStages}/${totalStages}</div>
          <div class="stat-label">完成阶段</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${overview.overallPercentage.toFixed(0)}%</div>
          <div class="stat-label">整体进度</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${daysSinceStart}</div>
          <div class="stat-label">学习天数</div>
        </div>
      </div>
    `;
  }

  // ==================== 页面特定显示 ====================
  
  /**
   * 根据页面类型显示相应的进度信息
   */
  function displayProgressByPageType() {
    const pageId = PT.getCurrentPageId();
    
    if (pageId === 'index' || pageId === '') {
      // 首页：显示整体进度概览
      displayHomeProgress();
    } else if (pageId.endsWith('/index')) {
      // 阶段索引页：显示该阶段进度
      displayStageProgress();
    }
  }

  // ==================== 实时更新 ====================
  
  /**
   * 更新所有进度显示
   */
  function updateAllProgressDisplays() {
    // 更新导航标记
    markVisitedPages();
    
    // 更新进度条
    const progressContainers = document.querySelectorAll('.progress-container');
    progressContainers.forEach(container => {
      const stageId = container.getAttribute('data-stage');
      if (stageId) {
        const total = PT.getTotalPages(stageId);
        const visited = PT.getVisitedCount(stageId);
        const percentage = PT.getStagePercentage(stageId);
        
        const fill = container.querySelector('.progress-fill');
        const percentageSpan = container.querySelector('.progress-percentage');
        const stats = container.querySelector('.progress-stats span');
        
        if (fill) fill.style.width = percentage + '%';
        if (percentageSpan) percentageSpan.textContent = percentage.toFixed(0) + '%';
        if (stats) stats.textContent = `${visited} / ${total} 页已完成`;
      }
    });
  }

  // ==================== 动画效果 ====================
  
  /**
   * 为进度条添加动画效果
   */
  function animateProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    progressFills.forEach(fill => {
      const targetWidth = fill.style.width;
      fill.style.width = '0%';
      
      // 延迟启动动画
      setTimeout(() => {
        fill.style.transition = 'width 1s ease-out';
        fill.style.width = targetWidth;
      }, 100);
    });
  }

  // ==================== 初始化 ====================
  
  /**
   * 初始化进度显示
   */
  function init() {
    // 标记已访问页面
    markVisitedPages();
    
    // 根据页面类型显示进度
    displayProgressByPageType();
    
    // 添加动画效果
    setTimeout(animateProgressBars, 200);
    
    // 监听导航变化（Material for MkDocs 的即时加载）
    if (typeof document$ !== 'undefined') {
      document$.subscribe(() => {
        setTimeout(() => {
          markVisitedPages();
          displayProgressByPageType();
          animateProgressBars();
        }, 100);
      });
    }
  }

  // ==================== 导出 API ====================
  
  window.ProgressDisplay = {
    markVisitedPages,
    displayStageProgress,
    displayHomeProgress,
    updateAllProgressDisplays,
    createProgressBar,
    createProgressOverview,
    createProgressStatsCard
  };

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
