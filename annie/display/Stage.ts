/**
 * @module annie
 */
namespace annie {
    /**
     * Stage 表示显示 canvas 内容的整个区域，所有显示对象的顶级显示容器
     * 无法以全局方式访问 Stage 对象,而是需要利用DisplayObject实例的getStage()方法进行访问
     * @class annie.Stage
     * @extends annie.Sprite
     * @public
     * @since 1.0.0
     */
    export class Stage extends Sprite{
        /**
         * 整个引擎的最上层的div元素,
         * 承载canvas的那个div html元素
         * @property rootDiv
         * @public
         * @since 1.0.0
         * @type {Html Div}
         * @default null
         */
        public rootDiv:any = null;
        /**
         * 当前stage所使用的渲染器
         * 渲染器有两种,一种是canvas 一种是webGl
         * @property renderObj
         * @public
         * @since 1.0.0
         * @type {IRender}
         * @default null
         */
        public renderObj:IRender = null;
        /**
         * 渲染模式值 只读 CANVAS:0, webGl: 1
         * @property renderType
         * @readonly
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public renderType = 0;
        /**
         * 如果值为true则暂停更新当前显示对象及所有子对象。在视觉上就相当于界面停止了,但一样能会接收鼠标事件<br/>
         * 有时候背景为大量动画的一个对象时,当需要弹出一个框或者其他内容,或者模糊一个背景时可以设置此属性让<br/>
         * 对象视觉暂停更新
         * @property pause
         * @type {boolean}
         * @public
         * @since 1.0.0
         * @default false
         */
        public pause:boolean = false;
        /**
         * 舞台在设备里截取后的可见区域,有些时候知道可见区域是非常重要的,因为这样你就可以根据舞台的可见区域做自适应了。
         * @property viewRect
         * @public
         * @readonly
         * @since 1.0.0
         * @type {annie.Rectangle}
         * @default {x:0,y:0,width:0,height:0}
         */
        public viewRect:Rectangle = new Rectangle();
        /**
         * 当设备尺寸更新，或者旋转后是否自动更新方向
         * 端默认不开启
         * @property autoSteering
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default false
         */
        public autoSteering:boolean = false;
        /**
         * 当设备尺寸更新，或者旋转后是否自动更新尺寸。
         * @property autoResize
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @type false
         */
        public autoResize:boolean = false;
        /**
         * 舞台的尺寸宽,也就是我们常说的设计尺寸
         * @property width
         * @public
         * @since 1.0.0
         * @default 320
         * @type {number}
         */
        public width:number = 320;
        /**
         * 舞台的尺寸高,也就是我们常说的设计尺寸
         * @property height
         * @public
         * @since 1.0.0
         * @default 240
         * @type {number}
         */
        public height:number = 240;
        /**
         * 舞台在当前设备中的真实高
         * @property divHeight
         * @public
         * @since 1.0.0
         * @default 320
         * @type {number}
         */
        public divHeight:number = 320;
        /**
         * 舞台在当前设备中的真实宽
         * @property divWidth
         * @public
         * @since 1.0.0
         * @default 240
         * @type {number}
         */
        public divWidth:number = 240;
        /**
         * 舞台的背景色
         * 默认就是透明背景
         * 可能设置一个颜色值改变舞台背景
         * @property bgColor
         * @public
         * @since 1.0.0
         * @type {string}
         * @default "";
         */
        public bgColor:string = "";
        /**
         * 舞台的缩放模式
         * 默认为空就是无缩放的真实大小
         * "noBorder" 无边框模式
         * ”showAll" 显示所有内容
         * “fixedWidth" 固定宽
         * ”fixedHeight" 固定高
         * @property scaleMode
         * @public
         * @since 1.0.0
         * @default "onScale"
         * @type {string}
         */
        public scaleMode:string = "onScale";
        /**
         * 原始为60的刷新速度时的计数器
         * @property _flush
         * @private
         * @since 1.0.0
         * @default 0
         * @type {number}
         */
        private _flush:number = 0;
        /**
         * 当前的刷新次数计数器
         * @property _currentFlush
         * @private
         * @since 1.0.0
         * @default 0
         * @type {number}
         */
        private _currentFlush:number = 0;
        /**
         * 最后一次有坐标点的鼠标或触摸事件，touchend事件不会有坐标点。为了弥补这个缺陷此属性应用而生
         * @property _lastMousePoint
         * @private
         * @since 1.0.0
         */
        private _lastMousePoint:Point;
        /**
         * 每一次需要刷新整个引擎时积累的鼠标或触摸事件信息对象,同一刷新阶段内相同的事件类型将会被后面的同类事件覆盖
         * @type {Object}
         * @private
         */
        private _mouseEventInfo:any = {};

        /**
         * 显示对象入口函数
         * @method Stage
         * @param {string} rootDivId
         * @param {number} desW 舞台宽
         * @param {number} desH 舞台高
         * @param {number} fps 刷新率
         * @param {string} scaleMode 缩放模式 StageScaleMode
         * @param {string} bgColor 背景颜色-1为透明
         * @param {number} renderType 渲染模式0:canvas 1:webGl 2:dom
         * @public
         * @since 1.0.0
         */
        public constructor(rootDivId:string = "annieEngine", desW:number = 640, desH:number = 1040, frameRate:number = 30, scaleMode:string = "fixedHeight", renderType:number = 0) {
            super();
            var s = this;
            s.stage = this;
            if (annie.osType == "pc") {
                s.autoSteering = false;
            }
            this._lastMousePoint = new Point();
            this.name = "stageInstance_" + s.getInstanceId();
            var div:any = document.getElementById(rootDivId);
            s.renderType = renderType;
            s.width = desW;
            s.height = desH;
            s.rootDiv = div;
            s.setFrameRate(frameRate);
            s.scaleMode = scaleMode;
            s.anchorX = desW / 2;
            s.anchorY = desH / 2;
            if (renderType == 0) {
                //canvas
                s.renderObj = new CanvasRender(s);
            } else {
                //webgl
                s.renderObj = new WGRender(s);
            }
            s.renderObj.init();
            var rc = s.renderObj.rootContainer;
            if (osType != "pc") {
                rc.addEventListener("touchstart", s.onMouseEvent.bind(s), false);
                rc.addEventListener('touchmove', s.onMouseEvent.bind(s), false);
                rc.addEventListener('touchend', s.onMouseEvent.bind(s), false);
            } else {
                rc.addEventListener("mousedown", s.onMouseEvent.bind(s), false);
                rc.addEventListener('mousemove', s.onMouseEvent.bind(s), false);
                rc.addEventListener('mouseup', s.onMouseEvent.bind(s), false);
            }
            window.addEventListener("resize", function (e:any) {
                var event = new Event("onResize");
                s.dispatchEvent(event);
                if (!s.autoResize)return;
                var whObj = s.getScreenWH(div);
                s.divHeight = whObj.h;
                s.divWidth = whObj.w;
                s.resize();
            });
            setTimeout(function () {
                var whObj = s.getScreenWH(div);
                s.divHeight = whObj.h;
                s.divWidth = whObj.w;
                s.resize();
                s.update();
                //同时添加到主更新循环中
                Stage.addUpdateObj(s);
                //告诉大家我初始化完成
                s.dispatchEvent(new annie.Event("onInitStage"));
            }, 100);
        }
        /**
         * 刷新函数
         * @method update
         */
        public update():void {
            var s=this;
            if(!s.pause) {
                super.update();
            }
            //检查mouse或touch事件
            s._mt();
        }

        /**
         * 渲染函数
         * @method render
         * @param renderObj
         */
        public render(renderObj:IRender):void {
            if(!this.pause) {
                renderObj.begin();
                super.render(renderObj);
            }
        }

        /**
         * 这个是鼠标事件的对象池,因为如果用户有监听鼠标事件,如果不建立对象池,那每一秒将会new Fps个数的事件对象,影响性能
         * @type {Array}
         * @private
         */
        private _ml:any=[];
        /**
         * 刷新mouse或者touch事件
         * @private
         */
        private _mt():void {
            var s = this;
            var mt:any = s._mouseEventInfo;
            var points:any;
            var events:any = [];
            var event:any;
            var p:Point;
            //事件个数
            var eLen:number = 0;
            for (var item in mt) {
                if (osType == "pc") {
                    points = [mt[item]];
                } else {
                    if (mt[item].targetTouches) {
                        points = mt[item].targetTouches;
                    }
                }
                if (points && points.length > 0) {
                    s._lastMousePoint.x = (points[0].clientX-points[0].target.offsetLeft) * devicePixelRatio;
                    s._lastMousePoint.y = (points[0].clientY-points[0].target.offsetTop) * devicePixelRatio;
                }
                //这个地方检查是所有显示对象列表里是否有添加对应的事件
                if (EventDispatcher.getMouseEventCount(item)> 0){
                    if(!s._ml[eLen]) {
                        event = new MouseEvent(item);
                        events.push(event);
                    }else{
                        event=s._ml[eLen];
                        event.type=item;
                    }
                    p=s.globalToLocal(s._lastMousePoint);
                    event.clientX = s._lastMousePoint.x;
                    event.clientY = s._lastMousePoint.y;
                    event.stageX = p.x;
                    event.stageY = p.y;
                    eLen++;
                }
            }
            if (eLen > 0) {
                //证明有事件那么就开始遍历显示列表。就算有多个事件也不怕，因为坐标点相同，所以只需要遍历一次
                var d:any = s.hitTestPoint(s._lastMousePoint, true);
                var displayList:Array<DisplayObject> = [];
                if (d) {
                    //证明有点击到事件,然后从最底层追上来,看看一路是否有人添加过mouse或touch事件,还要考虑mousechildren和阻止事件方法
                    //找出真正的target,因为有些父级可能会mouseChildren=false;
                    while (d) {
                        if (d["mouseChildren"]===false) {
                            //丢掉之前的层级,因为根本没用了
                            displayList.length=0;
                        }
                        displayList.push(d);
                        d = d.parent;
                    }
                }else{
                    displayList.push(s);
                }
                var len:number = displayList.length;
                for (var i = len - 1; i >= 0; i--) {
                    d = displayList[i];
                    for (var j = 0; j < eLen; j++) {
                        if (events[j]["_pd"]===false) {
                            events[j].currentTarget = d;
                            events[j].target = displayList[0];
                            p=d.globalToLocal(s._lastMousePoint);
                            events[j].localX=p.x;
                            events[j].localY=p.y;
                            d.dispatchEvent(events[j]);
                        }
                    }
                }
            }
            s._mouseEventInfo = {};
        }
        /**
         * 循环刷新页面的函数
         */
        private flush():void {
            var s = this;
            if (s._flush == 0) {
                s.update();
                s.render(s.renderObj);
            } else {
                //将更新和渲染分放到两个不同的时间更新值来执行,这样可以减轻cpu同时执行的压力。
                if (s._currentFlush == 0) {
                    s.update();
                    s._currentFlush = s._flush;
                } else {
                    if (s._currentFlush == s._flush) {
                        s.render(s.renderObj);
                    }
                    s._currentFlush--;
                }
            }
        }

        /**
         * 引擎的刷新率,就是一秒中执行多少次刷新
         * @method setFrameRate
         * @param {number} fps 最好是60的倍数如 1 2 3 6 10 12 15 20 30 60
         * @since 1.0.0
         * @public
         */
        public setFrameRate(fps:number):void {
            var s = this;
            s._flush = 60 / fps - 1 >> 0;
            if (s._flush < 0) {
                s._flush = 0;
            }
        }
        /**
         * 引擎的刷新率,就是一秒中执行多少次刷新
         * @method getFrameRate
         * @since 1.0.0
         * @public
         */
        public getFrameRate():number {
            return 60 / (this._flush + 1);
        }
        /**
         * 获取设备或最上层的div宽高
         * @method getScreenWH
         * @public
         * @since 1.0.0
         * @param {HTMLDivElement} div
         * @returns {{w: number, h: number}}
         */
        private getScreenWH(div:HTMLDivElement) {
            var sw = div.style.width;
            var sh = div.style.height;
            var iw = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;
            var ih = window.innerHeight || document.documentElement.clientHeight
                || document.body.clientHeight;
            var vW = parseInt(sw);
            var vH = parseInt(sh);
            if (vW.toString() == "NaN") {
                vW = iw;
            } else {
                if (sw.indexOf("%") > 0) {
                    vW *= iw / 100;
                }
            }
            if (vH.toString() == "NaN") {
                vH = ih;
            } else {
                if (sh.indexOf("%") > 0) {
                    vH *= ih / 100;
                }
            }
            return {w: vW, h: vH};
        }

        /**
         * 当一个stage不再需要使用,或者要从浏览器移除之前,请先停止它,避免内存泄漏
         * @method kill
         * @since 1.0.0
         * @public
         */
        public kill():void{
            Stage.removeUpdateObj(this);
        }
        /**
         * html的鼠标或单点触摸对应的引擎事件类型名
         * @type {{mousedown: string, mouseup: string, mousemove: string, touchstart: string, touchmove: string, touchend: string}}
         * @private
         */
        private _mouseEventTypes:any = {
            mousedown: "onMouseDown",
            mouseup: "onMouseUp",
            mousemove: "onMouseMove",
            touchstart: "onMouseDown",
            touchmove: "onMouseMove",
            touchend: "onMouseUp"
        };
        /**
         * 当document有鼠标或触摸事件时调用
         * @param e
         */
        private onMouseEvent = function (e:any):void{
            //检查是否有
            var s:any = this;
            s._mouseEventInfo[s._mouseEventTypes[e.type]] = e;
            //阻止向下冒泡
            e.preventDefault();
        };
        /**
         * 设置舞台的对齐模式
         */
        private setAlign = function() {
            var s=this;
            var divH = s.divHeight * devicePixelRatio;
            var divW = s.divWidth * devicePixelRatio;
            var desH = s.height;
            var desW = s.width;
            //设备是否为竖屏
            var isDivH = divH > divW;
            //内容是否为竖屏内容
            var isDesH = desH > desW;
            var scaleY = 1;
            var scaleX = 1;
            s.x = (divW - desW) / 2;
            s.y = (divH - desH) / 2;
            if(s.autoSteering) {
                if (isDesH != isDivH) {
                    var d = divH;
                    divH = divW;
                    divW = d;
                }
            }
            if (s.scaleMode != "noScale") {
                scaleY = divH / desH;
                scaleX = divW / desW;
                switch (s.scaleMode) {
                    case "noBorder":
                        if (scaleX > scaleY) {
                            scaleY = scaleX;
                        } else {
                            scaleX = scaleY;
                        }
                        break;
                    case "showAll":
                        if (scaleX < scaleY) {
                            scaleY = scaleX;
                        } else {
                            scaleX = scaleY;
                        }
                        break;
                    case "fixedWidth":
                        scaleY = scaleX;
                        break;
                    case "fixedHeight":
                        scaleX = scaleY;
                        break;
                }
            }
            s.scaleX = scaleX;
            s.scaleY = scaleY;
            s.viewRect.x = (desW-divW/scaleX)/2;
            s.viewRect.y = (desH-divH/scaleY)/2;
            s.viewRect.width = desW-s.viewRect.x*2;
            s.viewRect.height = desH-s.viewRect.y*2;
            if(s.autoSteering) {
                if (isDesH == isDivH) {
                    s.rotation = 0;
                } else {
                    s.rotation = 90;
                }
            }else{
                s.rotation = 0;
            }
        }
        /**
         * 当舞台尺寸发生改变时调用
         */
        private resize = function () {
            var s=this;
            s.renderObj.reSize();
            s.setAlign();
        }
        public getBounds():Rectangle {
            return this.viewRect;
        }
        private static allUpdateObjList:Array<any>=[];
        private static flushAll():void{
            var len=Stage.allUpdateObjList.length;
            for(var i=0;i<len;i++){
                Stage.allUpdateObjList[i]&&Stage.allUpdateObjList[i].flush();
            }
            requestAnimationFrame(Stage.flushAll);
        }
        private static addUpdateObj(target:any):void{
            var isHave:boolean=false;
            var len=Stage.allUpdateObjList.length;
            for(var i=0;i<len;i++){
                if(Stage.allUpdateObjList[i]===target){
                    isHave=true;
                    break;
                }
            }
            if(!isHave) {
                Stage.allUpdateObjList.push(target);
            }
        }
        private static removeUpdateObj(target:any):void{
            var len=Stage.allUpdateObjList.length;
            for(var i=0;i<len;i++){
                if(Stage.allUpdateObjList[i]===target){
                    Stage.allUpdateObjList.splice(i,1);
                    break;
                }
            }
        }
    }
}