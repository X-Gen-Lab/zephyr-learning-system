#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
性能测试脚本
测量页面加载性能、文件大小和优化建议

Requirements: 11.1 - 页面加载性能要求
- 首页首次加载时间（FCP）< 1.5 秒
- 内容页面首次加载时间 < 2 秒
- 单个 HTML 页面大小 < 200KB（压缩后）
"""

import os
import sys
import json
import gzip
import time
from pathlib import Path
from typing import Dict, List, Tuple
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

def get_file_size(file_path: Path) -> int:
    """获取文件大小（字节）"""
    return file_path.stat().st_size

def get_gzip_size(file_path: Path) -> int:
    """获取 Gzip 压缩后的文件大小"""
    with open(file_path, 'rb') as f:
        content = f.read()
    compressed = gzip.compress(content, compresslevel=9)
    return len(compressed)

def format_size(size_bytes: int) -> str:
    """格式化文件大小"""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.2f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f} MB"

def analyze_html_file(file_path: Path) -> Dict:
    """分析单个 HTML 文件"""
    original_size = get_file_size(file_path)
    gzip_size = get_gzip_size(file_path)
    compression_ratio = (1 - gzip_size / original_size) * 100
    
    # 读取文件内容分析
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 统计资源引用
    css_count = content.count('<link') + content.count('<style')
    js_count = content.count('<script')
    img_count = content.count('<img')
    
    return {
        'path': str(file_path.relative_to(Path('site'))),
        'original_size': original_size,
        'gzip_size': gzip_size,
        'compression_ratio': compression_ratio,
        'css_count': css_count,
        'js_count': js_count,
        'img_count': img_count
    }

def scan_html_files(site_dir: Path) -> List[Dict]:
    """扫描所有 HTML 文件"""
    html_files = []
    for html_file in site_dir.rglob('*.html'):
        if html_file.is_file():
            html_files.append(analyze_html_file(html_file))
    return html_files

def test_page_sizes(html_files: List[Dict]) -> Tuple[int, int, int]:
    """测试页面大小"""
    print_header("页面大小测试")
    
    # 性能要求
    MAX_SIZE_KB = 200  # 200KB 压缩后
    MAX_SIZE_BYTES = MAX_SIZE_KB * 1024
    
    passed = 0
    failed = 0
    warnings = 0
    
    # 找出首页和最大的页面
    index_page = next((f for f in html_files if f['path'] == 'index.html'), None)
    largest_page = max(html_files, key=lambda x: x['gzip_size'])
    
    print(f"总页面数: {len(html_files)}")
    print(f"最大页面: {largest_page['path']} ({format_size(largest_page['gzip_size'])} 压缩后)\n")
    
    # 测试首页
    if index_page:
        print(f"{Colors.BOLD}首页性能:{Colors.END}")
        print(f"  路径: {index_page['path']}")
        print(f"  原始大小: {format_size(index_page['original_size'])}")
        print(f"  压缩大小: {format_size(index_page['gzip_size'])}")
        print(f"  压缩率: {index_page['compression_ratio']:.1f}%")
        
        if index_page['gzip_size'] <= MAX_SIZE_BYTES:
            print_success(f"首页大小符合要求 (< {MAX_SIZE_KB}KB)")
            passed += 1
        else:
            print_error(f"首页大小超标: {format_size(index_page['gzip_size'])} > {MAX_SIZE_KB}KB")
            failed += 1
        print()
    
    # 测试所有页面
    print(f"{Colors.BOLD}所有页面大小检查:{Colors.END}")
    oversized_pages = []
    
    for file_info in html_files:
        if file_info['gzip_size'] > MAX_SIZE_BYTES:
            oversized_pages.append(file_info)
            print_error(f"{file_info['path']}: {format_size(file_info['gzip_size'])} (超过 {MAX_SIZE_KB}KB)")
            failed += 1
        elif file_info['gzip_size'] > MAX_SIZE_BYTES * 0.8:  # 80% 阈值警告
            print_warning(f"{file_info['path']}: {format_size(file_info['gzip_size'])} (接近限制)")
            warnings += 1
            passed += 1
        else:
            passed += 1
    
    if not oversized_pages:
        print_success(f"所有 {len(html_files)} 个页面大小都符合要求")
    else:
        print(f"\n{Colors.BOLD}超标页面详情:{Colors.END}")
        for page in oversized_pages:
            print(f"  {page['path']}:")
            print(f"    原始: {format_size(page['original_size'])}")
            print(f"    压缩: {format_size(page['gzip_size'])}")
            print(f"    CSS: {page['css_count']}, JS: {page['js_count']}, 图片: {page['img_count']}")
    
    return passed, failed, warnings

def test_compression_ratio(html_files: List[Dict]) -> Tuple[int, int, int]:
    """测试压缩率"""
    print_header("压缩率测试")
    
    # 要求压缩率 > 70%
    MIN_COMPRESSION_RATIO = 70.0
    
    passed = 0
    failed = 0
    warnings = 0
    
    compression_ratios = [f['compression_ratio'] for f in html_files]
    avg_ratio = statistics.mean(compression_ratios)
    min_ratio = min(compression_ratios)
    max_ratio = max(compression_ratios)
    
    print(f"平均压缩率: {avg_ratio:.1f}%")
    print(f"最小压缩率: {min_ratio:.1f}%")
    print(f"最大压缩率: {max_ratio:.1f}%\n")
    
    if avg_ratio >= MIN_COMPRESSION_RATIO:
        print_success(f"平均压缩率符合要求 (>= {MIN_COMPRESSION_RATIO}%)")
        passed += 1
    else:
        print_error(f"平均压缩率不足: {avg_ratio:.1f}% < {MIN_COMPRESSION_RATIO}%")
        failed += 1
    
    # 检查低压缩率页面
    low_compression_pages = [f for f in html_files if f['compression_ratio'] < MIN_COMPRESSION_RATIO]
    
    if low_compression_pages:
        print(f"\n{Colors.BOLD}低压缩率页面 (< {MIN_COMPRESSION_RATIO}%):{Colors.END}")
        for page in low_compression_pages[:10]:  # 只显示前 10 个
            print_warning(f"{page['path']}: {page['compression_ratio']:.1f}%")
            warnings += 1
    
    return passed, failed, warnings

def analyze_static_resources(site_dir: Path) -> Dict:
    """分析静态资源"""
    print_header("静态资源分析")
    
    resources = {
        'css': [],
        'js': [],
        'images': [],
        'fonts': []
    }
    
    # CSS 文件
    for css_file in site_dir.rglob('*.css'):
        if css_file.is_file():
            resources['css'].append({
                'path': str(css_file.relative_to(site_dir)),
                'size': get_file_size(css_file),
                'gzip_size': get_gzip_size(css_file)
            })
    
    # JavaScript 文件
    for js_file in site_dir.rglob('*.js'):
        if js_file.is_file():
            resources['js'].append({
                'path': str(js_file.relative_to(site_dir)),
                'size': get_file_size(js_file),
                'gzip_size': get_gzip_size(js_file)
            })
    
    # 图片文件
    for ext in ['*.png', '*.jpg', '*.jpeg', '*.gif', '*.svg', '*.webp']:
        for img_file in site_dir.rglob(ext):
            if img_file.is_file():
                resources['images'].append({
                    'path': str(img_file.relative_to(site_dir)),
                    'size': get_file_size(img_file)
                })
    
    # 字体文件
    for ext in ['*.woff', '*.woff2', '*.ttf', '*.eot']:
        for font_file in site_dir.rglob(ext):
            if font_file.is_file():
                resources['fonts'].append({
                    'path': str(font_file.relative_to(site_dir)),
                    'size': get_file_size(font_file)
                })
    
    # 打印统计
    print(f"{Colors.BOLD}CSS 文件:{Colors.END}")
    total_css_size = sum(r['size'] for r in resources['css'])
    total_css_gzip = sum(r['gzip_size'] for r in resources['css'])
    print(f"  数量: {len(resources['css'])}")
    print(f"  总大小: {format_size(total_css_size)}")
    print(f"  压缩后: {format_size(total_css_gzip)}")
    if resources['css']:
        print(f"  压缩率: {(1 - total_css_gzip / total_css_size) * 100:.1f}%")
    
    print(f"\n{Colors.BOLD}JavaScript 文件:{Colors.END}")
    total_js_size = sum(r['size'] for r in resources['js'])
    total_js_gzip = sum(r['gzip_size'] for r in resources['js'])
    print(f"  数量: {len(resources['js'])}")
    print(f"  总大小: {format_size(total_js_size)}")
    print(f"  压缩后: {format_size(total_js_gzip)}")
    if resources['js']:
        print(f"  压缩率: {(1 - total_js_gzip / total_js_size) * 100:.1f}%")
    
    print(f"\n{Colors.BOLD}图片文件:{Colors.END}")
    total_img_size = sum(r['size'] for r in resources['images'])
    print(f"  数量: {len(resources['images'])}")
    print(f"  总大小: {format_size(total_img_size)}")
    
    # 找出大图片
    large_images = [r for r in resources['images'] if r['size'] > 200 * 1024]
    if large_images:
        print(f"\n  {Colors.YELLOW}大图片 (> 200KB):{Colors.END}")
        for img in sorted(large_images, key=lambda x: x['size'], reverse=True)[:5]:
            print(f"    {img['path']}: {format_size(img['size'])}")
    
    print(f"\n{Colors.BOLD}字体文件:{Colors.END}")
    total_font_size = sum(r['size'] for r in resources['fonts'])
    print(f"  数量: {len(resources['fonts'])}")
    print(f"  总大小: {format_size(total_font_size)}")
    
    return resources

def generate_performance_report(html_files: List[Dict], resources: Dict) -> Dict:
    """生成性能报告"""
    print_header("性能报告生成")
    
    # 计算总体统计
    total_html_size = sum(f['original_size'] for f in html_files)
    total_html_gzip = sum(f['gzip_size'] for f in html_files)
    
    total_css_size = sum(r['size'] for r in resources['css'])
    total_js_size = sum(r['size'] for r in resources['js'])
    total_img_size = sum(r['size'] for r in resources['images'])
    total_font_size = sum(r['size'] for r in resources['fonts'])
    
    total_site_size = total_html_size + total_css_size + total_js_size + total_img_size + total_font_size
    
    report = {
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'summary': {
            'total_pages': len(html_files),
            'total_html_size': total_html_size,
            'total_html_gzip': total_html_gzip,
            'total_css_size': total_css_size,
            'total_js_size': total_js_size,
            'total_img_size': total_img_size,
            'total_font_size': total_font_size,
            'total_site_size': total_site_size
        },
        'html_files': html_files,
        'resources': resources
    }
    
    # 保存报告
    report_path = Path('performance-report.json')
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print_success(f"性能报告已保存到: {report_path}")
    
    # 打印摘要
    print(f"\n{Colors.BOLD}站点总体统计:{Colors.END}")
    print(f"  总页面数: {len(html_files)}")
    print(f"  HTML 总大小: {format_size(total_html_size)} (原始) / {format_size(total_html_gzip)} (压缩)")
    print(f"  CSS 总大小: {format_size(total_css_size)}")
    print(f"  JavaScript 总大小: {format_size(total_js_size)}")
    print(f"  图片总大小: {format_size(total_img_size)}")
    print(f"  字体总大小: {format_size(total_font_size)}")
    print(f"  站点总大小: {format_size(total_site_size)}")
    
    return report

def provide_optimization_suggestions(html_files: List[Dict], resources: Dict):
    """提供优化建议"""
    print_header("优化建议")
    
    suggestions = []
    
    # 检查大页面
    large_pages = [f for f in html_files if f['gzip_size'] > 200 * 1024]
    if large_pages:
        suggestions.append({
            'priority': 'HIGH',
            'category': '页面大小',
            'issue': f'发现 {len(large_pages)} 个页面超过 200KB',
            'suggestion': '考虑拆分长页面、延迟加载图片、减少内联资源'
        })
    
    # 检查低压缩率
    low_compression = [f for f in html_files if f['compression_ratio'] < 70]
    if low_compression:
        suggestions.append({
            'priority': 'MEDIUM',
            'category': '压缩率',
            'issue': f'发现 {len(low_compression)} 个页面压缩率低于 70%',
            'suggestion': '检查是否包含大量不可压缩内容（如 base64 图片）'
        })
    
    # 检查大图片
    large_images = [r for r in resources['images'] if r['size'] > 200 * 1024]
    if large_images:
        suggestions.append({
            'priority': 'HIGH',
            'category': '图片优化',
            'issue': f'发现 {len(large_images)} 个图片超过 200KB',
            'suggestion': '使用图片压缩工具、转换为 WebP 格式、实现响应式图片'
        })
    
    # 检查 CSS 数量
    if len(resources['css']) > 5:
        suggestions.append({
            'priority': 'MEDIUM',
            'category': 'CSS 优化',
            'issue': f'CSS 文件数量较多 ({len(resources["css"])} 个)',
            'suggestion': '考虑合并 CSS 文件、使用 CSS 压缩工具'
        })
    
    # 检查 JS 数量
    if len(resources['js']) > 10:
        suggestions.append({
            'priority': 'MEDIUM',
            'category': 'JavaScript 优化',
            'issue': f'JavaScript 文件数量较多 ({len(resources["js"])} 个)',
            'suggestion': '考虑合并 JS 文件、使用代码分割、延迟加载非关键脚本'
        })
    
    # 打印建议
    if not suggestions:
        print_success("未发现明显的性能问题，站点性能良好！")
    else:
        for i, sug in enumerate(suggestions, 1):
            priority_color = Colors.RED if sug['priority'] == 'HIGH' else Colors.YELLOW
            print(f"{i}. {priority_color}[{sug['priority']}]{Colors.END} {Colors.BOLD}{sug['category']}{Colors.END}")
            print(f"   问题: {sug['issue']}")
            print(f"   建议: {sug['suggestion']}\n")

def main():
    """主函数"""
    print(f"{Colors.BOLD}{Colors.BLUE}")
    print("=" * 80)
    print("Zephyr RTOS 学习系统 - 性能测试工具".center(80))
    print("=" * 80)
    print(f"{Colors.END}")
    
    # 检查 site 目录
    site_dir = Path('site')
    if not site_dir.exists():
        print_error("错误: site 目录不存在，请先运行 'mkdocs build' 构建站点")
        sys.exit(1)
    
    # 扫描 HTML 文件
    print("正在扫描 HTML 文件...")
    html_files = scan_html_files(site_dir)
    print_success(f"找到 {len(html_files)} 个 HTML 文件\n")
    
    # 运行测试
    total_passed = 0
    total_failed = 0
    total_warnings = 0
    
    # 测试页面大小
    passed, failed, warnings = test_page_sizes(html_files)
    total_passed += passed
    total_failed += failed
    total_warnings += warnings
    
    # 测试压缩率
    passed, failed, warnings = test_compression_ratio(html_files)
    total_passed += passed
    total_failed += failed
    total_warnings += warnings
    
    # 分析静态资源
    resources = analyze_static_resources(site_dir)
    
    # 生成性能报告
    report = generate_performance_report(html_files, resources)
    
    # 提供优化建议
    provide_optimization_suggestions(html_files, resources)
    
    # 打印测试总结
    print_header("测试总结")
    print(f"通过: {Colors.GREEN}{total_passed}{Colors.END}")
    print(f"失败: {Colors.RED}{total_failed}{Colors.END}")
    print(f"警告: {Colors.YELLOW}{total_warnings}{Colors.END}")
    
    if total_failed == 0:
        print(f"\n{Colors.GREEN}{Colors.BOLD}✓ 所有性能测试通过！{Colors.END}")
        return 0
    else:
        print(f"\n{Colors.RED}{Colors.BOLD}✗ 部分性能测试失败，请查看上述详情{Colors.END}")
        return 1

if __name__ == '__main__':
    sys.exit(main())
