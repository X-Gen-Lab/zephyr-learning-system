#!/bin/bash
# Zephyr RTOS 学习系统验证脚本
# 用于验证构建结果和内容质量

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 计数器
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# 打印带颜色的消息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    ((WARNING_CHECKS++))
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    ((FAILED_CHECKS++))
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED_CHECKS++))
}

print_check() {
    echo -e "${BLUE}[CHECK]${NC} $1"
    ((TOTAL_CHECKS++))
}

# 检查构建目录
check_build_directory() {
    print_check "检查构建目录..."
    
    if [ ! -d "site" ]; then
        print_error "site/ 目录不存在，请先运行构建"
        return 1
    fi
    
    print_success "构建目录存在"
}

# 检查关键文件
check_required_files() {
    print_check "检查关键文件..."
    
    REQUIRED_FILES=(
        "index.html"
        "search/search_index.json"
        "sitemap.xml"
        "sitemap.xml.gz"
        "404.html"
    )
    
    local all_found=true
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ -f "site/$file" ]; then
            print_success "✓ $file"
        else
            print_error "✗ 缺少文件: $file"
            all_found=false
        fi
    done
    
    if [ "$all_found" = true ]; then
        return 0
    else
        return 1
    fi
}

# 检查 HTML 文件
check_html_files() {
    print_check "检查 HTML 文件..."
    
    HTML_COUNT=$(find site -name "*.html" | wc -l)
    
    if [ "$HTML_COUNT" -eq 0 ]; then
        print_error "未找到任何 HTML 文件"
        return 1
    fi
    
    print_success "找到 $HTML_COUNT 个 HTML 文件"
    
    # 检查 HTML 文件是否有效
    print_info "验证 HTML 文件格式..."
    
    local invalid_count=0
    
    while IFS= read -r html_file; do
        # 简单检查：文件是否包含 <html> 标签
        if ! grep -q "<html" "$html_file"; then
            print_warning "可能无效的 HTML 文件: $html_file"
            ((invalid_count++))
        fi
    done < <(find site -name "*.html")
    
    if [ "$invalid_count" -eq 0 ]; then
        print_success "所有 HTML 文件格式正确"
    else
        print_warning "发现 $invalid_count 个可能无效的 HTML 文件"
    fi
}

# 检查搜索索引
check_search_index() {
    print_check "检查搜索索引..."
    
    SEARCH_INDEX="site/search/search_index.json"
    
    if [ ! -f "$SEARCH_INDEX" ]; then
        print_error "搜索索引文件不存在"
        return 1
    fi
    
    # 检查 JSON 格式
    if command -v python3 &> /dev/null; then
        if python3 -c "import json; json.load(open('$SEARCH_INDEX'))" 2>/dev/null; then
            print_success "搜索索引格式正确"
        else
            print_error "搜索索引 JSON 格式无效"
            return 1
        fi
    else
        print_warning "无法验证 JSON 格式（未安装 Python）"
    fi
    
    # 检查索引大小
    INDEX_SIZE=$(stat -f%z "$SEARCH_INDEX" 2>/dev/null || stat -c%s "$SEARCH_INDEX" 2>/dev/null)
    INDEX_SIZE_KB=$((INDEX_SIZE / 1024))
    
    print_info "搜索索引大小: ${INDEX_SIZE_KB} KB"
    
    if [ "$INDEX_SIZE_KB" -gt 5000 ]; then
        print_warning "搜索索引较大（> 5MB），可能影响加载速度"
    fi
}

# 检查文件大小
check_file_sizes() {
    print_check "检查文件大小..."
    
    # 检查 HTML 文件大小
    print_info "检查 HTML 文件大小..."
    
    local large_files=0
    
    while IFS= read -r html_file; do
        FILE_SIZE=$(stat -f%z "$html_file" 2>/dev/null || stat -c%s "$html_file" 2>/dev/null)
        FILE_SIZE_KB=$((FILE_SIZE / 1024))
        
        if [ "$FILE_SIZE_KB" -gt 500 ]; then
            print_warning "大文件 (${FILE_SIZE_KB} KB): $html_file"
            ((large_files++))
        fi
    done < <(find site -name "*.html")
    
    if [ "$large_files" -eq 0 ]; then
        print_success "所有 HTML 文件大小合理"
    else
        print_warning "发现 $large_files 个大文件（> 500KB）"
    fi
    
    # 检查总大小
    TOTAL_SIZE=$(du -sh site | cut -f1)
    print_info "网站总大小: $TOTAL_SIZE"
}

# 检查图片资源
check_images() {
    print_check "检查图片资源..."
    
    IMAGE_COUNT=$(find site -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" \) | wc -l)
    
    if [ "$IMAGE_COUNT" -eq 0 ]; then
        print_warning "未找到任何图片文件"
    else
        print_success "找到 $IMAGE_COUNT 个图片文件"
        
        # 检查大图片
        print_info "检查大图片..."
        
        local large_images=0
        
        while IFS= read -r image_file; do
            FILE_SIZE=$(stat -f%z "$image_file" 2>/dev/null || stat -c%s "$image_file" 2>/dev/null)
            FILE_SIZE_KB=$((FILE_SIZE / 1024))
            
            if [ "$FILE_SIZE_KB" -gt 200 ]; then
                print_warning "大图片 (${FILE_SIZE_KB} KB): $image_file"
                ((large_images++))
            fi
        done < <(find site -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" \))
        
        if [ "$large_images" -eq 0 ]; then
            print_success "所有图片大小合理"
        else
            print_warning "发现 $large_images 个大图片（> 200KB）"
        fi
    fi
}

# 检查 CSS 和 JavaScript
check_assets() {
    print_check "检查静态资源..."
    
    CSS_COUNT=$(find site -name "*.css" | wc -l)
    JS_COUNT=$(find site -name "*.js" | wc -l)
    
    print_info "CSS 文件: $CSS_COUNT"
    print_info "JavaScript 文件: $JS_COUNT"
    
    if [ "$CSS_COUNT" -eq 0 ]; then
        print_error "未找到 CSS 文件"
        return 1
    fi
    
    if [ "$JS_COUNT" -eq 0 ]; then
        print_warning "未找到 JavaScript 文件"
    fi
    
    print_success "静态资源检查完成"
}

# 检查内部链接（简单检查）
check_internal_links() {
    print_check "检查内部链接..."
    
    print_info "扫描 HTML 文件中的内部链接..."
    
    local broken_links=0
    
    # 这是一个简化的检查，实际应该使用专门的工具
    while IFS= read -r html_file; do
        # 提取相对链接
        while IFS= read -r link; do
            # 简单检查：如果链接以 ../ 或 ./ 开头
            if [[ "$link" =~ ^\.\.?/ ]]; then
                # 计算目标文件路径
                DIR=$(dirname "$html_file")
                TARGET="$DIR/$link"
                
                if [ ! -f "$TARGET" ]; then
                    print_warning "可能的断链: $link (在 $html_file)"
                    ((broken_links++))
                fi
            fi
        done < <(grep -oP 'href="\K[^"]+' "$html_file" 2>/dev/null || true)
    done < <(find site -name "*.html" | head -20)  # 限制检查前20个文件
    
    if [ "$broken_links" -eq 0 ]; then
        print_success "未发现明显的断链"
    else
        print_warning "发现 $broken_links 个可能的断链（建议使用专门工具详细检查）"
    fi
}

# 生成报告
generate_report() {
    echo ""
    echo "=========================================="
    echo "           验证报告"
    echo "=========================================="
    echo ""
    echo "总检查项: $TOTAL_CHECKS"
    echo -e "${GREEN}通过: $PASSED_CHECKS${NC}"
    echo -e "${YELLOW}警告: $WARNING_CHECKS${NC}"
    echo -e "${RED}失败: $FAILED_CHECKS${NC}"
    echo ""
    
    if [ "$FAILED_CHECKS" -eq 0 ]; then
        echo -e "${GREEN}✓ 验证通过！${NC}"
        return 0
    else
        echo -e "${RED}✗ 验证失败，请修复错误后重试${NC}"
        return 1
    fi
}

# 主函数
main() {
    echo "=========================================="
    echo "  Zephyr RTOS 学习系统 - 构建验证"
    echo "=========================================="
    echo ""
    
    check_build_directory || exit 1
    check_required_files
    check_html_files
    check_search_index
    check_file_sizes
    check_images
    check_assets
    check_internal_links
    
    generate_report
}

# 执行主函数
main "$@"
