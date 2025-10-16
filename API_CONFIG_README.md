# API 动态域名配置说明

## 概述

项目已实现根据访问域名自动选择对应后端API地址的功能。所有配置都在 `.env` 文件中完成，无需修改代码。

## 工作原理

系统会根据当前访问的域名(`window.location.hostname`)，从环境变量中查找对应的API地址。如果找不到映射，则使用默认的API地址。

## 配置方法

### 1. 编辑 .env 文件

所有配置都在 `.env` 文件中完成:

```env
# 默认API地址 (当访问域名未配置映射时使用)
VITE_API_URL=http://localhost:3000/api/v1

# 域名映射配置
# 格式: VITE_API_URL_域名大写_点替换为下划线 = API地址

# 本地开发
VITE_API_URL_LOCALHOST=http://localhost:3000/api/v1
VITE_API_URL_127_0_0_1=http://localhost:3000/api/v1

# 生产环境
VITE_API_URL_ABC_COM=https://abc.com/api/v1
VITE_API_URL_WWW_ABC_COM=https://abc.com/api/v1
VITE_API_URL_DEF_COM=https://def.com/api/v1
VITE_API_URL_WWW_DEF_COM=https://def.com/api/v1
```

### 2. 域名转换规则

| 域名 | 环境变量名 |
|------|-----------|
| `abc.com` | `VITE_API_URL_ABC_COM` |
| `www.abc.com` | `VITE_API_URL_WWW_ABC_COM` |
| `test-api.abc.com` | `VITE_API_URL_TEST_API_ABC_COM` |
| `127.0.0.1` | `VITE_API_URL_127_0_0_1` |
| `localhost` | `VITE_API_URL_LOCALHOST` |

**转换规则:**
1. 所有字母转为大写
2. 点(`.`)替换为下划线(`_`)
3. 连字符(`-`)替换为下划线(`_`)
4. 前缀固定为 `VITE_API_URL_`

## 使用示例

### 示例 1: 单域名多环境

```env
# 开发环境
VITE_API_URL_DEV_MYAPP_COM=https://dev-api.myapp.com/api/v1

# 测试环境
VITE_API_URL_TEST_MYAPP_COM=https://test-api.myapp.com/api/v1

# 生产环境
VITE_API_URL_MYAPP_COM=https://api.myapp.com/api/v1
VITE_API_URL_WWW_MYAPP_COM=https://api.myapp.com/api/v1
```

**效果:**
- 访问 `https://dev.myapp.com` → API: `https://dev-api.myapp.com/api/v1`
- 访问 `https://test.myapp.com` → API: `https://test-api.myapp.com/api/v1`
- 访问 `https://myapp.com` → API: `https://api.myapp.com/api/v1`

### 示例 2: 多客户独立部署

```env
# 默认API
VITE_API_URL=http://localhost:3000/api/v1

# 客户 A
VITE_API_URL_CLIENT_A_COM=https://client-a.com/api/v1
VITE_API_URL_WWW_CLIENT_A_COM=https://client-a.com/api/v1

# 客户 B
VITE_API_URL_CLIENT_B_COM=https://client-b.com/api/v1
VITE_API_URL_WWW_CLIENT_B_COM=https://client-b.com/api/v1

# 客户 C
VITE_API_URL_CLIENT_C_COM=https://client-c.com/api/v1
VITE_API_URL_WWW_CLIENT_C_COM=https://client-c.com/api/v1
```

**效果:**
- 访问 `https://client-a.com` → API: `https://client-a.com/api/v1`
- 访问 `https://client-b.com` → API: `https://client-b.com/api/v1`
- 访问 `https://client-c.com` → API: `https://client-c.com/api/v1`

### 示例 3: 本地开发配置

```env
# 本地开发
VITE_API_URL_LOCALHOST=http://localhost:3000/api/v1
VITE_API_URL_127_0_0_1=http://localhost:3000/api/v1

# 内网测试
VITE_API_URL_192_168_1_100=http://192.168.1.200:3000/api/v1
```

## 调试

系统会在浏览器控制台输出相关日志:

```
[API Config] Loaded mapping from env: abc.com -> https://abc.com/api/v1
[API Config] Using mapped API URL for abc.com: https://abc.com/api/v1
[ApiPrefix] Initialized with baseURL: https://abc.com/api/v1
[AuthService] Initialized with API URL: https://abc.com/api/v1
```

如果域名未配置映射:

```
[API Config] Using default API URL for unknown-domain.com: http://localhost:3000/api/v1
```

## 部署指南

### 方案 1: 单一 .env 文件部署

**适用场景:** 所有域名配置在构建时已知

1. 在 `.env` 文件中配置所有域名映射
2. 构建一次: `npm run build`
3. 部署 `dist` 目录到所有域名

**优点:**
- 只需构建一次
- 自动根据访问域名选择API
- 维护简单

### 方案 2: 多环境配置文件

**适用场景:** 不同环境使用不同的配置

创建多个环境配置文件:

```
.env                    # 默认配置
.env.development        # 开发环境
.env.staging           # 预发布环境
.env.production        # 生产环境
```

构建时指定环境:

```bash
# 开发环境
npm run build -- --mode development

# 生产环境
npm run build -- --mode production
```

### 方案 3: 动态环境变量注入

**适用场景:** CI/CD 自动化部署

在 CI/CD 流程中动态注入环境变量:

```yaml
# .github/workflows/deploy.yml
- name: Build
  env:
    VITE_API_URL: ${{ secrets.API_URL }}
    VITE_API_URL_ABC_COM: ${{ secrets.API_URL_ABC_COM }}
    VITE_API_URL_DEF_COM: ${{ secrets.API_URL_DEF_COM }}
  run: npm run build
```

## 常见问题

### Q: 如何为同一域名配置不同端口?

**A:** 系统自动忽略端口号,只匹配域名部分。访问 `abc.com:8080` 和 `abc.com:3000` 都会匹配 `VITE_API_URL_ABC_COM`。

### Q: 可以使用通配符吗?

**A:** 不支持。每个域名需要单独配置。建议为常用变体(如 www 前缀)都配置映射。

### Q: 配置后为什么不生效?

**A:** 检查以下几点:
1. 确认环境变量名格式正确 (大写+下划线)
2. 重新构建项目 (`npm run build`)
3. 查看浏览器控制台日志
4. 确认 `.env` 文件在项目根目录

### Q: 如何调试域名映射?

**A:** 在浏览器控制台运行:

```javascript
import apiConfig from '@/config/apiConfig'

// 查看所有映射
console.log(apiConfig.getAllMappings())

// 查看当前域名
console.log(apiConfig.getCurrentDomain())

// 查看当前使用的API
console.log(apiConfig.getApiUrl())
```

### Q: 生产环境能修改配置吗?

**A:** 不能。配置在构建时被编译到代码中。如需修改,必须重新构建和部署。

## 安全建议

1. **不要提交敏感信息**
   - `.env` 文件包含敏感配置,不应提交到版本控制
   - 使用 `.env.example` 作为配置模板

2. **使用 HTTPS**
   - 生产环境的API地址应使用 HTTPS

3. **验证 API 地址**
   - 确保配置的API地址正确且可访问

## 技术实现

配置解析在 `src/config/apiConfig.js` 中实现:

1. 读取所有 `VITE_API_URL_*` 环境变量
2. 将变量名转换回域名格式
3. 构建域名到API地址的映射表
4. 根据当前访问域名查找对应API

## 文件结构

```
.
├── .env                          # 主配置文件
├── .env.example                  # 配置模板
├── API_CONFIG_README.md          # 本文档
└── src/
    ├── config/
    │   └── apiConfig.js          # API配置解析
    ├── services/
    │   └── common/
    │       └── auth.js           # 认证服务
    └── utils/
        └── ApiPrefix.js          # API请求封装
```

## 升级指南

如果你之前使用固定的 `VITE_API_URL`，升级很简单:

1. 保留原有的 `VITE_API_URL` (作为默认值)
2. 添加需要的域名映射配置
3. 重新构建项目

**示例:**

```env
# 原有配置 (保留)
VITE_API_URL=http://localhost:3000/api/v1

# 新增映射 (添加)
VITE_API_URL_ABC_COM=https://abc.com/api/v1
VITE_API_URL_DEF_COM=https://def.com/api/v1
```

## 技术支持

如有问题,请:
1. 查看浏览器控制台日志
2. 确认 `.env` 配置格式
3. 参考本文档的示例
4. 联系开发团队
