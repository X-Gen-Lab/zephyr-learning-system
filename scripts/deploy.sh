#!/bin/bash
# Zephyr RTOS 学习系统部署脚本
# 用于部署到 GitHub Pages 或其他静态托管服务

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查 Git 环境
check_git() {
    print_info "检查 Git 环境..."
    
    if ! command -v git &> /dev/null; then
        print_error "未找到 Git，请先安装 Git"
        exit 1
    fi
    
    if [ ! -d ".git" ]; then
        print_error "当前目录不是 Git 仓库"
        exit 1
    fi
    
    print_info "Git 环境检查通过"
}

# 检查工作区状态
check_working_tree() {
    print_info "检查工作区状态..."
    
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "工作区有未提交的更改"
        read -p "是否继续部署？(y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "部署已取消"
            exit 0
        fi
    else
        print_info "工作区干净"
    fi
}

# 部署到 GitHub Pages
deploy_github_pages() {
    print_step "部署到 GitHub Pages..."
    
    # 检查是否配置了远程仓库
    if ! git remote get-url origin &> /dev/null; then
        print_error "未配置 origin 远程仓库"
        exit 1
    fi
    
    REMOTE_URL=$(git remote get-url origin)
    print_info "远程仓库: $REMOTE_URL"
    
    # 激活虚拟环境
    if [ -d "venv" ]; then
        source venv/bin/activate
    else
        print_error "未找到虚拟环境，请先运行 ./build.sh install"
        exit 1
    fi
    
    # 使用 mkdocs gh-deploy 命令
    print_info "开始部署..."
    
    if mkdocs gh-deploy --clean --message "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"; then
        print_info "部署成功！"
        print_info "网站将在几分钟后更新"
        
        # 提取仓库信息
        if [[ $REMOTE_URL =~ github\.com[:/]([^/]+)/([^/.]+) ]]; then
            REPO_OWNER="${BASH_REMATCH[1]}"
            REPO_NAME="${BASH_REMATCH[2]}"
            print_info "访问 https://${REPO_OWNER}.github.io/${REPO_NAME}/ 查看网站"
        fi
    else
        print_error "部署失败"
        exit 1
    fi
}

# 部署到自定义服务器
deploy_custom() {
    print_step "部署到自定义服务器..."
    
    # 检查配置
    if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_PATH" ]; then
        print_error "请设置环境变量 DEPLOY_HOST 和 DEPLOY_PATH"
        print_info "示例: export DEPLOY_HOST=user@example.com"
        print_info "      export DEPLOY_PATH=/var/www/html"
        exit 1
    fi
    
    # 构建网站
    print_info "构建网站..."
    ./scripts/build.sh build
    
    # 使用 rsync 同步文件
    print_info "同步文件到服务器..."
    
    if rsync -avz --delete site/ "$DEPLOY_HOST:$DEPLOY_PATH/"; then
        print_info "部署成功！"
    else
        print_error "部署失败"
        exit 1
    fi
}

# 生成部署包
generate_package() {
    print_step "生成部署包..."
    
    # 构建网站
    print_info "构建网站..."
    ./scripts/build.sh build
    
    # 创建压缩包
    TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
    PACKAGE_NAME="zephyr-learning-system_${TIMESTAMP}.tar.gz"
    
    print_info "创建压缩包: $PACKAGE_NAME"
    tar -czf "$PACKAGE_NAME" -C site .
    
    print_info "部署包已生成: $PACKAGE_NAME"
    print_info "文件大小: $(du -h "$PACKAGE_NAME" | cut -f1)"
}

# 验证部署
verify_deployment() {
    print_step "验证部署..."
    
    if [ -z "$1" ]; then
        print_error "请提供网站 URL"
        print_info "用法: ./deploy.sh verify <URL>"
        exit 1
    fi
    
    URL="$1"
    print_info "检查 URL: $URL"
    
    # 检查网站是否可访问
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_info "网站可访问 (HTTP $HTTP_CODE)"
    else
        print_error "网站不可访问 (HTTP $HTTP_CODE)"
        exit 1
    fi
    
    # 检查关键资源
    print_info "检查关键资源..."
    
    RESOURCES=("search/search_index.json" "sitemap.xml" "assets/stylesheets/main.css")
    
    for resource in "${RESOURCES[@]}"; do
        RESOURCE_URL="${URL%/}/$resource"
        RESOURCE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$RESOURCE_URL")
        
        if [ "$RESOURCE_CODE" = "200" ]; then
            print_info "✓ $resource"
        else
            print_warning "✗ $resource (HTTP $RESOURCE_CODE)"
        fi
    done
    
    print_info "验证完成"
}

# 显示帮助信息
show_help() {
    cat << EOF
Zephyr RTOS 学习系统部署脚本

用法: ./deploy.sh [命令] [选项]

命令:
  github      部署到 GitHub Pages（推荐）
  custom      部署到自定义服务器（需要配置环境变量）
  package     生成部署包（tar.gz 格式）
  verify      验证部署结果
  help        显示此帮助信息

示例:
  ./deploy.sh github                    # 部署到 GitHub Pages
  ./deploy.sh custom                    # 部署到自定义服务器
  ./deploy.sh package                   # 生成部署包
  ./deploy.sh verify https://example.com  # 验证部署

环境变量（用于自定义部署）:
  DEPLOY_HOST    SSH 主机地址（如 user@example.com）
  DEPLOY_PATH    服务器上的部署路径（如 /var/www/html）

EOF
}

# 主函数
main() {
    case "${1:-help}" in
        github)
            check_git
            check_working_tree
            deploy_github_pages
            ;;
        custom)
            check_git
            deploy_custom
            ;;
        package)
            generate_package
            ;;
        verify)
            verify_deployment "$2"
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
