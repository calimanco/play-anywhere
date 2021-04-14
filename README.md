# play-anywhere

[![Build Status](https://travis-ci.com/calimanco/play-anywhere.svg?branch=main)](https://travis-ci.com/calimanco/play-anywhere)
[![NPM](https://img.shields.io/npm/l/play-anywhere)](https://www.npmjs.com/package/play-anywhere)
[![npm](https://img.shields.io/npm/v/play-anywhere)](https://www.npmjs.com/package/play-anywhere)
![node-current](https://img.shields.io/node/v/play-anywhere)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## 简介

开箱即用的命令行 webpack 开发服务器。  
无需编写 HTML 和样式，专注脚本编写，自动生成多页面应用。  
可用于快速验证想法，展示案例，本地开发，以及测试。

---

[English Version](https://github.com/calimanco/play-anywhere/blob/main/README_EN.md)

## 快速概述

可以使用 npx 命令进行免安装运行。（npm 5.2+）

```bash
npx play-anywhere [path] [options]
```

启动后可访问 http://localhost:3000 。

## 安装

### 全局安装

```bash
npm install play-anywhere -g
```

这是推荐的做法，这样 play-anywhere 就可以通过命令行在任何地方运行。

### 作为依赖包安装

```bash
npm install play-anywhere
```

## 使用

```bash
play-anywhere [path] [options]
#or
pa [path] [options]
```

P.S. 啪的一下，很快哦（笑）

`path` 可选项，默认是当前命令行运行的目录，也就是`./`；  
`options` 可选项，[可用选项](#可用选项)。  
程序将扫描 `path` 下的文件（非递归），生成 webpack 入口，分为"简单模式"和"完整模式"。

### 简单模式

- `path` 目录中的 JS 或 TS 文件，其文件名将用于生成条目和页面；
- 页面只能由内置模板生成。

### 完整模式

- `path` 目录下有 `app.js` 或 `app.ts` 的子目录，其文件名将用于生成条目和页面；
- 如果子目录下还有 `index.html`、`index.htm` 或 `index.ejs` 则将取代默认的模板生成页面。

举个例子，假设有如下的目录结构：

```
demo
├── first.ts     (simple mode)
├── second       (complete mode)
│   └── app.ts
└── third        (complete mode)
    ├── index.ejs
    └── app.js
```

会生成以下三个 webpack 入口和同名的网页。  
服务器默认监听 3000 端口。  
首页 `http://localhost:3000` 会罗列出结果。映射关系如下：

```
first   =>  http://localhost:3000/first
second  =>  http://localhost:3000/second
third   =>  http://localhost:3000/third
```

## 特性

- 默认支持 TypeScript、CSS 和 EJS 模板；
- 仅需一个 JS 或 TS 文件，即可自动生成页面，也支持自定义；
- 已配置 Webpack 热重载功能；
- 支持静态文件服务；
- 配置可以完全自定义。

## 可用选项

- `-p [number]` / `--port [number]` 指定使用的端口（默认是 3000）。这也会从 `process.env.PORT` 获取。
- `-h` / `--help` 打印帮助文档。
- `-v` / `--version` 打印版本号。
- `-s` / `--silent` 禁止输出日志消息。Webpack 还是会少量打印。
- `--static-dir [path]` 设置静态目录，可用于一些静态资源的使用。
- `-c --config [path]` 需要读取的配置文件，该配置会与默认配置合并。

## 完整配置

默认配置已经能够满足大部分需求，但如果需要完全自定义，可以自行编写配置文件。配置文件是一个 CommonJS 模块文件。  
所有选项都是可选。遇到与命令行选项相同功能的字段，则以命令行的输入为优先。  
请使用绝对路径。

```typescript
interface PaConfig {
  // Debug switch.
  debug?: boolean
  // Silent switch. The same as "-s / --silent" CMD option.
  silent?: boolean
  // Specify the root directory. The default is the directory where the CMD is currently running.
  root?: string
  // Specify the static directory. The same as "--static-dir" CMD option.
  staticDir?: string
  // Specify the server port. The same as "-p / --port" CMD option.
  serverPort?: number
  // Specify homepage html template file.
  indexTemplate?: string
  // Specify subpage html template file.
  pageTemplate?: string
  // Matching rules for entry files.
  entryMatch?: Array<string | RegExp>
  // Matching rules for html template files.
  templateMatch?: Array<string | RegExp>
  // Matching rules for exclude files.
  exclude?: Array<string | RegExp>
  // The config of webpack. It will use 'webpack-merge' to merge.
  webpackConfig?: Configuration
}
```

## 自定义 HTML

默认下，HTML 均由内置的模板生成，即 indexTemplate 和 pageTemplate。一般不建议修改通用的模板。  
如果想要自定义 HTML，可以在子目录里编写 `index.htm`、`index.html` 或 `index.ejs`（默认规则）。  
模板编写请参考 `html-webpack-plugin` 的 [文档](https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates) 。  
自定义样式可以直接引用到脚本文件内，它会被 `style-loader` 和 `css-loader` 处理。  
可以形成如下目录结构：

```
demo
└── third
    ├── app.js （import style.css here）
    ├── style.css
    └── index.ejs
```

## 自定义匹配规则

匹配规则仅在"完整模式"下有效。规则由三部分构成，`entryMatch`、`templateMatch` 和 `exclude`。  
他们各为一个正则/字符串数组，匹配优先级为从左往右。新增的规则将会"unshift"进旧规则列表，即新规则优先于老规则。

- `entryMatch` 用于匹配入口文件，即子目录里有匹配的文件，才会被判定为需要使用"完整模式"处理，默认是 `[/^app\.(ts|js)$/i]` ；
- `templateMatch` 用于匹配 HTML 模板文件，是在上一个条件满足后才能进行匹配，默认是 `[/^index\.(htm|html|ejs)$/i]` ；
- `exclude` 需要排除的目录或文件，该规则同时作用与根目录和子目录的查找，默认是 `[/^node_modules$/i, /^\./i]` 。

## 静态文件

可能遇到需要在网页中加载不需要被 Webpack 处理的文件，可以将一个目录设置为静态文件目录。  
比如有如下文件：

```
demo
├── public
│   └── other.js
└── third
    ├── app.js
    └── index.ejs
```

执行命令：

```bash
play-anywhere demo --static-dir demo/public
```

就可以在 `third/index.ejs` 里使用 `public/other.js`：

```html
<script src="/other.js"></script>
```

## NodeJS API

作为依赖包进行安装后，play-anywhere 可以引入到 NodeJS 项目中使用。

```javascript
const pa = require('play-anywhere')
```

### 启动服务

暴露的函数可以直接运行，用于启动服务，接受参数与命令行相同。  
每次运行都为独立实体，理论上可以同时启动多个服务，但注意端口号要不同。  
函数将返回一个 promise 对象，当服务器启动并首次完成编译，将触发 resolve。

```javascript
// Without arguments.
pa().then(res => {
  const server1 = res
})
// Or with arguments, use async-await instead.
const server2 = await pa('demo', '-p', '5000')
```

resolve 的结果为 IPaServer 对象。

- `origin` NodeJS 的 [net.Server](https://nodejs.org/api/net.html#net_class_net_server) 对象。
- `close` 关闭服务的方法。
- `getConfig` 获取完整配置对象的方法。

```typescript
interface IPaServer {
  origin: Server
  close: () => Promise<void>
  getConfig: () => IPaConfig
}
```

### 关闭服务

可使用 IPaServer 对象的 close 方法关闭服务。  
该方法本质是对 net.Server 的 close 方法的封装。  
该方法返回 promise 对象，完成关闭时触发 resolve。

```javascript
server.close().then(() => {
  console.log('Server is down.')
})
```

### TypeScript 开发

使用如下方法可以取得类型声明。

```typescript
import { IPaConfig, IPaServer } from 'play-anywhere'
```

## Q&A

#### Q：当子目录中同时存在 `app.js` 和 `app.ts`，哪一个将作为入口文件？

A：由于 NodeJS 读取文件的顺序是随机的，因此匹配结果也是随机。请尽量避免这种情况的使用。

## LICENSE

MIT
