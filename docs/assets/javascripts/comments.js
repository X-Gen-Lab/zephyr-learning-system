/**
 * Giscus 评论系统集成
 * 基于 GitHub Discussions 的评论系统
 * 
 * 配置说明：
 * 1. 确保仓库已启用 GitHub Discussions 功能
 * 2. 安装 Giscus App: https://github.com/apps/giscus
 * 3. 访问 https://giscus.app/zh-CN 获取正确的配置参数
 */

// Giscus 配置
const giscusConfig = {
  repo: 'X-Gen-Lab/zephyr-learning-system',
  repoId: 'R_kgDORYYNgg',
  category: 'Announcements',
  categoryId: 'DIC_kwDORYYNgs4C3MHU',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  theme: 'preferred_color_scheme',
  lang: 'zh-CN',
  loading: 'lazy'
};

/**
 * 加载 Giscus 评论系统
 */
function loadGiscus() {
  // 检查是否在内容页面（非首页、阶段索引页）
  const path = window.location.pathname;
  
  // 首页判断
  const isHomePage = path === '/' || 
                     path === '/index.html' || 
                     path === '/zephyr-learning-system/' || 
                     path === '/zephyr-learning-system/index.html';
  
  // 阶段索引页判断（如 /stage1-foundation/index.html 或 /prerequisites/index.html）
  const isStageIndexPage = /\/(prerequisites|stage\d-[^\/]+|learning-principles)\/(index\.html)?$/.test(path);
  
  if (isHomePage) {
    console.log('[Comments] Skipping comments on homepage:', path);
    return;
  }
  
  if (isStageIndexPage) {
    console.log('[Comments] Skipping comments on stage index page:', path);
    return;
  }

  // 查找评论容器
  const commentsContainer = document.getElementById('comments-container');
  
  if (!commentsContainer) {
    console.warn('[Comments] Comments container not found');
    return;
  }

  // 检查是否已经加载过
  if (commentsContainer.querySelector('script[src*="giscus"]')) {
    console.log('[Comments] Giscus already loaded');
    return;
  }

  console.log('[Comments] Loading Giscus for page:', path);

  // 移除加载提示
  const loadingElement = commentsContainer.querySelector('.comments-loading');
  if (loadingElement) {
    loadingElement.remove();
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

  // 添加错误处理
  script.onerror = function() {
    console.error('[Comments] Failed to load Giscus script');
    const errorMsg = document.createElement('div');
    errorMsg.className = 'comments-error';
    errorMsg.innerHTML = `
      <p>⚠️ 评论系统加载失败</p>
      <p>可能的原因：</p>
      <ul>
        <li>GitHub Discussions 未启用</li>
        <li>Giscus App 未安装</li>
        <li>网络连接问题</li>
      </ul>
      <p>请查看 <a href="/GISCUS_SETUP/" target="_blank">配置指南</a></p>
    `;
    commentsContainer.appendChild(errorMsg);
  };

  commentsContainer.appendChild(script);
  console.log('[Comments] Giscus script added to page');
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
