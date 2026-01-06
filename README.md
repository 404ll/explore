## 用户帖子搜索 / 收藏 Explorer

一个基于 **Next.js App Router** 的小型「帖子探索器」：支持按用户浏览帖子、关键字搜索、收藏帖子以及查看帖子详情与评论，主要用于演示 **URL 状态同步、全局状态管理和简单性能优化** 的实践。

---

## 功能概览

- **首页（`/`）**
  - 左侧用户列表，点击某个用户会在右侧展示该用户的帖子
  - 顶部搜索框支持关键字搜索帖子，配合自定义防抖 Hook 降低请求频率
  - URL 中同步 `user_id`、`search` 等查询参数，实现「可分享 / 可刷新」的状态
  - 帖子卡片支持「收藏 / 取消收藏」，收藏状态在全局共享

- **收藏页（`/favorites`）**
  - 展示所有已收藏的帖子
  - 支持取消收藏，状态会同步回首页

- **帖子详情页（`/post/[id]`）**
  - 展示单个帖子的完整内容
  - 加载并展示该帖子的评论列表
  - 支持从详情页一键返回首页

- **全局能力**
  - 使用 `FavoritesContext` 管理收藏状态，并持久化到 `localStorage`
  - 独立的 `lib/api.ts` 作为数据获取层，集中封装与外部 API 的交互
  - Tailwind CSS 4 + React 19 + Next.js 16，简单但现代的 UI 布局

---

## 目录结构（简要）

- **`app/`**
  - `page.tsx`：首页布局与整体框架（用户列表 + 搜索 + 帖子列表）
  - `favorites/page.tsx`：收藏列表页面
  - `post/[id]/page.tsx`：帖子详情页面
  - `layout.tsx`：App Router 全局布局
- **`components/`**
  - `Navbar.tsx`：全局导航栏（入口 / 路由切换）
  - `UserList.tsx`：用户列表
  - `PostList.tsx`：帖子列表
  - `PostCard.tsx`：帖子卡片（含收藏按钮）
  - `SearchBar.tsx`：搜索框组件（集成防抖）
  - `UserList.tsx`：用户列表展示
- **`contexts/`**
  - `FavoritesContext.tsx`：收藏状态全局管理，封装 `useFavorites` Hook
- **`hooks/`**
  - `useDebounce.ts`：通用防抖 Hook
- **`lib/`**
  - `api.ts`：统一的 API 服务封装（帖子、用户、评论等）
- **`types/`**
  - `index.ts`：`Post`、`User`、`Comment` 等类型定义
- 其他：`globals.css`、`eslint.config.mjs`、`tsconfig.json` 等工程配置文件

> 更详细的开发拆解和实现说明可参考仓库中的 `DEVELOPMENT_PLAN.md`。

---

## 技术栈

- **框架**：Next.js 16（App Router）
- **语言**：TypeScript
- **前端库**：React 19
- **样式**：Tailwind CSS 4
- **构建 / 工具**：ESLint 9、TypeScript 5

---

## 本地开发

### 环境准备

- Node.js（推荐 18+）
- 包管理工具：`npm`（项目内已使用 `package-lock.json`）

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

默认在浏览器打开 `http://localhost:3000` 即可访问首页。

常用页面：

- 首页：`/`
- 收藏页：`/favorites`
- 帖子详情页：`/post/[id]`

### 构建与生产运行

```bash
# 构建
npm run build

# 启动生产环境
npm run start
```

### 代码检查

```bash
npm run lint
```

---

## 关键实现点（简要说明）

- **URL 状态同步**
  - 使用 `useSearchParams` 读取 `user_id`、`search` 等参数
  - 使用 `useRouter` 更新 URL，使选择用户 / 搜索都体现在地址栏
  - 刷新页面或分享链接时，页面会根据 URL 自动恢复状态

- **收藏状态管理**
  - `FavoritesContext` 统一管理收藏的帖子 ID 集合
  - 通过 `useFavorites()` 在各个组件中访问 `favorites`、`addFavorite`、`removeFavorite` 等
  - 自动与 `localStorage` 同步，刷新页面后收藏不丢失

- **防抖与性能优化**
  - `useDebounce` 用于对搜索输入进行防抖，减少请求次数
  - API 层集中在 `lib/api.ts`，便于后续替换为真实后端或增加缓存策略

更多细节可在 `DEVELOPMENT_PLAN.md` 中查看按阶段拆解的设计与实现思路。

---

## 适用场景

- 练习 **Next.js App Router + URL 状态同步** 的项目骨架
- 演示 **Context API 全局状态管理** 与 `localStorage` 持久化
- 小型 CRUD / 列表类应用的架构参考模板

