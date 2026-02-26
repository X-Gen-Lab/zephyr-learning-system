/**
 * 反馈功能模块
 * 提供"报告问题"、"建议改进"和"内容有用"点赞功能
 */

// 配置
const feedbackConfig = {
  repo: 'X-Gen-Lab/zephyr-learning-system',
  issueLabels: ['feedback', 'user-report'],
  storageKey: 'zephyr-learning-likes'
};

/**
 * 获取当前页面信息
 */
function getCurrentPageInfo() {
  return {
    title: document.title,
    url: window.location.href,
    path: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };
}

/**
 * 生成 GitHub Issue 链接
 */
function generateIssueLink(type = 'bug') {
  const pageInfo = getCurrentPageInfo();
  
  let issueTitle, issueBody, labels;
  
  if (type === 'bug') {
    issueTitle = `[问题反馈] ${pageInfo.title}`;
    issueBody = `## 页面信息
- **页面标题**: ${pageInfo.title}
- **页面 URL**: ${pageInfo.url}
- **浏览器**: ${pageInfo.userAgent}
- **时间**: ${pageInfo.timestamp}

## 问题描述
请在此描述您遇到的问题...

## 期望行为
请描述您期望的正确行为...

## 截图（可选）
如果适用，请添加截图以帮助说明问题。

## 其他信息
请添加任何其他相关信息...
`;
    labels = 'feedback,bug';
  } else if (type === 'improvement') {
    issueTitle = `[改进建议] ${pageInfo.title}`;
    issueBody = `## 页面信息
- **页面标题**: ${pageInfo.title}
- **页面 URL**: ${pageInfo.url}
- **时间**: ${pageInfo.timestamp}

## 改进建议
请在此描述您的改进建议...

## 预期效果
请描述实施改进后的预期效果...

## 其他想法
请添加任何其他相关想法...
`;
    labels = 'feedback,enhancement';
  }
  
  const encodedTitle = encodeURIComponent(issueTitle);
  const encodedBody = encodeURIComponent(issueBody);
  const encodedLabels = encodeURIComponent(labels);
  
  return `https://github.com/${feedbackConfig.repo}/issues/new?title=${encodedTitle}&body=${encodedBody}&labels=${encodedLabels}`;
}

/**
 * 获取点赞数据
 */
function getLikesData() {
  try {
    const data = localStorage.getItem(feedbackConfig.storageKey);
    return data ? JSON.parse(data) : { likes: {}, userLikes: [] };
  } catch (error) {
    console.error('Failed to load likes data:', error);
    return { likes: {}, userLikes: [] };
  }
}

/**
 * 保存点赞数据
 */
function saveLikesData(data) {
  try {
    localStorage.setItem(feedbackConfig.storageKey, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save likes data:', error);
  }
}

/**
 * 获取页面 ID
 */
function getPageId() {
  return window.location.pathname.replace(/\//g, '-').replace(/\.html$/, '') || 'home';
}

/**
 * 检查用户是否已点赞
 */
function hasUserLiked(pageId) {
  const data = getLikesData();
  return data.userLikes.includes(pageId);
}

/**
 * 获取页面点赞数
 */
function getPageLikes(pageId) {
  const data = getLikesData();
  return data.likes[pageId] || 0;
}

/**
 * 切换点赞状态
 */
function toggleLike(pageId) {
  const data = getLikesData();
  const currentLikes = data.likes[pageId] || 0;
  const hasLiked = data.userLikes.includes(pageId);
  
  if (hasLiked) {
    // 取消点赞
    data.likes[pageId] = Math.max(0, currentLikes - 1);
    data.userLikes = data.userLikes.filter(id => id !== pageId);
  } else {
    // 添加点赞
    data.likes[pageId] = currentLikes + 1;
    data.userLikes.push(pageId);
  }
  
  saveLikesData(data);
  return {
    likes: data.likes[pageId],
    isLiked: !hasLiked
  };
}

/**
 * 更新点赞按钮显示
 */
function updateLikeButton(button, likes, isLiked) {
  const icon = button.querySelector('.icon');
  const count = button.querySelector('.like-count');
  
  if (icon) {
    icon.textContent = isLiked ? '❤️' : '🤍';
  }
  
  if (count) {
    count.textContent = likes;
  }
  
  if (isLiked) {
    button.classList.add('liked');
  } else {
    button.classList.remove('liked');
  }
}

/**
 * 创建反馈容器
 */
function createFeedbackContainer() {
  const pageId = getPageId();
  const likes = getPageLikes(pageId);
  const isLiked = hasUserLiked(pageId);
  
  const container = document.createElement('div');
  container.className = 'feedback-container';
  container.innerHTML = `
    <div class="feedback-header">
      <h3>📝 页面反馈</h3>
      <p class="feedback-description">
        您的反馈对我们非常重要！请告诉我们这个页面是否有帮助，或者报告您发现的问题。
      </p>
    </div>
    <div class="feedback-actions">
      <button class="like-button ${isLiked ? 'liked' : ''}" id="like-button" title="这个页面有帮助">
        <span class="icon">${isLiked ? '❤️' : '🤍'}</span>
        <span class="like-count">${likes}</span>
        <span class="text">有帮助</span>
      </button>
      <a href="${generateIssueLink('bug')}" class="feedback-button report-issue" target="_blank" rel="noopener">
        <span class="icon">🐛</span>
        <span class="text">报告问题</span>
      </a>
      <a href="${generateIssueLink('improvement')}" class="feedback-button suggest-improvement" target="_blank" rel="noopener">
        <span class="icon">💡</span>
        <span class="text">建议改进</span>
      </a>
    </div>
  `;
  
  return container;
}

/**
 * 初始化点赞按钮事件
 */
function initLikeButton() {
  const likeButton = document.getElementById('like-button');
  
  if (!likeButton) {
    return;
  }
  
  likeButton.addEventListener('click', () => {
    const pageId = getPageId();
    const result = toggleLike(pageId);
    updateLikeButton(likeButton, result.likes, result.isLiked);
    
    // 显示反馈提示
    showNotification(
      result.isLiked ? '感谢您的反馈！' : '已取消点赞',
      result.isLiked ? 'success' : 'info'
    );
  });
}

/**
 * 显示通知
 */
function showNotification(message, type = 'info') {
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
    <button class="notification-close" aria-label="关闭">×</button>
  `;
  
  document.body.appendChild(notification);
  
  // 关闭按钮事件
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', () => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  });
  
  // 自动关闭
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * 插入反馈容器到页面
 */
function insertFeedbackContainer() {
  // 检查是否在内容页面
  const isContentPage = !window.location.pathname.match(/\/(index\.html)?$/);
  
  if (!isContentPage) {
    return; // 首页和索引页不显示反馈
  }
  
  // 查找评论容器
  const commentsContainer = document.getElementById('comments-container');
  
  if (!commentsContainer) {
    console.warn('Comments container not found');
    return;
  }
  
  // 在评论容器之前插入反馈容器
  const feedbackContainer = createFeedbackContainer();
  commentsContainer.parentNode.insertBefore(feedbackContainer, commentsContainer);
  
  // 初始化点赞按钮
  initLikeButton();
}

/**
 * 初始化反馈功能
 */
function initFeedback() {
  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertFeedbackContainer);
  } else {
    insertFeedbackContainer();
  }
}

// 初始化
initFeedback();

// 监听 Material for MkDocs 的即时导航事件
document.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver(() => {
    const feedbackContainer = document.querySelector('.feedback-container');
    if (!feedbackContainer && document.getElementById('comments-container')) {
      insertFeedbackContainer();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
