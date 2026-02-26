/**
 * 分析助手模块
 * 提供隐私友好的分析功能支持
 */

// 配置
const analyticsConfig = {
  storageKey: 'analytics-consent',
  dntRespect: true, // 是否尊重 Do Not Track 设置
  provider: 'none' // 可选: 'google', 'plausible', 'umami', 'none'
};

/**
 * 检查是否应该跟踪
 */
function shouldTrack() {
  // 检查 Do Not Track 设置
  if (analyticsConfig.dntRespect) {
    const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    if (dnt === '1' || dnt === 'yes') {
      console.log('Analytics: Do Not Track is enabled, respecting user preference');
      return false;
    }
  }
  
  // 检查用户同意状态
  const consent = localStorage.getItem(analyticsConfig.storageKey);
  if (consent === 'declined') {
    console.log('Analytics: User declined tracking');
    return false;
  }
  
  return true;
}

/**
 * 记录页面浏览（本地统计）
 */
function trackPageViewLocal() {
  const storageKey = 'zephyr-page-views';
  const pageId = window.location.pathname;
  
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
    data[pageId] = (data[pageId] || 0) + 1;
    data._total = (data._total || 0) + 1;
    data._lastVisit = new Date().toISOString();
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to track page view locally:', error);
  }
}

/**
 * 获取本地统计数据
 */
function getLocalStats() {
  try {
    const data = JSON.parse(localStorage.getItem('zephyr-page-views') || '{}');
    return {
      totalViews: data._total || 0,
      lastVisit: data._lastVisit || null,
      pageViews: Object.entries(data)
        .filter(([key]) => !key.startsWith('_'))
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)
    };
  } catch (error) {
    console.error('Failed to get local stats:', error);
    return { totalViews: 0, lastVisit: null, pageViews: [] };
  }
}

/**
 * 显示本地统计（调试用）
 */
function displayLocalStats() {
  const stats = getLocalStats();
  console.log('=== Local Analytics Stats ===');
  console.log(`Total page views: ${stats.totalViews}`);
  console.log(`Last visit: ${stats.lastVisit}`);
  console.log('Top pages:');
  stats.pageViews.slice(0, 10).forEach(({ page, views }) => {
    console.log(`  ${page}: ${views} views`);
  });
}

/**
 * 加载 Google Analytics
 */
function loadGoogleAnalytics(measurementId) {
  if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
    console.log('Analytics: Google Analytics not configured');
    return;
  }
  
  // 加载 gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  
  // 初始化 gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', measurementId, {
    'anonymize_ip': true, // IP 匿名化
    'cookie_flags': 'SameSite=None;Secure'
  });
  
  console.log('Analytics: Google Analytics loaded');
}

/**
 * 加载 Plausible Analytics
 */
function loadPlausibleAnalytics(domain) {
  if (!domain) {
    console.log('Analytics: Plausible domain not configured');
    return;
  }
  
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = domain;
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
  
  console.log('Analytics: Plausible Analytics loaded');
}

/**
 * 加载 Umami Analytics
 */
function loadUmamiAnalytics(websiteId, scriptUrl) {
  if (!websiteId || !scriptUrl) {
    console.log('Analytics: Umami not configured');
    return;
  }
  
  const script = document.createElement('script');
  script.async = true;
  script.dataset.websiteId = websiteId;
  script.src = scriptUrl;
  document.head.appendChild(script);
  
  console.log('Analytics: Umami Analytics loaded');
}

/**
 * 初始化分析
 */
function initAnalytics() {
  // 始终记录本地统计
  trackPageViewLocal();
  
  // 检查是否应该加载外部分析
  if (!shouldTrack()) {
    console.log('Analytics: Tracking disabled');
    return;
  }
  
  // 根据配置加载相应的分析服务
  // 注意：实际配置应该从 mkdocs.yml 的 extra 配置中读取
  // 这里仅作为示例
  
  // 示例：如果使用 Google Analytics
  // const gaId = document.querySelector('meta[name="google-analytics"]')?.content;
  // if (gaId) {
  //   loadGoogleAnalytics(gaId);
  // }
  
  console.log('Analytics: Initialized (local tracking only)');
}

/**
 * 导出统计数据
 */
function exportLocalStats() {
  const stats = getLocalStats();
  const dataStr = JSON.stringify(stats, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}

/**
 * 清除本地统计
 */
function clearLocalStats() {
  if (confirm('确定要清除所有本地统计数据吗？')) {
    localStorage.removeItem('zephyr-page-views');
    console.log('Analytics: Local stats cleared');
  }
}

// 初始化
initAnalytics();

// 暴露到全局（用于调试）
if (typeof window !== 'undefined') {
  window.analyticsHelper = {
    getStats: getLocalStats,
    displayStats: displayLocalStats,
    exportStats: exportLocalStats,
    clearStats: clearLocalStats,
    shouldTrack: shouldTrack
  };
}

// 监听页面导航（Material for MkDocs 即时导航）
document.addEventListener('DOMContentLoaded', () => {
  let lastPath = window.location.pathname;
  
  const observer = new MutationObserver(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      trackPageViewLocal();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
