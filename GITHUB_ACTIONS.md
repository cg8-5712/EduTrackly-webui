# GitHub Actions 使用说明

本项目已配置以下 GitHub Actions 工作流：

## 1. CI 工作流 (`.github/workflows/ci.yml`)

**触发条件：** 推送到 `main` 或 `develop` 分支，或者针对这些分支的 Pull Request

**功能：**
- 自动检查代码
- 安装依赖
- 验证项目配置
- 显示项目信息（名称、版本）

## 2. Build Test 工作流 (`.github/workflows/build-test.yml`)

**触发条件：** 提交消息包含 `[build test]` 的推送

**使用方法：**
```bash
git commit -m "feat: add new feature [build test]"
git push
```

**功能：**
- 安装依赖
- 从 `.env.example` 创建 `.env` 文件
- 执行项目构建
- 验证构建输出
- 上传构建产物（保留 7 天）

**环境变量配置：**
如需在构建时使用生产环境变量，请在 GitHub 仓库设置中添加 Secrets，然后在工作流中取消注释相关行：
```yaml
# 例如: echo "VITE_API_URL=${{ secrets.VITE_API_URL }}" >> .env
```

## 3. Release 工作流 (`.github/workflows/release.yml`)

**触发条件：** 推送版本标签（格式：`v*.*.*`）

**使用方法：**
```bash
# 1. 更新 package.json 中的版本号
# 2. 提交更改
git add .
git commit -m "chore: bump version to 1.4.0"

# 3. 创建并推送标签
git tag v1.4.0
git push origin v1.4.0
```

**功能：**
- 安装依赖
- 从 `.env.example` 创建 `.env` 文件
- 执行生产构建
- 清理 text* 临时文件
- 创建 ZIP 压缩包
- 生成发布说明
- 创建 GitHub Release
- 上传构建产物（保留 30 天）

**环境变量配置：**
对于生产环境，请在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加必要的环境变量：
- `VITE_API_URL` - API 地址
- `VITE_APP_TITLE` - 应用标题
- 其他项目所需的环境变量

然后在 `.github/workflows/release.yml` 中取消注释相关配置行。

## 注意事项

1. **环境变量安全：** 不要将敏感信息提交到代码库，始终使用 GitHub Secrets
2. **构建缓存：** 工作流使用 yarn 缓存以加快构建速度
3. **权限：** Release 工作流需要 `contents: write` 权限才能创建 release
4. **清理文件：** Release 时会自动删除根目录的 text* 文件

## 快速参考

| 操作 | 命令 |
|------|------|
| 普通推送 | `git push` → 触发 CI |
| 构建测试 | 提交消息包含 `[build test]` → 触发构建测试 |
| 发布版本 | `git tag v1.0.0 && git push origin v1.0.0` → 触发 Release |
