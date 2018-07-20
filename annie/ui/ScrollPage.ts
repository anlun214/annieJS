/**
 * @module annieUI
 */
namespace annieUI {
    import Sprite = annie.Sprite;
    import Shape = annie.Shape;
    /**
     * 滚动视图，有些时候你的内容超过了一屏，需要上下或者左右滑动来查看内容，这个时候，你就应该用它了
     * @class annieUI.ScrollPage
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    export class ScrollPage extends Sprite {
        /**
         * 横向还是纵向 默认为纵向
         * @property isVertical
         * @type {boolean}
         * @private
         * @since 1.0.0
         * @default true
         */
        protected isVertical: boolean = true;
        /**
         * 可见区域的宽
         * @property viewWidth
         * @type {number}
         * @private
         * @since 1.0.0
         * @default 0
         */
        private viewWidth: number = 0;
        /**
         * 可见区域的高
         * @property viewHeight
         * @type {number}
         * @private
         * @since 1.0.0
         * @default 0
         */
        private viewHeight: number = 0;
        private _tweenId:number=0;
        /**
         * 整个滚动的最大距离值
         * @property maxDistance
         * @type {number}
         * @public
         * @since 1.0.0
         * @default 1040
         */
        public maxDistance: number = 1040;
        /**
         * @property 滚动距离
         * @type {number}
         * @protected
         * @default 0
         * @since 1.0.0
         */
        protected distance: number = 0;
        /**
         * 最小鼠标滑动距离
         * @property  minDis
         * @private
         * @type {number}
         */
        private minDis: number = 2;
        /**
         * 遮罩对象
         * @property maskObj
         * @since 1.0.0
         * @private
         * @type {annie.Shape}
         */
        private maskObj: Shape = new Shape();
        /**
         * 真正的容器对象，所有滚动的内容都应该是添加到这个容器中
         * @property view
         * @public
         * @since 1.0.0
         * @type {annie.Sprite}
         */
        public view: Sprite = new Sprite();
        /**
         * 最后鼠标经过的坐标值
         * @property lastValue
         * @private
         * @since 1.0.0
         * @type {number}
         */
        private lastValue: number = 0;
        /**
         * 速度
         * @property speed
         * @protected
         * @since 1.0.0
         * @type {number}
         */
        protected speed: number = 0;
        /**
         * 加速度
         * @property addSpeed
         * @private
         * @since 1.0.0
         * @type {number}
         */
        private addSpeed: number = 0;
        /**
         * 是否是停止滚动状态
         * @property isStop
         * @public
         * @since 1.0.0
         * @type {boolean}
         * @default true
         */
        public isStop: boolean = true;
        /**
         * 滚动的最大速度，直接影响一次滑动之后最长可以滚多远
         * @property maxSpeed
         * @public
         * @since 1.0.0
         * @default 100
         * @type {number}
         */
        public maxSpeed: number = 100;
        /**
         * 摩擦力,值越大，减速越快
         * @property fSpeed
         * @public
         * @since 1.0.0
         * @default 20
         * @type {number}
         */
        public fSpeed: number = 20;
        protected paramXY: string = "y";
        private stopTimes: number = -1;
        private isMouseDownState: number = 0;
        /**
         * 是否是通过scrollTo方法在滑动中
         * @property autoScroll
         * @since 1.0.2
         * @type {boolean}
         * @private
         * @default false
         */
        private autoScroll: boolean = false;

        /**
         * 构造函数
         * @method  ScrollPage
         * @param {number} vW 可视区域宽
         * @param {number} vH 可视区域高
         * @param {number} maxDistance 最大滚动的长度
         * @param {boolean} isVertical 是纵向还是横向，也就是说是滚x还是滚y,默认值为沿y方向滚动
         * @example
         *      s.sPage=new annie.ScrollPage(640,s.stage.viewRect.height,4943);
         *          s.addChild(s.sPage);
         *          s.sPage.view.addChild(new home.Content());
         *          s.sPage.y=s.stage.viewRect.y;
         *          s.sPage.mouseEnable=false;
         * <p><a href="https://github.com/flash2x/demo3" target="_blank">测试链接</a></p>
         */
        constructor(vW: number, vH: number, maxDistance: number, isVertical: boolean = true) {
            super();
            let s = this;
            s._instanceType = "annie.ScrollPage";
            s.addChild(s.maskObj);
            s.addChild(s.view);
            s.view.mask = s.maskObj;
            s.maskObj["_isUseToMask"]=0;
            s.maskObj.alpha=0;
            s.maxDistance = maxDistance;
            s.setViewRect(vW, vH,isVertical);
           // s.addEventListener(annie.MouseEvent.MOUSE_DOWN, s.onMouseEvent.bind(s));
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, s.onMouseEvent.bind(s));
            s.addEventListener(annie.MouseEvent.MOUSE_UP, s.onMouseEvent.bind(s));
            s.addEventListener(annie.MouseEvent.MOUSE_OUT, s.onMouseEvent.bind(s));
            s.addEventListener(annie.Event.ENTER_FRAME, function () {
                let view: any = s.view;
                if (s.autoScroll)return;
                if (!s.isStop){
                    if (Math.abs(s.speed) > 0) {
                        view[s.paramXY] += s.speed;
                        //是否超过了边界,如果超过了,则加快加速度,让其停止
                        if (view[s.paramXY] > 0 || view[s.paramXY] < s.distance - s.maxDistance) {
                            s.speed += s.addSpeed * s.fSpeed;
                        } else {
                            s.speed += s.addSpeed;
                        }
                        //说明超过了界线,准备回弹
                        if (s.speed * s.addSpeed > 0) {
                            s.dispatchEvent("onScrollStop");
                            s.speed = 0;
                        }
                    } else {
                        //检测是否超出了边界,如果超出了边界则回弹
                        if (s.addSpeed != 0) {
                            if (view[s.paramXY] > 0 || view[s.paramXY] < s.distance - s.maxDistance) {
                                let tarP: number = 0;
                                if (s.addSpeed >0) {
                                    if (s.distance < s.maxDistance) {
                                        tarP = s.distance - s.maxDistance;
                                    }
                                }
                                view[s.paramXY] += 0.4 * (tarP - view[s.paramXY]);
                                if (Math.abs(tarP-view[s.paramXY]) < 0.1) {
                                    s.isStop = true;
                                    if(s.addSpeed>0){
                                        s.dispatchEvent("onScrollToEnd");
                                    }else{
                                        s.dispatchEvent("onScrollToHead");
                                    }
                                }
                            }
                        }else {
                            s.isStop = true;
                        }
                    }
                } else {
                    if (s.stopTimes >= 0) {
                        s.stopTimes++;
                        if (s.stopTimes >= 15) {
                            s.speed = 0;
                            if (view[s.paramXY] > 0 || view[s.paramXY] < s.distance - s.maxDistance) {
                                s.isStop = false;
                                s.stopTimes = -1;
                            }
                        }
                    }
                }
            })
        }
        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置
         * @method setViewRect
         * @param {number}w 设置可见区域的宽
         * @param {number}h 设置可见区域的高
         * @param {boolean} isVertical 方向
         * @public
         * @since 1.1.1
         */
        public setViewRect(w: number, h: number,isVertical:boolean): void {
            let s: any = this;
            s.maskObj.clear();
            s.maskObj.beginFill("#000000");
            s.maskObj.drawRect(0, 0, w, h);
            s.viewWidth = w;
            s.viewHeight = h;
            s.maskObj.endFill();
            s.isVertical = isVertical;
            if (isVertical) {
                s.distance = s.viewHeight;
                s.paramXY = "y";
            } else {
                s.distance = s.viewWidth;
                s.paramXY = "x";
            }
            s.isVertical=isVertical;
        }

        private onMouseEvent(e: annie.MouseEvent): void {
            let s = this;
            let view: any = s.view;
            // if (s.distance < s.maxDistance) {
            if (e.type == annie.MouseEvent.MOUSE_MOVE) {
                if (s.isMouseDownState<1){
                    if (!s.isStop) {
                        s.isStop = true;
                    }
                    if (s.autoScroll){
                        s.autoScroll=false;
                        annie.Tween.kill(s._tweenId);
                    }
                    if (s.isVertical) {
                        s.lastValue = e.localY;
                    } else {
                        s.lastValue = e.localX;
                    }
                    s.speed = 0;
                    s.isMouseDownState = 1;
                    return;
                };
                if(s.isMouseDownState==1){
                    s.dispatchEvent("onScrollStart");
                }
                s.isMouseDownState=2;
                let currentValue: number;
                if (s.isVertical) {
                    currentValue = e.localY;
                } else {
                    currentValue = e.localX;
                }
                s.speed = currentValue - s.lastValue;
                if (s.speed > s.minDis) {
                    s.addSpeed = -2;
                    if (s.speed > s.maxSpeed) {
                        s.speed = s.maxSpeed;
                    }
                } else if (s.speed < -s.minDis) {
                    if (s.speed < -s.maxSpeed) {
                        s.speed = -s.maxSpeed;
                    }
                    s.addSpeed = 2;
                } else {
                    s.speed = 0;
                }
                if (s.speed != 0) {
                    let speedPer: number = 1;
                    if (view[s.paramXY] > 0 || view[s.paramXY] < s.distance - s.maxDistance) {
                        speedPer = 0.2;
                    }
                    view[s.paramXY] += (currentValue - s.lastValue) * speedPer;
                }
                s.lastValue = currentValue;
                s.stopTimes = 0;
            } else {
                s.isStop = false;
                s.stopTimes = -1;
                if(s.speed==0&&s.isMouseDownState==2){
                    s.dispatchEvent("onScrollStop");
                }
                s.isMouseDownState = 0;
            }
            // }
        }
        /**
         * 滚到指定的坐标位置
         * @method scrollTo
         * @param {number} dis 需要去到的位置
         * @param {number} time 滚动需要的时间 默认为0 即没有动画效果直接跳到指定页
         * @since 1.1.1
         * @public
         */
        public scrollTo(dis: number, time: number = 0): void {
            let s:any = this;
            let newDis=s.paramXY=="x"?s.viewWidth:s.viewHeight;
            if(dis<0){
                dis=0;
            }else if(dis>s.maxDistance-newDis){
                dis=s.maxDistance-newDis;
            }
            if(Math.abs(s.view[s.paramXY]+dis)>2) {
                s.autoScroll = true;
                s.isStop = true;
                s.isMouseDownState = 0;
                let obj: any = {};
                obj.onComplete = function () {
                    s.autoScroll = false;
                };
                obj[s.paramXY] = -dis;
                s._tweenId=annie.Tween.to(s.view, time, obj);
                if(s.speed==0){
                    s.dispatchEvent("onScrollStart");
                }
            }
        }
        public destroy(): void {
            let s=this;
            s.maskObj=null;
            s.view=null;
            super.destroy();
        }
    }
}