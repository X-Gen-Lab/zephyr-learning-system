/**
 * Giscus 评论系统集成
 * 基于 GitHub Discussions 的评论系统
 */

// Giscus 配置
const giscusConfig = {
  repo: 'X-Gen-Lab/zephyr-learning-system',
  repoId: 'R_kgDORYYNgg', // 需要从 GitHub 获取
  category: 'Announcements',
  categoryId: 'DIC_kwDORYYNgs4C3MHU', // 需要从 GitHub 获取
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  theme: 'light_high_contrast',
  lang: 'zh-CN',
  loading: 'lazy'
};

/**
 * 加载 Giscus 评论系统
 */
function loadGiscus() {
  // 检查是否在内容页面（非首页、索引页）
  const isContentPage = !window.location.pathname.match(/\/(index\.html)?$/);
  
  if (!isContentPage) {
    return; // 首页和索引页不显示评论
  }

  // 查找评论容器
  const commentsContainer = document.getElementById('comments-container');
  
  if (!commentsContainer) {
    console.warn('Comments container not found');
    return;
  }

  // 移除加载提示
  const loadingElement = commentsContainer.querySelector('.comments-loading');
  if (loadingElement) {
    loadingElement.remove();
  }

  // 检查是否已经加载过
  if (commentsContainer.querySelector('script[src*="giscus"]')) {
    return;
  }

  // 创建 Giscus script 标签
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', giscusConfig.repo);
  script.setAttribute('data-repo-id', giscusConfig.repoId);
  script.setAttribute('data-category', giscusConfig.category);
  script.setAttribute('data-category-id', giscusConfig.categoryId);
  script.setAttribute('data-mapping', giscusConfig.mapping);
  script.setAttribute('data-strict', giscusConfig.strict);
  script.setAttribute('data-reactions-enabled', giscusConfig.reactionsEnabled);
  script.setAttribute('data-emit-metadata', giscusConfig.emitMetadata);
  script.setAttribute('data-input-position', giscusConfig.inputPosition);
  script.setAttribute('data-theme', giscusConfig.theme);
  script.setAttribute('data-lang', giscusConfig.lang);
  script.setAttribute('data-loading', giscusConfig.loading);
  script.setAttribute('crossorigin', 'anonymous');
  script.async = true;

  commentsContainer.appendChild(script);
}

/**
 * 同步评论系统主题与网站主题
 */
function syncCommentTheme() {
  const isDark = document.body.getAttribute('data-md-color-scheme') === 'slate';
  const theme = isDark ? 'dark' : 'light';

  // 查找 Giscus iframe
  const iframe = document.querySelector('iframe.giscus-frame');
  
  if (iframe) {
    // 发送主题切换消息到 iframe
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme } } },
      'https://giscus.app'
    );
  }
}

/**
 * 监听主题切换事件
 */
function observeThemeChanges() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-md-color-scheme') {
        syncCommentTheme();
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-md-color-scheme']
  });
}

/**
 * 初始化评论系统
 */
function initComments() {
  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadGiscus();
      observeThemeChanges();
    });
  } else {
    loadGiscus();
    observeThemeChanges();
  }
}

// 初始化
initComments();

// 监听 Material for MkDocs 的即时导航事件
document.addEventListener('DOMContentLoaded', () => {
  // Material for MkDocs 使用即时导航，需要在每次页面切换时重新加载评论
  const observer = new MutationObserver(() => {
    const commentsContainer = document.getElementById('comments-container');
    if (commentsContainer && !commentsContainer.querySelector('script')) {
      loadGiscus();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
