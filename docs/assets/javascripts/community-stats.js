/**
 * 社区统计模块
 * 从 GitHub API 获取仓库统计信息并显示
 */

// 配置
const communityConfig = {
  repo: 'X-Gen-Lab/zephyr-learning-system',
  apiBase: 'https://api.github.com',
  cacheKey: 'zephyr-community-stats',
  cacheDuration: 3600000 // 1 hour in milliseconds
};

/**
 * 从缓存获取数据
 */
function getCachedData(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const now = Date.now();
    
    // 检查缓存是否过期
    if (now - data.timestamp > communityConfig.cacheDuration) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data.value;
  } catch (error) {
    console.error('Failed to get cached data:', error);
    return null;
  }
}

/**
 * 缓存数据
 */
function setCachedData(key, value) {
  try {
    const data = {
      value,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to cache data:', error);
  }
}

/**
 * 获取 GitHub 仓库统计
 */
async function fetchGitHubStats() {
  // 尝试从缓存获取
  const cached = getCachedData(`${communityConfig.cacheKey}-stats`);
  if (cached) {
    return cached;
  }
  
  const apiUrl = `${communityConfig.apiBase}/repos/${communityConfig.repo}`;
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const stats = {
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.subscribers_count,
      openIssues: data.open_issues_count,
      lastUpdate: data.updated_at,
      language: data.language,
      size: data.size
    };
    
    // 缓存数据
    setCachedData(`${communityConfig.cacheKey}-stats`, stats);
    
    return stats;
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error);
    return null;
  }
}

/**
 * 获取贡献者列表
 */
async function fetchContributors() {
  // 尝试从缓存获取
  const cached = getCachedData(`${communityConfig.cacheKey}-contributors`);
  if (cached) {
    return cached;
  }
  
  const apiUrl = `${communityConfig.apiBase}/repos/${communityConfig.repo}/contributors`;
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const contributors = data.map(c => ({
      username: c.login,
      avatar: c.avatar_url,
      contributions: c.contributions,
      profile: c.html_url
    }));
    
    // 缓存数据
    setCachedData(`${communityConfig.cacheKey}-contributors`, contributors);
    
    return contributors;
  } catch (error) {
    console.error('Failed to fetch contributors:', error);
    return [];
  }
}

/**
 * 格式化数字
 */
function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

/**
 * 格式化日期
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return '今天';
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return `${diffDays} 天前`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} 周前`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} 个月前`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} 年前`;
  }
}

/**
 * 创建统计卡片
 */
function createStatCard(icon, value, label) {
  return `
    <div class="stat-card">
      <div class="stat-icon">${icon}</div>
      <div class="stat-value">${value}</div>
      <div class="stat-label">${label}</div>
    </div>
  `;
}

/**
 * 创建加载骨架屏
 */
function createLoadingSkeleton() {
  return `
    <div class="stats-loading">
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
    </div>
  `;
}

/**
 * 显示社区统计
 */
async function displayCommunityStats() {
  const container = document.getElementById('community-stats-container');
  
  if (!container) {
    return;
  }
  
  // 显示加载状态
  container.innerHTML = createLoadingSkeleton();
  
  try {
    // 并行获取统计和贡献者数据
    const [stats, contributors] = await Promise.all([
      fetchGitHubStats(),
      fetchContributors()
    ]);
    
    if (!stats) {
      container.innerHTML = '<p>无法加载社区统计数据</p>';
      return;
    }
    
    // 构建统计卡片
    const statsHTML = `
      <div class="stats-grid">
        ${createStatCard('⭐', formatNumber(stats.stars), 'Stars')}
        ${createStatCard('🍴', formatNumber(stats.forks), 'Forks')}
        ${createStatCard('👥', contributors.length, '贡献者')}
        ${createStatCard('📝', formatNumber(stats.openIssues), 'Open Issues')}
      </div>
    `;
    
    // 构建贡献者列表
    const contributorsHTML = contributors.length > 0 ? `
      <div class="contributors-section">
        <h3>🌟 贡献者</h3>
        <div class="contributors-list">
          ${contributors.slice(0, 12).map(c => `
            <a href="${c.profile}" target="_blank" rel="noopener" title="${c.username} (${c.contributions} 次贡献)">
              <img src="${c.avatar}" alt="${c.username}" class="contributor-avatar" loading="lazy">
            </a>
          `).join('')}
        </div>
        <p class="contributors-count">
          共有 <strong>${contributors.length}</strong> 位贡献者参与了本项目
        </p>
      </div>
    ` : '';
    
    // 构建活动信息
    const activityHTML = `
      <div class="activity-section">
        <h3>📊 项目活动</h3>
        <div class="activity-item">
          <span class="activity-icon">🔄</span>
          <div class="activity-content">
            <div class="activity-title">最后更新</div>
            <div class="activity-time">${formatDate(stats.lastUpdate)}</div>
          </div>
        </div>
        <div class="activity-item">
          <span class="activity-icon">💻</span>
          <div class="activity-content">
            <div class="activity-title">主要语言</div>
            <div class="activity-time">${stats.language || 'Markdown'}</div>
          </div>
        </div>
      </div>
    `;
    
    // 构建行动号召
    const ctaHTML = `
      <div class="community-cta">
        <h3>🚀 加入我们</h3>
        <p>
          欢迎参与 Zephyr RTOS 学习系统的建设！无论是内容贡献、问题反馈还是功能建议，
          我们都非常欢迎您的参与。
        </p>
        <a href="https://github.com/${communityConfig.repo}" class="cta-button" target="_blank" rel="noopener">
          <span>⭐</span>
          <span>访问 GitHub 仓库</span>
        </a>
      </div>
    `;
    
    // 组合所有内容
    container.innerHTML = statsHTML + contributorsHTML + activityHTML + ctaHTML;
    
  } catch (error) {
    console.error('Failed to display community stats:', error);
    container.innerHTML = '<p>加载社区统计时出错，请稍后再试</p>';
  }
}

/**
 * 创建社区统计容器
 */
function createCommunityStatsContainer() {
  const container = document.createElement('div');
  container.className = 'community-stats';
  container.innerHTML = `
    <h2>🌐 社区统计</h2>
    <div id="community-stats-container">
      ${createLoadingSkeleton()}
    </div>
  `;
  return container;
}

/**
 * 插入社区统计到首页
 */
function insertCommunityStats() {
  // 只在首页显示
  const isHomePage = window.location.pathname.match(/\/(index\.html)?$/);
  
  if (!isHomePage) {
    return;
  }
  
  // 查找合适的插入位置（在主内容区域的末尾）
  const mainContent = document.querySelector('.md-content__inner');
  
  if (!mainContent) {
    console.warn('Main content area not found');
    return;
  }
  
  // 创建并插入社区统计容器
  const statsContainer = createCommunityStatsContainer();
  mainContent.appendChild(statsContainer);
  
  // 加载统计数据
  displayCommunityStats();
}

/**
 * 初始化社区统计
 */
function initCommunityStats() {
  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertCommunityStats);
  } else {
    insertCommunityStats();
  }
}

// 初始化
initCommunityStats();

// 监听 Material for MkDocs 的即时导航事件
document.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver(() => {
    const isHomePage = window.location.pathname.match(/\/(index\.html)?$/);
    const statsExists = document.querySelector('.community-stats');
    
    if (isHomePage && !statsExists) {
      insertCommunityStats();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
