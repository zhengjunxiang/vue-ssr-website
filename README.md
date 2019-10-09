## vue-ssr-website 

**使用webpack4 配置vue2 ssr 环境**

## 下载依赖
```
yarn install
or
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### 编译项目
```
npm run build
```

### 部署 （确保已经 下载依赖 和 编译项目）
#### 1. 使用node(>=9.0.0) 启动WEB server
```
npm run publish
```
#### 2. pm2管理启动WEB server
> 需要先安装pm2: yarn global add pm2 Or npm install -g pm2
```
npm run pm2
```
