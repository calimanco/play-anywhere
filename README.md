# play-anywhere

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## 简介

开箱即用的命令行 webpack 开发服务器。  
无需编写 HTML 和样式，专注脚本编写，自动生成入口。可用于快速验证想法，展示案例，本地开发，以及测试。

---

[English Version](https://github.com/calimanco/play-anywhere/blob/main/README_EN.md)

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
`options` 是可选项。  
程序将扫描 `path` 下的文件（非递归），生成 webpack 入口，规则如下：  

- 目录下的 JS 或 TS 文件，将以该文件的文件名生成同名入口，并生成同名的网页 `path`；
- 目录下的子目录，如果子目录下有 `app.js` 或 `app.ts`，则生成与子目录名同名的入口，并生成同名的网页 `path`；
- 如果子目录下还有 `index.html`、`index.htm` 或 `index.ejs` 则将取代默认的模板生成页面。

举个例子：  
假设有如下的目录结构。  

```
demo
├── first.ts
├── second
│   └── app.ts
└── third
    └── app.js
```

会生成以下三个 webpack 入口和网页 `path` 。  
首页 `http://localhost:3000` 会罗列结果。  

```
first => http://localhost:3000/first
second => http://localhost:3000/second
third => http://localhost:3000/third
```

## 特性

- 默认支持 TypeScript、CSS 和 EJS 模板；
- 仅需一个 JS 或 TS 文件，即可自动生成页面，也支持自定义；
- 已配置 Webpack 热重载功能；
- 支持静态文件服务；
- 配置可以完全自定义。

## 可用选项

- `-p [number]` / `--port [number]`  指定使用的端口（默认是3000）。这也会从 `process.env.PORT` 获取。
- `-h` / `--help`  打印帮助文档。
- `-v` / `--version`  打印版本号。
- `-s` / `--silent`  禁止输出日志消息，webpack 还是会少量打印。
- `--static-dir [path]`  设置静态目录，可用于一些静态资源的使用。
- `-c --config [path]`  需要读取的配置文件，该配置会与默认配置合并。

## Explanation

// TODO

## LICENSE

MIT
