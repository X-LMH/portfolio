# 个人小站 · 日系 × 玻璃

Vue 3 + TypeScript + Vite 的独立静态工程。沿用选定设计的四个区块与示例内容，补充手机和平板布局。使用 Composition API、原生 CSS、原生 dialog 和 composables。

## 开发与构建

工程目录为 `frontend/`，以下命令均在该目录执行。

推荐 Node.js 24 LTS 与 npm；当前已用 Node 24.12.0、npm 11.13.0 验证。依赖版本由 `package-lock.json` 锁定。

```powershell
npm ci
npm run dev
npm run type-check
npm run build
npm run preview
```

开发服务默认地址为终端输出的 `http://localhost:5173/`，生产构建生成 `dist/`。独立类型检查使用 `vue-tsc -b`；构建也会先运行类型检查。可用 `npm run dev -- --host 127.0.0.1` 绑定本地回环地址。

## 内容和组件

- `src/mocks/content.ts`：个人资料、文章（日期、推荐标记、摘要、段落）、片刻。修改这里即可替换示例内容。
- `src/components/`：首页、随笔、片刻、关于，以及导航、文章阅读、资料编辑、提示和共用弹窗。
- `src/composables/`：资料状态、主题和区块导航。
- `src/styles/`：基础样式、选定风格与响应式覆盖。新工程不读取 `old/`，运行和构建也不依赖 Python。
- `public/favicon.svg`：从旧版保留的本地图标。此设计使用文字头像和 SVG 线稿，无远程图片或字体依赖。

`#home`、`#articles`、`#moments`、`#about` 对应四个区块。桌面保留分屏吸附与 PageUp/PageDown，宽度小于 1024px 使用自然滚动，宽度小于 768px 使用单列内容、纵向片刻并隐藏侧边定位点。

## Mock 与后端接入边界

`src/types/site.ts` 定义 `Profile`、`Article`、`Moment` 和 `SiteService`。`src/services/site.ts` 导出当前 mock 实现，方法均返回 Promise：

| 方法 | 返回内容 |
| --- | --- |
| `getProfile()` | 个人资料 |
| `getArticles()` | 文章列表 |
| `getArticle(id)` | 单篇文章，不存在时返回 null |
| `getMoments()` | 片刻列表 |
| `saveProfile(profile)` | 当前资料与 persisted 标记 |
| `resetProfile()` | 示例资料与 persisted 标记 |

后续在服务层实现同一接口并替换导出对象即可；组件不直接依赖 mock 数据。尚未约定 HTTP 地址、鉴权或服务端字段映射，本轮没有发送业务网络请求，也没有后台、数据库或登录功能。

## 浏览器保存

资料继续使用 `personal-space-profile`，主题使用 `personal-space-color`。同源浏览器中可以读取旧版保存的数据；不同域名、协议或端口之间不自动迁移。读取失败或 JSON 损坏时使用示例值，写入失败时保留当前会话的修改并提示无法长期保存。

编辑和“恢复示例”只影响当前浏览器。要向全部访客展示固定资料，请改 mock 源文件后重新构建。日夜切换不依赖系统主题，支持减少动态效果以及磨砂不可用时的实底回退。

## 本轮交付

当前提供本地工程与预览，没有发布到 Sites 或修改旧站访问权限。项目由根目录 Git 仓库统一管理，忽略规则见根目录 `.gitignore`。历史版本的运行方式见 `../old/personal-space/README.md`。

此前已完成类型检查、生产构建、六尺寸浏览器及关键交互检查。临时验收截图与测量记录已清理；`dist/` 是构建产物，需要时运行 `npm run build` 重新生成，再运行 `npm run preview` 预览。
