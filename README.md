# AmeoInoru — Personal Tech Blog

一个使用原生 HTML + CSS + JavaScript 构建的个人技术博客页面。整合了 GitHub 项目集、技术文章、个人档案等模块，作为课程作业与个人主页的双用途项目。

## 特点

- **纯前端实现** — 无框架依赖，直接打开即可运行
- **樱花飘落动画** — Canvas 实现的轻量粒子效果
- **博客文章** — 基于真实实践记录的三篇技术文章：CMake 环境配置、OpenSeeFace 面部追踪、Socket 聊天程序
- **评论/点赞系统** — 基于 localStorage 的本地交互，无需后端
- **响应式布局** — 适配桌面与移动端
- **GitHub 项目集成** — 项目卡片直接跳转对应仓库

## 页面结构

```
index.html                  — 主页面（个人档案、博客列表、作品书架）
blog-cmake-mingw.html       — CMake + MinGW 环境配置
blog-openseeface-vts.html   — Arch Linux 面部追踪配置
blog-socket-chat.html       — C/S 套接字聊天程序
style.css                   — 全局样式
script.js                   — 动画、评论、点赞交互
```

## 运行方式

直接打开 `index.html`，或在本目录启动一个静态服务器：

```bash
python3 -m http.server 8080
```

然后访问 <http://localhost:8080>。

## 技术栈

HTML5 · CSS3 · JavaScript (Vanilla) · Canvas API

## 许可

本项目仅供学习交流使用。
