# Installation and Usage Instructions

## I. Clone and Download Locally

1. Create a new folder and open Git Bash.

2. Enter the command `git clone https://github.com/QYW-woker/BG_Management-System.git`

   [Backend Management System GitHub Repository](https://github.com/QYW-woker/BG_Management-System.git)

   

## II. Open and Use

### 2.1 Install node_modules

1. Drag the project into your code editor. (VScode)
2. **Installation Command:** `pnpm install`. This automatically installs the dependencies required for the project.

### 2. Start the Service with Terminal Command

1. Open the **Terminal** in your code editor. Alternatively, you can open the terminal by entering `cmd` in the file path.

2. Execute the command: `pnpm run dev`

   

### 3. Successful Operation

**Username: admin**

**Password: 111111**

# File Description

```
src
| api      					—— API请求相关
| assets   					—— 静态资源相关
| components 				—— 公共自定义组件相关
| directive 				——  自定义指令
| layout 						—— 首页布局相关
| router 						—— 路由相关
| stores 						—— 仓库相关
| utils				  		—— 自定义工具相关
| views 						—— 页面相关
| style 						——全局样式相关

App.vue 						—— 程序入口文件
main.ts 						—— 项目入口文件
permission.ts 			—— 路由鉴权文件
setting.ts 					—— 首页自定义设置文件
.env.development 		—— 生产环境
.env.production 		—— 上线环境
.env.test 					—— 测试环境
.eslintrc.cjs 			—— Eslint配置文件
.gitignore 					—— git忽略文件
package.json 				—— 项目配置文件

```







# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
