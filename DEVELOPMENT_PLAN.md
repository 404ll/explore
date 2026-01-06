# 用户帖子搜索项目 - 开发步骤流程

## 项目概述
实现一个用户帖子搜索项目，包含主页和用户详情页，需要实现路由同步、全局状态管理和性能优化。

---

## 开发步骤流程

### 阶段一：项目基础架构搭建

#### 1.1 创建全局状态管理（Context API）
- [ ] 创建 `contexts/FavoritesContext.tsx`
  - 实现收藏状态的全局管理
  - 提供 `addFavorite`、`removeFavorite`、`isFavorite` 方法
  - 使用 localStorage 持久化收藏数据

#### 1.2 创建自定义防抖 Hook
- [ ] 创建 `hooks/useDebounce.ts`
  - 实现自定义防抖逻辑（不使用第三方库）
  - 接受 value 和 delay 参数
  - 返回防抖后的值

#### 1.3 创建数据缓存 Hook
- [ ] 创建 `hooks/usePostCache.ts`
  - 实现简单的内存缓存机制
  - 使用 Map 存储用户帖子数据
  - 提供 get/set/clear 方法

#### 1.4 创建 API 服务层
- [ ] 创建 `lib/api.ts`
  - 定义获取用户列表的 API
  - 定义获取用户帖子的 API
  - 定义搜索帖子的 API

---

### 阶段二：主页（Home Page）开发

#### 2.1 主页布局结构
- [ ] 修改 `app/page.tsx`
  - 左侧：用户列表（UserList 组件）
  - 右侧：帖子列表（PostList 组件）
  - 顶部：搜索框（SearchBar 组件）

#### 2.2 实现 URL 状态同步
- [ ] 在 `app/page.tsx` 中使用 `useSearchParams`
  - 读取 URL 中的 `user_id` 和 `search` 参数
  - 当用户选择或搜索时，使用 `useRouter` 更新 URL
  - 页面加载时根据 URL 参数恢复状态

#### 2.3 用户列表组件
- [ ] 创建 `components/UserList.tsx`
  - 显示用户列表
  - 支持选中用户（高亮显示）
  - 点击用户时更新 URL 中的 `user_id`

#### 2.4 搜索框组件
- [ ] 创建 `components/SearchBar.tsx`
  - 输入框绑定防抖 Hook
  - 输入时更新 URL 中的 `search` 参数
  - 显示清除按钮

#### 2.5 帖子列表组件
- [ ] 创建 `components/PostList.tsx`
  - 根据选中的用户和搜索关键词显示帖子
  - 使用缓存 Hook 避免重复请求
  - 每个帖子显示收藏按钮
  - 收藏按钮状态与全局状态同步

#### 2.6 帖子卡片组件
- [ ] 创建 `components/PostCard.tsx`
  - 显示帖子标题、内容、作者等信息
  - 收藏按钮（使用 FavoritesContext）
  - 点击跳转到详情页

---

### 阶段三：用户详情页开发

#### 3.1 用户详情页路由
- [ ] 创建 `app/user/[id]/page.tsx`
  - 使用动态路由参数获取用户 ID
  - 读取 URL 中的 `search` 参数（如果存在）

#### 3.2 详情页布局
- [ ] 实现详情页布局
  - 显示用户信息
  - 显示该用户的帖子列表
  - 支持搜索过滤
  - 收藏功能与主页同步

#### 3.3 URL 状态同步
- [ ] 在详情页实现 URL 同步
  - 搜索时更新 URL 参数
  - 刷新页面时恢复搜索状态

---

### 阶段四：收藏夹页面开发

#### 4.1 收藏夹页面路由
- [ ] 创建 `app/favorites/page.tsx`
  - 显示所有收藏的帖子
  - 支持取消收藏

#### 4.2 收藏夹列表组件
- [ ] 创建 `components/FavoritesList.tsx`
  - 从 FavoritesContext 获取收藏列表
  - 显示收藏的帖子
  - 取消收藏时更新全局状态

---

### 阶段五：性能优化与体验提升

#### 5.1 防抖优化
- [ ] 在 SearchBar 中应用防抖
  - 设置合理的延迟时间（如 300ms）
  - 确保输入流畅，减少不必要的请求

#### 5.2 数据缓存优化
- [ ] 在 PostList 中应用缓存
  - 切换用户时先检查缓存
  - 缓存命中时直接显示，避免请求
  - 缓存未命中时请求并更新缓存

#### 5.3 加载状态
- [ ] 添加加载指示器
  - 数据加载时显示 loading
  - 提升用户体验

#### 5.4 错误处理
- [ ] 添加错误边界和错误提示
  - API 请求失败时显示友好提示
  - 网络错误处理

---

### 阶段六：测试与完善

#### 6.1 路由同步测试
- [ ] 测试 URL 参数同步
  - 选择用户后 URL 更新
  - 搜索后 URL 更新
  - 刷新页面后状态恢复

#### 6.2 全局状态测试
- [ ] 测试收藏状态同步
  - 在主页收藏帖子
  - 在详情页验证收藏状态
  - 在收藏夹取消收藏
  - 返回主页验证状态更新

#### 6.3 性能测试
- [ ] 测试防抖效果
  - 快速输入时不应频繁触发请求
  - 测试缓存机制
  - 切换用户时验证缓存命中

#### 6.4 UI/UX 优化
- [ ] 优化样式和布局
  - 响应式设计
  - 动画过渡效果
  - 交互反馈

---

## 技术栈选择

### 核心依赖（已安装）
- Next.js 16.1.1（App Router）
- React 19.2.3
- TypeScript
- Tailwind CSS

### 状态管理方案
- **Context API**：用于全局收藏状态（避免引入第三方库）

### 路由方案
- **Next.js useSearchParams**：用于 URL 参数同步
- **Next.js useRouter**：用于导航和 URL 更新

### 性能优化方案
- **自定义防抖 Hook**：避免引入 lodash
- **内存缓存**：使用 Map 或 React.useMemo

---

## 关键实现要点

### 1. URL 状态同步实现
```typescript
// 读取 URL 参数
const searchParams = useSearchParams();
const userId = searchParams.get('user_id');
const search = searchParams.get('search');

// 更新 URL 参数
const router = useRouter();
router.push(`/?user_id=${newUserId}&search=${newSearch}`);
```

### 2. 防抖实现
```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

### 3. 全局状态管理
```typescript
// Context 提供收藏状态和方法
const FavoritesContext = createContext<{
  favorites: Set<number>;
  addFavorite: (postId: number) => void;
  removeFavorite: (postId: number) => void;
  isFavorite: (postId: number) => boolean;
}>();
```

### 4. 数据缓存实现
```typescript
// 使用 Map 存储用户帖子数据
const cache = new Map<string, Post[]>();

// 缓存 key: `${userId}-${search}`
// 获取时先检查缓存，未命中则请求并缓存
```

---

## 开发优先级

1. **高优先级**（核心功能）
   - 阶段一：基础架构
   - 阶段二：主页开发
   - 阶段三：用户详情页

2. **中优先级**（完整功能）
   - 阶段四：收藏夹页面
   - 阶段五：性能优化

3. **低优先级**（完善体验）
   - 阶段六：测试与完善

---

## 预计开发时间

- 阶段一：1-2 小时
- 阶段二：2-3 小时
- 阶段三：1-2 小时
- 阶段四：1 小时
- 阶段五：1-2 小时
- 阶段六：1-2 小时

**总计：7-12 小时**

---

## 注意事项

1. **Next.js App Router**：使用 `useSearchParams` 需要在客户端组件中（'use client'）
2. **状态持久化**：收藏状态需要同步到 localStorage
3. **缓存策略**：考虑缓存过期时间，避免数据过时
4. **类型安全**：使用 TypeScript 确保类型安全
5. **错误处理**：所有 API 调用都要有错误处理

