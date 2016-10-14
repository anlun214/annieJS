# AnnieJS(官方交流探讨QQ群:185090134)
## [AnnieJS 官网:http://www.annie2x.com](http://www.annie2x.com)
## [Flash2x 官网:http://www.flash2x.org](http://www.flash2x.org)
## [AnnieJS API文档:http://api.annie2x.com](http://api.annie2x.com) 
## [AnnieJS demo演示:http://test.annie2x.com](http://test.annie2x.com)
    AnnieJS 是一款专注于Html5 互动交互的2d动画引擎。
    AnnieJS 借助于Adobe Flash以及Flash2x工具将以前开发as3项目的工作流程完美复制到HTML5项目开发中来。
    AnnieJS 完全仿照as3的语法和架构，动画效果流畅,制作视觉震撼,但学习简单,安装方便！
    AnnieJS 支持ts和js两种开发语言环境，使用你熟悉的语言开发事半功倍。
    AnnieJS 最大的优势就是短小精悍。全部核心代码压缩后不到70k，该有的功能都有了。
    AnnieJS 需要结合Adobe 及 Flash2x工具使用才能发挥它最大的优势。
    Flash2x 是一款优秀的Adobe Flash插件。
# 相比Flash自带的CreateJS有什么区别和优势
    不得不承认CreateJS非常的优秀，但是它当初不是以移动优先的原则设计的，大量的逻辑和判断代码针对移动端没有任何意义。
    Createjs鼠标穿透非常让人头疼，上层的显示对象无法阻断事件会一直往下冒泡，非常讨厌。
    Createjs鼠标事件也是非常让人头疼，如果你的按钮是有透明的地方或者说接近透明的地方，那么这个地方根本无法获取到鼠标事件
    Createjs多fla项目制作打包，需要自己组织合成，资源压缩，打包还需要我们自己构建
    Createjs对于交互式项目，核心库越小越好，显然Createjs代码库有点过大
    那么AnnieJS的作者经过了长期使用CreateJS经验之后，做了大量的优化和工作才做出了现在的这款AnnieJS引擎
    重新定义了Flash开发H5的工作流程,具体优势各位看官接着往下看
#使用前准备工作
    1.安装 Ant 或者 Gulp 构建工具，选一种你熟悉的就行
    2.如果使用typeSript开发，则需要安装 node.js typeSrcipt 运行环境
    3.强烈推荐WebStrom，我们所有的源码和项目也是使用此工具制作
    4.安装Adboe Flash CS6 及以上版本
    5.强烈推荐google Chrome浏览器，调试利器
    6.下载并安装Flash2xManager管理软件,用此软件一健配置工具和引擎(支持Mac和win)
##[点击下载Flash2xManager工具](https://pan.baidu.com/s/1pKpMmUJ#path=%252FFlash2x%25E4%25B8%258B%25E8%25BD%25BD)
#小试牛刀
    1.安装好以上所说的相关工具后，打开Adobe Flash软件 随便新建一个Fla文件制作些东西保存(一定要保存)。
    2.打开Flash的菜单->窗口->扩展(cs6是[其他])->Flash2x，这时就启动了我们的Falsh2x工具。
    3.选择一个你熟悉的语言简单设置或者不需要任何设置，点击发布，直到提示发布成功。
    4.发布的项目在你使用的Fla文件的同目录下，用WebStrom打开此项目。这个很重要，如果发布后直接双击index.html是看不到任何效果的。
    5.如果是发布的TS语言项目，则需要在webstrom下方的Terminal命令窗口输入 tsc,等待编译完成，再执行第6步。如果是js项目，则跳过这一步。
    6.在打开的webStrom项目里找到index.html 右键点击绿色三角箭头的按钮 Run'index.html'，就可以看到你的成果啦。
#使用多fla来制作大型项目
##经常一个大型项目不可能一个人全部做完，也不可能一个fla文件全部做完。那么Flash2x还支持多fla分开制作最后合成同一项目，使用起来也非常方便简单。
###确定好开发语言后，大家应该都使用相同语言,如果对flash2x构架特别熟悉，也可以混合开发的那另说。开发大致分为两种情况。
####A.一个人整合并制作步骤如下:
    1.将所有的制作好的fla文件放在同一个目录下
    2.用flash打开每个fla文件，在Falsh2x工具面板里点击设置按钮，将各个fla的发布目录设置成同一目录名。
    3.点击Falsh2x 面板的发布按钮，将所有的fla发布到你设置的目录里，但又不会相互干扰和覆盖
    4.针对不同模块进行相应的开发。
    5.通过Flash2x.loadScene进行分布加载或同时加载所有项目模块
    6.加上loading及其他代码。
    7.如果中途需要修改fla文件内容，则可以将相应fla文件给到动画师制作，完成后再覆盖回来发布就行。
    8.最后测试打包上线
####B.多个人制作最给再给一个人整合步骤如下:
    1.各个fla开发人员在自己的电脑上发布项目，但所有人员都规定发布到命名相同的目录里。
    2.各个开发模块功能开发好之后，将fla及发布目录下的src目录和resource目录(如果是ts开发的则是resource 和tsSrc目录)发给整合人员
    3.整合人员将所有fla放在同一个目录下，并有fla目录下新建一个发布目录，发布目录名就是大家一致确定的目录名。
    4.将src目录和resource目录放入发布目录里。
    5.打开所有fla文件用Falsh2x 工具重新发布一次。
    6.以下步骤和一个人整合并制作的步骤相同
#打包压缩资源并发布成最终版
##打包的构建工具目前支持两种，一种是Ant,一种是Gulp.
###A.Ant打包构建方案
    1.配置好Ant，并能全局使用。所谓的全局使用就是在命令终端只要输入ant三个字母，终端就会有相应的提示，这就表示全局安装成功。没有成功的百度下。
    2.在webstrom里，一般在下面有个Terminal，打开它，在里面输入 'ant'，等待片刻，打包完成。
    3.打包完成后，会在项目目录里生成一个released目录，这个目录里的内容就是最终你可以发布出去的内容。
###B.Gulp打包构建方案
    1.配置好Glup,并能全局使用，什么是全局和Ant一样。
    2.在webStrom里，打开Terminal 输入 'npm install'，这时会安装相应的node.js组件，等待安装完成
    3.安装完成后，在Terminal 输入 'gulp' 打包将会进行。
    4.如果打包的过程中出现错误，一般是项目目录下的tools文件夹没有执行权限，更改一下tools的目录执行权限，再次运行 'gulp'
    5.打包完成后，会在项目目录里生成一个released目录，这个目录里的内容就是最终你可以发布出去的内容。
###在手机上调出vConsole调试面板查看调试信息
    在main.js或者main.ts中将'annie.debug=false;'设成 'annie.debug=true;'
#如何更新引擎及工具
    下载的Falsh2xManager管理软件不要删除了，引擎及工具的更新和升级都需要用到，长期保留会有惊喜。
#更新历史
## AnnieJS 1.0.1 版本更新列表
    修复静态文本多行显示不正确bug
    URLLoader支持泛型跨域
    修复了Tween中的两个命名不规范的静态缓动方法名
    修复annieUI.ScrollPage 在pc端鼠标不按下就能滚动的bug
    修复annie.Tween 在动画完成回调函数里继续更改同一对象的动画效果时会无效的bug
    将annie.Shape.arc方法的参数由弧度更改成角度
    支持vconsole调试，这样在手机上测试的时候就可以查看到调试信息(非常有用)
    更改了鼠标事件执行顺序，以前是在渲染前,现在更改后渲染后,逻辑更合理
## Flash2x 3.0.1 版本更新列表
    修复导出矢量图时偶尔报错的bug
    修复多行静态文本导出后只显示一行的bug
    修复了清除缓存模式下Main.js没有被清除缓存的bug
    修复导出序列视频annie.ImageVideo会抖动的bug
## AnnieJS 1.0.0 版本诞生
    支持flash 剪辑,动画剪辑，按钮,文本，矢量，图形,SpriteSheet，声音等对象
    支持flash 遮罩，引导，传统补间，高级补间，骨骼动画
    支持Flash 模糊，发光，投影，高级色彩，变色滤镜
    支持Flash 显示对象的x,y,alpha,rotation,visible,scaleX,sclaeY,skewX,skewY,anchorX,anchorY
    支持Flash 时间轴嵌套时间轴动画，多层，多帧，多子级动画
    支持Flash 时间轴的正向播放，反向播放
    支持Flash 时间轴跳转标签
    支持Flash 时间轴EnterFrame事件，EndFrame事件，CallFrame事件
    支持Flash 时间轴上运行的脚本
    支持Flash 矢量的单色填充，渐变线性填充，渐变径向填充，位图填充
    支持Flash Stage缩放自适应，自适应设备方向，resize事件
    支持Flash mosue的mouseDown mosueUp mouseOver mouseMove click 事件
    支持Flash 显示对象的 addToStge removeToStage 事件
    支持Flash 显示对象的 mouseChildren mouseEabale属性
    支持tween 动画类
    支持urlLoader 加载类
    支持flash2x 管理类
## Flash2x 3.0.0 版本诞生
     支持将flash以上所提到的资源和功能导出，以提供给AnnieJS引擎使用。
     支持自定义开发功能，给需要想导出成其他引擎的开发者开发使用。