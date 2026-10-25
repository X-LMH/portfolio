# 个人小站

- **正式前端工程：** [`frontend/`](./frontend/README.md)，日系 × 玻璃，Vue 3 + TypeScript + Vite，当前使用静态 mock 数据。
- **历史方案归档：** [`old/`](./old/README.md)，保存原生 HTML 版本的源码、页面、素材、脚本、已有验证记录、发布压缩包和预览图。
- 全部项目内容由根目录的 Git 仓库管理，统一使用根目录 `.gitignore`。旧工程的独立 `.git` 已移除。

```text
portfolio/
├─ frontend/       # 正式 Vue 前端
├─ old/            # 历史方案与发布归档
├─ .gitignore      # 全仓库统一忽略规则
└─ README.md
```

## 本地开发

```powershell
cd frontend
npm ci
npm run dev
```

类型检查和生产构建在 `frontend/` 下执行：

```powershell
npm run type-check
npm run build
npm run preview
```

正式前端不依赖 `old/`。后端接入边界和示例内容修改方式见前端说明；目前没有连接后端，也未改动已发布站点。

## 归档与版本管理

`old/` 与正式前端一起纳入版本管理，其中旧工程的 `dist/` 是历史页面快照和素材的一部分，必须保留。`frontend/node_modules/`、`frontend/dist/`、临时验收产物、编辑器配置及本地环境文件不纳入提交。
