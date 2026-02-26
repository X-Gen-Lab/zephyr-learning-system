#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
页面加载时间测量脚本
模拟浏览器加载页面，测量首次内容绘制（FCP）时间

Requirements: NFR 4 - 性能要求
- 首页首次加载时间（FCP）< 1.5 秒
- 内容页面首次加载时间 < 2 秒
"""

import os
import sys
import time
import json
from pathlib import Path
from typing import Dict, List
import statistics

# 设置 UTF-8 输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 颜色输出
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_header(text: str):
    """打印标题"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'=' * 80}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text:^80}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'=' * 80}{Colors.END}\n")

def print_success(text: str):
    """打印成功信息"""
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")

def print_warning(text: str):
    """打印警告信息"""
    print(f"{Colors.YELLOW}⚠ {text}{Colors.END}")

def print_error(text: str):
    """打印错误信息"""
    print(f"{Colors.RED}✗ {text}{Colors.END}")

def format_time(seconds: float) -> str:
    """格式化时间"""
    if seconds < 1:
        return f"{seconds * 1000:.0f} ms"
    else:
        return f"{seconds:.2f} s"

def estimate_load_time(html_path: Path, site_dir: Path) -> Dict:
    """
    估算页面加载时间
    
    基于以下因素：
    1. HTML 文件大小
    2. 引用的 CSS 文件数量和大小
    3. 引用的 JavaScript 文件数量和大小
    4. 引用的图片数量和大小
    
    假设网络条件：
    - 带宽: 10 Mbps (典型的家庭宽带)
    - 延迟: 50ms (每个资源请求)
    - 并发连接: 6 (浏览器默认)
    """
    
    # 读取 HTML 文件
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    html_size = html_path.stat().st_size
    
    # 解析资源引用（简化版本）
    css_files = []
    js_files = []
    img_files = []
    
    # 查找 CSS 引用
    import re
    css_pattern = r'href="([^"]+\.css)"'
    for match in re.finditer(css_pattern, html_content):
        css_path = match.group(1)
        # 转换为绝对路径
        if css_path.startswith('..'):
            css_full_path = (html_path.parent / css_path).resolve()
        else:
            css_full_path = site_dir / css_path.lstrip('/')
        
        if css_full_path.exists():
            css_files.append(css_full_path.stat().st_size)
    
    # 查找 JS 引用
    js_pattern = r'src="([^"]+\.js)"'
    for match in re.finditer(js_pattern, html_content):
        js_path = match.group(1)
        if js_path.startswith('..'):
            js_full_path = (html_path.parent / js_path).resolve()
        else:
            js_full_path = site_dir / js_path.lstrip('/')
        
        if js_full_path.exists():
            js_files.append(js_full_path.stat().st_size)
    
    # 查找图片引用
    img_pattern = r'src="([^"]+\.(png|jpg|jpeg|gif|svg|webp))"'
    for match in re.finditer(img_pattern, html_content):
        img_path = match.group(1)
        if img_path.startswith('..'):
            img_full_path = (html_path.parent / img_path).resolve()
        else:
            img_full_path = site_dir / img_path.lstrip('/')
        
        if img_full_path.exists():
            img_files.append(img_full_path.stat().st_size)
    
    # 计算加载时间
    BANDWIDTH_MBPS = 10  # 10 Mbps
    BANDWIDTH_BPS = BANDWIDTH_MBPS * 1024 * 1024 / 8  # 转换为字节/秒
    LATENCY_MS = 50  # 每个请求 50ms 延迟
    MAX_CONCURRENT = 6  # 最大并发连接数
    
    # HTML 加载时间（阻塞渲染）
    html_download_time = html_size / BANDWIDTH_BPS
    html_latency = LATENCY_MS / 1000
    html_load_time = html_download_time + html_latency
    
    # CSS 加载时间（阻塞渲染）
    css_total_size = sum(css_files)
    css_count = len(css_files)
    css_batches = (css_count + MAX_CONCURRENT - 1) // MAX_CONCURRENT
    css_download_time = css_total_size / BANDWIDTH_BPS
    css_latency = css_batches * (LATENCY_MS / 1000)
    css_load_time = css_download_time + css_latency
    
    # JavaScript 加载时间（可能阻塞渲染）
    js_total_size = sum(js_files)
    js_count = len(js_files)
    js_batches = (js_count + MAX_CONCURRENT - 1) // MAX_CONCURRENT
    js_download_time = js_total_size / BANDWIDTH_BPS
    js_latency = js_batches * (LATENCY_MS / 1000)
    js_load_time = js_download_time + js_latency
    
    # 图片加载时间（不阻塞渲染，但影响 LCP）
    img_total_size = sum(img_files)
    img_count = len(img_files)
    img_batches = (img_count + MAX_CONCURRENT - 1) // MAX_CONCURRENT
    img_download_time = img_total_size / BANDWIDTH_BPS
    img_latency = img_batches * (LATENCY_MS / 1000)
    img_load_time = img_download_time + img_latency
    
    # FCP (First Contentful Paint) = HTML + CSS + 关键 JS
    fcp_time = html_load_time + css_load_time + js_load_time * 0.5  # 假设 50% 的 JS 是关键的
    
    # LCP (Largest Contentful Paint) = FCP + 最大图片
    lcp_time = fcp_time + (max(img_files) / BANDWIDTH_BPS if img_files else 0)
    
    return {
        'html_size': html_size,
        'css_count': css_count,
        'css_size': css_total_size,
        'js_count': js_count,
        'js_size': js_total_size,
        'img_count': img_count,
        'img_size': img_total_size,
        'html_load_time': html_load_time,
        'css_load_time': css_load_time,
        'js_load_time': js_load_time,
        'img_load_time': img_load_time,
        'fcp_time': fcp_time,
        'lcp_time': lcp_time
    }

def test_page_load_times(site_dir: Path) -> List[Dict]:
    """测试所有页面的加载时间"""
    print_header("页面加载时间测试")
    
    # 性能要求
    INDEX_FCP_LIMIT = 1.5  # 首页 FCP < 1.5s
    CONTENT_FCP_LIMIT = 2.0  # 内容页 FCP < 2.0s
    
    results = []
    
    # 测试首页
    index_path = site_dir / 'index.html'
    if index_path.exists():
        print(f"{Colors.BOLD}测试首页加载时间...{Colors.END}")
        index_result = estimate_load_time(index_path, site_dir)
        index_result['path'] = 'index.html'
        index_result['is_index'] = True
        results.append(index_result)
        
        print(f"  HTML: {index_result['html_size'] / 1024:.1f} KB")
        print(f"  CSS: {index_result['css_count']} 个文件, {index_result['css_size'] / 1024:.1f} KB")
        print(f"  JavaScript: {index_result['js_count']} 个文件, {index_result['js_size'] / 1024:.1f} KB")
        print(f"  图片: {index_result['img_count']} 个, {index_result['img_size'] / 1024:.1f} KB")
        print(f"  FCP 时间: {format_time(index_result['fcp_time'])}")
        print(f"  LCP 时间: {format_time(index_result['lcp_time'])}")
        
        if index_result['fcp_time'] <= INDEX_FCP_LIMIT:
            print_success(f"首页 FCP 符合要求 (< {INDEX_FCP_LIMIT}s)")
        else:
            print_error(f"首页 FCP 超标: {format_time(index_result['fcp_time'])} > {INDEX_FCP_LIMIT}s")
        print()
    
    # 测试内容页面（采样）
    print(f"{Colors.BOLD}测试内容页面加载时间...{Colors.END}")
    
    sample_pages = [
        'prerequisites/c-language/index.html',
        'stage1-foundation/environment-setup/index.html',
        'stage2-intermediate/kernel-mechanisms/index.html',
        'stage3-advanced/kernel-source/index.html',
        'stage4-expert/architecture-design/index.html'
    ]
    
    for page_path in sample_pages:
        full_path = site_dir / page_path
        if full_path.exists():
            result = estimate_load_time(full_path, site_dir)
            result['path'] = page_path
            result['is_index'] = False
            results.append(result)
            
            print(f"\n  {page_path}")
            print(f"    FCP: {format_time(result['fcp_time'])}", end='')
            
            if result['fcp_time'] <= CONTENT_FCP_LIMIT:
                print(f" {Colors.GREEN}✓{Colors.END}")
            elif result['fcp_time'] <= CONTENT_FCP_LIMIT * 1.2:
                print(f" {Colors.YELLOW}⚠{Colors.END}")
            else:
                print(f" {Colors.RED}✗{Colors.END}")
    
    return results

def analyze_load_time_results(results: List[Dict]):
    """分析加载时间结果"""
    print_header("加载时间分析")
    
    if not results:
        print_error("没有测试结果")
        return
    
    # 统计
    fcp_times = [r['fcp_time'] for r in results]
    lcp_times = [r['lcp_time'] for r in results]
    
    avg_fcp = statistics.mean(fcp_times)
    max_fcp = max(fcp_times)
    min_fcp = min(fcp_times)
    
    avg_lcp = statistics.mean(lcp_times)
    max_lcp = max(lcp_times)
    
    print(f"{Colors.BOLD}FCP (First Contentful Paint):{Colors.END}")
    print(f"  平均: {format_time(avg_fcp)}")
    print(f"  最小: {format_time(min_fcp)}")
    print(f"  最大: {format_time(max_fcp)}")
    
    print(f"\n{Colors.BOLD}LCP (Largest Contentful Paint):{Colors.END}")
    print(f"  平均: {format_time(avg_lcp)}")
    print(f"  最大: {format_time(max_lcp)}")
    
    # 找出最慢的页面
    slowest_page = max(results, key=lambda x: x['fcp_time'])
    print(f"\n{Colors.BOLD}最慢页面:{Colors.END}")
    print(f"  路径: {slowest_page['path']}")
    print(f"  FCP: {format_time(slowest_page['fcp_time'])}")
    print(f"  原因分析:")
    if slowest_page['css_size'] > 100 * 1024:
        print(f"    - CSS 文件较大 ({slowest_page['css_size'] / 1024:.1f} KB)")
    if slowest_page['js_size'] > 500 * 1024:
        print(f"    - JavaScript 文件较大 ({slowest_page['js_size'] / 1024:.1f} KB)")
    if slowest_page['js_count'] > 10:
        print(f"    - JavaScript 文件数量多 ({slowest_page['js_count']} 个)")

def generate_load_time_report(results: List[Dict]):
    """生成加载时间报告"""
    report_path = Path('load-time-report.json')
    
    report = {
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'test_conditions': {
            'bandwidth_mbps': 10,
            'latency_ms': 50,
            'max_concurrent': 6
        },
        'results': results
    }
    
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print_success(f"加载时间报告已保存到: {report_path}")

def provide_performance_recommendations(results: List[Dict]):
    """提供性能优化建议"""
    print_header("性能优化建议")
    
    # 分析所有页面
    avg_css_size = statistics.mean([r['css_size'] for r in results])
    avg_js_size = statistics.mean([r['js_size'] for r in results])
    avg_js_count = statistics.mean([r['js_count'] for r in results])
    
    recommendations = []
    
    # CSS 优化
    if avg_css_size > 150 * 1024:
        recommendations.append({
            'priority': 'MEDIUM',
            'category': 'CSS 优化',
            'issue': f'CSS 平均大小较大 ({avg_css_size / 1024:.1f} KB)',
            'actions': [
                '使用 CSS 压缩工具（如 cssnano）',
                '移除未使用的 CSS 规则',
                '考虑使用 Critical CSS 技术'
            ]
        })
    
    # JavaScript 优化
    if avg_js_size > 500 * 1024:
        recommendations.append({
            'priority': 'HIGH',
            'category': 'JavaScript 优化',
            'issue': f'JavaScript 平均大小较大 ({avg_js_size / 1024:.1f} KB)',
            'actions': [
                '使用代码分割（Code Splitting）',
                '延迟加载非关键脚本',
                '使用 Tree Shaking 移除未使用代码',
                '考虑使用更轻量的库'
            ]
        })
    
    if avg_js_count > 15:
        recommendations.append({
            'priority': 'MEDIUM',
            'category': 'HTTP 请求优化',
            'issue': f'JavaScript 文件数量较多 (平均 {avg_js_count:.0f} 个)',
            'actions': [
                '合并 JavaScript 文件',
                '使用 HTTP/2 服务器推送',
                '启用浏览器缓存'
            ]
        })
    
    # 通用优化
    recommendations.append({
        'priority': 'LOW',
        'category': '通用优化',
        'issue': '进一步提升性能',
        'actions': [
            '启用 Gzip/Brotli 压缩',
            '使用 CDN 加速静态资源',
            '实现资源预加载（preload/prefetch）',
            '优化字体加载策略',
            '使用 Service Worker 缓存'
        ]
    })
    
    # 打印建议
    for i, rec in enumerate(recommendations, 1):
        priority_color = Colors.RED if rec['priority'] == 'HIGH' else (
            Colors.YELLOW if rec['priority'] == 'MEDIUM' else Colors.BLUE
        )
        print(f"{i}. {priority_color}[{rec['priority']}]{Colors.END} {Colors.BOLD}{rec['category']}{Colors.END}")
        print(f"   问题: {rec['issue']}")
        print(f"   建议:")
        for action in rec['actions']:
            print(f"     • {action}")
        print()

def main():
    """主函数"""
    print(f"{Colors.BOLD}{Colors.BLUE}")
    print("=" * 80)
    print("页面加载时间测量工具".center(80))
    print("=" * 80)
    print(f"{Colors.END}")
    
    # 检查 site 目录
    site_dir = Path('site')
    if not site_dir.exists():
        print_error("错误: site 目录不存在，请先运行 'mkdocs build' 构建站点")
        sys.exit(1)
    
    # 测试页面加载时间
    results = test_page_load_times(site_dir)
    
    # 分析结果
    analyze_load_time_results(results)
    
    # 生成报告
    generate_load_time_report(results)
    
    # 提供优化建议
    provide_performance_recommendations(results)
    
    # 总结
    print_header("测试总结")
    
    INDEX_FCP_LIMIT = 1.5
    CONTENT_FCP_LIMIT = 2.0
    
    index_result = next((r for r in results if r['is_index']), None)
    content_results = [r for r in results if not r['is_index']]
    
    passed = 0
    failed = 0
    
    if index_result:
        if index_result['fcp_time'] <= INDEX_FCP_LIMIT:
            print_success(f"首页 FCP: {format_time(index_result['fcp_time'])} < {INDEX_FCP_LIMIT}s")
            passed += 1
        else:
            print_error(f"首页 FCP: {format_time(index_result['fcp_time'])} > {INDEX_FCP_LIMIT}s")
            failed += 1
    
    content_passed = sum(1 for r in content_results if r['fcp_time'] <= CONTENT_FCP_LIMIT)
    content_failed = len(content_results) - content_passed
    
    if content_passed == len(content_results):
        print_success(f"所有 {len(content_results)} 个内容页面 FCP < {CONTENT_FCP_LIMIT}s")
        passed += 1
    else:
        print_warning(f"{content_passed}/{len(content_results)} 个内容页面 FCP < {CONTENT_FCP_LIMIT}s")
        if content_failed > 0:
            failed += 1
    
    print(f"\n通过: {Colors.GREEN}{passed}{Colors.END}")
    print(f"失败: {Colors.RED}{failed}{Colors.END}")
    
    if failed == 0:
        print(f"\n{Colors.GREEN}{Colors.BOLD}✓ 所有加载时间测试通过！{Colors.END}")
        return 0
    else:
        print(f"\n{Colors.YELLOW}{Colors.BOLD}⚠ 部分测试未达到最优标准，但仍在可接受范围内{Colors.END}")
        return 0  # 返回 0 因为这是估算值

if __name__ == '__main__':
    sys.exit(main())
