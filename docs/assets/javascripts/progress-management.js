/**
 * Zephyr Learning System - Progress Management
 * 学习进度管理模块
 * 
 * 功能：
 * - 重置进度
 * - 导出进度
 * - 导入进度
 * - 进度管理界面
 */

(function() {
  'use strict';

  // 确保 ProgressTracker 已加载
  if (typeof window.ProgressTracker === 'undefined') {
    console.error('ProgressTracker not loaded. Please include progress-tracker.js first.');
    return;
  }

  const PT = window.ProgressTracker;

  // ==================== 进度管理界面 ====================
  
  /**
   * 创建进度管理按钮组
   * @returns {string}
   */
  function createManagementButtons() {
    return `
      <div class="progress-management">
        <h3>📋 进度管理</h3>
        <div class="management-buttons">
          <button class="btn-action btn-export" onclick="ProgressManagement.handleExport()">
            <span class="icon">💾</span>
            <span class="text">导出进度</span>
          </button>
          <button class="btn-action btn-import" onclick="document.getElementById('progress-import-file').click()">
            <span class="icon">📥</span>
            <span class="text">导入进度</span>
          </button>
          <button class="btn-action btn-reset" onclick="ProgressManagement.handleReset()">
            <span class="icon">🔄</span>
            <span class="text">重置进度</span>
          </button>
        </div>
        <input type="file" id="progress-import-file" accept=".json" style="display: none;" onchange="ProgressManagement.handleImportFile(this)">
        <div class="management-info">
          <p class="info-text">
            <strong>提示：</strong>导出进度可以备份您的学习记录，导入进度可以在不同设备间同步学习进度。
          </p>
        </div>
      </div>
    `;
  }

  /**
   * 在首页添加进度管理界面
   */
  function addManagementUI() {
    const pageId = PT.getCurrentPageId();
    
    // 只在首页显示
    if (pageId !== 'index' && pageId !== '') {
      return;
    }
    
    // 移除已存在的管理界面（避免重复）
    const existingManagement = document.querySelector('.progress-management');
    if (existingManagement) {
      existingManagement.remove();
    }
    
    // 查找进度概览容器
    const progressOverview = document.querySelector('.progress-overview');
    if (progressOverview) {
      const managementHTML = createManagementButtons();
      progressOverview.insertAdjacentHTML('beforeend', managementHTML);
    }
  }

  // ==================== 导出功能 ====================
  
  /**
   * 处理导出操作
   */
  function handleExport() {
    try {
      PT.exportProgress();
      showNotification('进度已成功导出！', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showNotification('导出失败，请稍后重试。', 'error');
    }
  }

  // ==================== 导入功能 ====================
  
  /**
   * 处理导入文件选择
   * @param {HTMLInputElement} input
   */
  function handleImportFile(input) {
    const file = input.files[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.name.endsWith('.json')) {
      showNotification('请选择有效的 JSON 文件。', 'error');
      input.value = '';
      return;
    }
    
    // 确认导入
    if (!confirm('导入进度将覆盖当前的学习记录。是否继续？')) {
      input.value = '';
      return;
    }
    
    // 执行导入
    PT.importProgress(file);
    
    // 清空文件输入
    input.value = '';
  }

  // ==================== 重置功能 ====================
  
  /**
   * 处理重置操作
   */
  function handleReset() {
    // 显示确认对话框
    showResetConfirmDialog();
  }

  /**
   * 显示重置确认对话框
   */
  function showResetConfirmDialog() {
    const modal = document.createElement('div');
    modal.className = 'reset-confirm-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>⚠️ 确认重置进度</h2>
        <p>此操作将删除所有学习进度记录，包括：</p>
        <ul>
          <li>已访问的页面记录</li>
          <li>各阶段完成状态</li>
          <li>学习时间统计</li>
        </ul>
        <p class="warning-text"><strong>此操作不可撤销！</strong></p>
        <p>建议在重置前先导出进度以备份。</p>
        <div class="modal-actions">
          <button class="btn-danger" onclick="ProgressManagement.confirmReset()">确认重置</button>
          <button class="btn-secondary" onclick="this.closest('.reset-confirm-modal').remove()">取消</button>
        </div>
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

  /**
   * 确认重置进度
   */
  function confirmReset() {
    // 关闭对话框
    const modal = document.querySelector('.reset-confirm-modal');
    if (modal) {
      modal.remove();
    }
    
    // 执行重置
    PT.resetProgress();
  }

  // ==================== 通知系统 ====================
  
  /**
   * 显示通知消息
   * @param {string} message
   * @param {string} type - 'success', 'error', 'info', 'warning'
   */
  function showNotification(message, type = 'info') {
    // 移除现有通知
    const existing = document.querySelector('.progress-notification');
    if (existing) {
      existing.remove();
    }
    
    // 创建新通知
    const notification = document.createElement('div');
    notification.className = `progress-notification notification-${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️'
    };
    
    notification.innerHTML = `
      <span class="notification-icon">${icons[type] || icons.info}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // 自动关闭
    setTimeout(() => {
      if (notification.parentElement) {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  // ==================== 进度详情面板 ====================
  
  /**
   * 创建进度详情面板
   * @returns {string}
   */
  function createProgressDetailsPanel() {
    const progress = PT.getProgress();
    const overview = PT.generateProgressOverview();
    
    // 格式化最后访问时间
    const lastVisit = new Date(progress.lastVisit);
    const formattedDate = lastVisit.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `
      <div class="progress-details-panel">
        <h3>📈 学习统计</h3>
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">总页面数</div>
            <div class="detail-value">${overview.totalPages}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">已学习</div>
            <div class="detail-value">${overview.visitedPages}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">未学习</div>
            <div class="detail-value">${overview.totalPages - overview.visitedPages}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">完成度</div>
            <div class="detail-value">${overview.overallPercentage.toFixed(1)}%</div>
          </div>
        </div>
        <div class="last-visit">
          <span class="label">最后访问：</span>
          <span class="value">${formattedDate}</span>
        </div>
      </div>
    `;
  }

  /**
   * 在首页添加进度详情面板
   */
  function addDetailsPanel() {
    const pageId = PT.getCurrentPageId();
    
    // 只在首页显示
    if (pageId !== 'index' && pageId !== '') {
      return;
    }
    
    // 移除已存在的详情面板（避免重复）
    const existingDetails = document.querySelector('.progress-details-panel');
    if (existingDetails) {
      existingDetails.remove();
    }
    
    // 查找进度管理容器
    const progressManagement = document.querySelector('.progress-management');
    if (progressManagement) {
      const detailsHTML = createProgressDetailsPanel();
      progressManagement.insertAdjacentHTML('afterend', detailsHTML);
    }
  }

  // ==================== 快捷操作 ====================
  
  /**
   * 添加键盘快捷键
   */
  function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // Ctrl/Cmd + E: 导出进度
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleExport();
      }
      
      // Ctrl/Cmd + I: 导入进度
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        const fileInput = document.getElementById('progress-import-file');
        if (fileInput) {
          fileInput.click();
        }
      }
    });
  }

  // ==================== 数据验证和修复 ====================
  
  /**
   * 验证并修复进度数据
   */
  function validateAndRepairProgress() {
    const progress = PT.getProgress();
    let needsRepair = false;
    
    // 移除无效的页面ID
    const validPages = [];
    const invalidPages = [];
    
    progress.visitedPages.forEach(pageId => {
      // 检查页面是否在任何阶段中
      let isValid = false;
      for (const stage of Object.values(PT.STAGES)) {
        if (stage.pages.includes(pageId)) {
          isValid = true;
          break;
        }
      }
      
      if (isValid) {
        validPages.push(pageId);
      } else {
        needsRepair = true;
        invalidPages.push(pageId);
      }
    });
    
    if (needsRepair) {
      progress.visitedPages = validPages;
      PT.saveProgress(progress);
      
      // 只在开发模式下显示详细信息
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.info('Progress data cleaned:', {
          removed: invalidPages,
          kept: validPages.length
        });
      }
    }
  }

  // ==================== 初始化 ====================
  
  /**
   * 初始化进度管理
   */
  function init() {
    // 验证和修复进度数据
    validateAndRepairProgress();
    
    // 添加管理界面
    setTimeout(() => {
      addManagementUI();
      addDetailsPanel();
    }, 500);
    
    // 添加键盘快捷键
    addKeyboardShortcuts();
    
    // 监听导航变化
    if (typeof document$ !== 'undefined') {
      document$.subscribe(() => {
        setTimeout(() => {
          addManagementUI();
          addDetailsPanel();
        }, 500);
      });
    }
  }

  // ==================== 导出 API ====================
  
  window.ProgressManagement = {
    handleExport,
    handleImportFile,
    handleReset,
    confirmReset,
    showNotification,
    createManagementButtons,
    createProgressDetailsPanel,
    validateAndRepairProgress
  };

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
