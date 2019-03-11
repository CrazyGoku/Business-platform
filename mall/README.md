# web_template

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev  

# build for production with minification 打生产包
npm run build

# 打测试包
npm run build:sit
# build for production and view the bundle analyzer report
npm run build --report
```
华西UI规范
1、统一使用px2rem编写css样式（后启动项目，前面的项目除我的168迁移依然使用less mixin 编写）
2、不转换px成rem使用Px。如’font-size:14Px;’
3、id，class 类名使用 ‘-’做为分割符。如’tab-nav’
4、每个模块单独写自己的CSS,需要控制组件样式使用穿透/deep/。如
#BusinessHome{
	/deep/ .van-tabs--line{
		***
	}
	.tab-nav{
		***
	}
}
5、字体使用Px,其他的属性基本使用rem（视实际场景而定）

