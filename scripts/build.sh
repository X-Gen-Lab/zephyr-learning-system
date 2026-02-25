#!/bin/bash
# Zephyr RTOS 学习系统构建脚本
# 用于本地开发和生产构建

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Python 环境
check_python() {
    print_info "检查 Python 环境..."
    
    if ! command -v python3 &> /dev/null; then
        print_error "未找到 Python 3，请先安装 Python 3.8 或更高版本"
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_info "Python 版本: $PYTHON_VERSION"
}

# 检查并安装依赖
install_dependencies() {
    print_info "检查并安装依赖..."
    
    if [ ! -d "venv" ]; then
        print_info "创建虚拟环境..."
        python3 -m venv venv
    fi
    
    print_info "激活虚拟环境..."
    source venv/bin/activate
    
    print_info "安装 Python 依赖..."
    pip install -r requirements.txt --quiet
    
    print_info "依赖安装完成"
}

# 验证配置文件
validate_config() {
    print_info "验证配置文件..."
    
    if [ ! -f "mkdocs.yml" ]; then
        print_error "未找到 mkdocs.yml 配置文件"
        exit 1
    fi
    
    # 检查必需字段
    if ! grep -q "site_name:" mkdocs.yml; then
        print_error "mkdocs.yml 缺少 site_name 字段"
        exit 1
    fi
    
    print_info "配置文件验证通过"
}

# 清理旧的构建文件
clean_build() {
    print_info "清理旧的构建文件..."
    
    if [ -d "site" ]; then
        rm -rf site
        print_info "已删除 site/ 目录"
    fi
}

# 本地开发服务器
serve() {
    print_info "启动本地开发服务器..."
    print_info "访问 http://127.0.0.1:8000 查看网站"
    print_info "按 Ctrl+C 停止服务器"
    
    source venv/bin/activate
    mkdocs serve
}

# 构建生产版本
build() {
    print_info "开始构建生产版本..."
    
    source venv/bin/activate
    
    # 使用 --strict 模式，将警告视为错误
    if mkdocs build --strict; then
        print_info "构建成功！"
        print_info "输出目录: site/"
        
        # 显示构建统计
        if [ -d "site" ]; then
            FILE_COUNT=$(find site -type f | wc -l)
            TOTAL_SIZE=$(du -sh site | cut -f1)
            print_info "生成文件数: $FILE_COUNT"
            print_info "总大小: $TOTAL_SIZE"
        fi
    else
        print_error "构建失败，请检查错误信息"
        exit 1
    fi
}

# 验证构建结果
validate_build() {
    print_info "验证构建结果..."
    
    if [ ! -d "site" ]; then
        print_error "site/ 目录不存在，构建可能失败"
        exit 1
    fi
    
    # 检查关键文件
    REQUIRED_FILES=("index.html" "search/search_index.json" "sitemap.xml")
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ ! -f "site/$file" ]; then
            print_error "缺少关键文件: $file"
            exit 1
        fi
    done
    
    print_info "构建结果验证通过"
}

# 显示帮助信息
show_help() {
    cat << EOF
Zephyr RTOS 学习系统构建脚本

用法: ./build.sh [命令]

命令:
  install     安装依赖
  serve       启动本地开发服务器（默认端口 8000）
  build       构建生产版本
  clean       清理构建文件
  validate    验证构建结果
  help        显示此帮助信息

示例:
  ./build.sh install    # 首次使用时安装依赖
  ./build.sh serve      # 启动开发服务器
  ./build.sh build      # 构建生产版本

EOF
}

# 主函数
main() {
    case "${1:-help}" in
        install)
            check_python
            install_dependencies
            ;;
        serve)
            check_python
            validate_config
            serve
            ;;
        build)
            check_python
            validate_config
            clean_build
            build
            validate_build
            ;;
        clean)
            clean_build
            ;;
        validate)
            validate_build
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
