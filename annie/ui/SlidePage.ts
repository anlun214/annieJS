/**
 * Created by saron on 16/10/19.
 */

/**
 * @module annie
 */
namespace annie {
    import Sprite = annie.Sprite;

    /**
     * 滑动页面类
     * @class annie.SlidePage
     * @public
     * @extends annie.Sprite
     * @since 1.0.0
     */
    export class SlidePage extends Sprite {
        /**
         * 页面个数
         * @property listLen
         * @type {number}
         * @private
         * @default 0
         */
        private listLen: number = 0;
        /**
         * 页面滑动容器
         * @property view
         * @type {annie.Sprite}
         * @since 1.1.0
         * @public
         */
        public view: Sprite = new annie.Sprite();
        public maskObj: annie.Shape = new annie.Shape();
        /**
         * 滑动方向
         * @property isVertical
         * @type {boolean}
         * @private
         */
        private isVertical: boolean;
        /**
         * 容器活动速度
         * @property slideSpeed
         * @type {number}
         * @public
         * @default 0.2
         */
        public slideSpeed: number = 0.2;
        /**
         * 是否滑动中断
         * @property _isBreak
         * @private
         * @type {boolean}
         */
        private _isBreak: boolean = false;
        /**
         * 滚动距离
         * @property distance
         * @type {number}
         * @protected
         * @default 0
         * @since 1.0.0
         */
        protected distance: number = 0;
        /**
         * 触摸点结束点X
         * @property touchEndX
         * @type {number}
         * @private
         */
        private touchEndX: number = 0;
        private movingX: number = 0;
        private movingY: number = 0;
        private _moveDis: number = 0;
        /**
         * 触摸点结束点Y
         * @property touchEndY
         * @type {number}
         * @private
         * @since
         * @public
         * @default 0
         */
        private touchEndY: number = 0;
        /**
         * 当前页面索引ID 默认从0开始
         * @property currentPageIndex
         * @type {number}
         * @public
         * @since 1.0.3
         * @default 0
         */
        public currentPageIndex: number = 0;
        //上下的回弹率
        public reBound: number = 0.3;
        //页面是否滑动跟随
        public isPageFollowToMove: boolean = false;
        //页面的跟率
        public follow: number = 0.7;
        /**
         * 页面是否移动
         * @property isMoving
         * @type {boolean}
         * @public
         * @default false
         * @public
         */
        public isMoving = false;
        /**
         * 页面宽
         * @property viewWidth
         * @type {number}
         * @private
         */
        public viewWidth: number = 0;
        /**
         * 页面高
         * @property viewHeight
         * @type {number}
         * @private
         */
        public viewHeight: number = 0;
        /**
         * 页面列表
         * @property pageList
         * @type {Array}
         * @private
         */
        private pageList: Array<any> = [];
        private pageClassList: Array<any> = [];
        private lastX: number = 0;
        private lastY: number = 0;
        /**
         * 是否点击了鼠标
         * @property isMouseDown
         * @type {boolean}
         * @private
         */
        private isMouseDown: boolean = false;
        /**
         * 是否可以下一页
         * @property canSlideNext
         * @since 1.0.3
         * @default true
         * @type {boolean}
         * @public
         */
        public canSlideNext: boolean = true;
        /**
         * 是否可以上一页
         * @property canSlidePrev
         * @type {boolean}
         * @public
         * @default true
         */
        public canSlidePrev: boolean = true;
        public paramXY: string = "y";
        private _ease: Function;

        /**
         * 构造函数
         * @method SlidePage
         * @param {number} vW 宽
         * @param {number} vH 高
         * @param {boolean} isVertical 是横向还是纵向 默认纵向
         * @param {Function} ease annie.Tween的缓存函数，也可以是自定义的缓动函数，自定义的话,请尊守annie.Tween缓动函数接口
         */
        constructor(vW: number, vH: number, isVertical: boolean = true, ease: Function = null) {
            super();
            var s = this;
            s.isVertical = isVertical;
            s._ease = ease;
            if (isVertical) {
                s.paramXY = "y";
                s.distance = vH;
            } else {
                s.paramXY = "x";
                s.distance = vW;
            }
            s.addChild(s.maskObj);
            s.addChild(s.view);
            s.view.mask = s.maskObj;
            s.maskObj["_isUseToMask"]=false;
            s.maskObj.alpha=0;
            s.setMask(vW, vH);
            var me = s.onMouseEvent.bind(s);
            s.addEventListener(annie.MouseEvent.MOUSE_DOWN, me);
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, me);
            s.addEventListener(annie.MouseEvent.MOUSE_UP, me);
        }

        /**
         * 设置可见区域，可见区域的坐标始终在本地坐标中0,0点位置
         * @method setMask
         * @param {number}w 设置可见区域的宽
         * @param {number}h 设置可见区域的高
         * @public
         * @since 1.0.0
         */
        private setMask(w: number, h: number): void {
            let s: any = this;
            s.maskObj.clear();
            s.maskObj.beginFill("#000000");
            s.maskObj.drawRect(0, 0, w, h);
            s.viewWidth = w;
            s.viewHeight = h;
            s.maskObj.endFill();
        }
        /**
         * 触摸事件
         * @param e
         */
        private onMouseEvent(e: annie.MouseEvent): void {
            let s: any = this;
            if (s.isMoving) return;
            if (e.type == annie.MouseEvent.MOUSE_DOWN) {
                s.touchEndX = e.localX;
                s.touchEndY = e.localY;
                s.movingX = s.movingY = 0;
                s.isMouseDown = true;
                s._isBreak = false;
                s.lastX = e.localX;
                s.lastY = e.localY;
                s._moveDis = 0;
            } else if (e.type == annie.MouseEvent.MOUSE_MOVE) {
                if (!s.isMouseDown) return;
                let mx: number = e.localX - s.touchEndX;
                let my = e.localY - s.touchEndY;
                let ts: number = my;
                let fts: number = mx;
                let lts: number = s.movingY;
                s._moveDis = s.lastY - e.localY;
                s.movingX = mx;
                s.movingY = my;
                if (!s.isVertical) {
                    ts = mx;
                    fts = my;
                    lts = s.movingX;
                    s._moveDis = s.lastX - e.localX;
                }
                if(Math.abs(ts)>Math.abs(fts)) {
                    if (!s.isPageFollowToMove) {
                        if (Math.abs(ts) - Math.abs(lts) < -1) {
                            s._isBreak = true;
                        }
                    }
                    if (ts > 0) {
                        if (s.currentPageIndex == 0) {
                            s.view[s.paramXY] -= s._moveDis  * s.reBound;
                        } else {
                            if (s.isPageFollowToMove) {
                                s.view[s.paramXY] -= s._moveDis * s.follow;
                                let nextId = s.currentPageIndex - 1;
                                if (!s.pageList[nextId]) {
                                    s.pageList[nextId] = new s.pageClassList[nextId]();
                                }
                                if (s.pageList[nextId].parent != s.view) {
                                    s.view.addChild(s.pageList[nextId]);
                                    s.pageList[nextId][s.paramXY] = nextId * s.distance;
                                }
                            }
                        }
                    } else if (ts < 0) {
                        if (s.currentPageIndex == s.listLen - 1) {
                            s.view[s.paramXY]  -= s._moveDis * s.reBound;
                        } else {
                            if (s.isPageFollowToMove) {
                                s.view[s.paramXY] -= s._moveDis * s.follow;
                                let nextId = s.currentPageIndex + 1;
                                if (!s.pageList[nextId]) {
                                    s.pageList[nextId] = new s.pageClassList[nextId]();
                                }
                                if (s.pageList[nextId].parent != s.view) {
                                    s.view.addChild(s.pageList[nextId]);
                                    s.pageList[nextId][s.paramXY] = nextId * s.distance;
                                }
                            }
                        }
                    }
                }else{
                    s.movingX = s.movingY = 0;
                }
                s.lastX = e.localX;
                s.lastY = e.localY;
            } else if (e.type == annie.MouseEvent.MOUSE_UP) {
                if (!s.isMouseDown) return;
                let ts: number = s.movingY;
                let fts: number = s.movingX;
                s.isMouseDown = false;
                if (!s.isVertical) {
                    ts = s.movingX;
                    fts = s.movingY;
                }
                if ((s.currentPageIndex == 0 && s.view[s.paramXY] > 0) || (s.currentPageIndex == (s.listLen - 1) && s.view[s.paramXY] < -s.currentPageIndex * s.distance)) {
                    let tweenData: any = {};
                    tweenData[s.paramXY] = -s.currentPageIndex * s.distance;
                    if (s._ease) {
                        tweenData.ease = s._ease;
                    }
                    annie.Tween.to(s.view, s.slideSpeed * s.reBound, tweenData);
                } else {
                    let id = s.currentPageIndex;
                    if (!s.isPageFollowToMove) {
                        if (Math.abs(ts) > 100 && !s._isBreak) {
                            s.slideTo(ts < 0 ? id + 1 : id - 1);
                        }
                    } else {
                        if (Math.abs(s._moveDis) > 5 || Math.abs(ts * s.follow << 1) >= s.distance) {
                            s.slideTo(ts < 0 ? id + 1 : id - 1);
                        } else {
                            let where = -s.currentPageIndex * s.distance;
                            if (where == s.view[s.paramXY]) return;
                            s.view.mouseEnable = false;
                            s.isMoving = true;
                            let tweenData: any = {};
                            tweenData[s.paramXY] = where;
                            if (s._ease) {
                                tweenData.ease = s._ease;
                            }
                            tweenData.onComplete = function () {
                                s.view.mouseEnable = true;
                                s.isMoving = false;
                                if (s.currentPageIndex > 0 && s.pageList[s.currentPageIndex - 1] && s.pageList[s.currentPageIndex - 1].parent == s.view) {
                                    s.view.removeChild(s.pageList[s.currentPageIndex - 1]);
                                }
                                if (s.currentPageIndex < (s.listLen - 1) && s.pageList[s.currentPageIndex + 1] && s.pageList[s.currentPageIndex + 1].parent == s.view) {
                                    s.view.removeChild(s.pageList[s.currentPageIndex + 1]);
                                }
                            };
                            annie.Tween.to(s.view, s.slideSpeed * 0.5, tweenData);
                        }
                    }
                }
            }
        }

        /**
         * 滑动到指定页
         * @method slideTo
         * @public
         * @since 1.1.1
         * @param {number} index 是向上还是向下
         */
        public slideTo(index: number,noTween:boolean=false): void {
            let s: any = this;
            if (s.isMoving || s.currentPageIndex == index) {
                return;
            }
            let lastId = s.currentPageIndex;
            let isNext = s.currentPageIndex < index ? true : false;
            if (isNext) {
                if (index < s.listLen && s.canSlideNext) {
                    s.currentPageIndex = index;
                } else {
                    return;
                }
            } else {
                if (index >= 0 && s.canSlidePrev) {
                    s.currentPageIndex = index;
                } else {
                    return;
                }
            }
            if (!s.pageList[s.currentPageIndex]) {
                s.pageList[s.currentPageIndex] = new s.pageClassList[s.currentPageIndex]();
            }
            s.pageList[s.currentPageIndex][s.paramXY] = s.currentPageIndex * s.distance;
            if (isNext) {
                s.pageList[lastId][s.paramXY] = (s.currentPageIndex - 1) * s.distance;
            } else {
                s.pageList[lastId][s.paramXY] = (s.currentPageIndex + 1) * s.distance;
            }
            if (!s.isPageFollowToMove) {
                s.view[s.paramXY] = -s.pageList[lastId][s.paramXY];
            }
            if (s.pageList[s.currentPageIndex] != s.view) {
                s.view.addChild(s.pageList[s.currentPageIndex]);
            }
            if(noTween){
                s.dispatchEvent("onSlideStart", {currentPage: s.currentPageIndex, lastPage: lastId});
                s.view[s.paramXY]=-s.currentPageIndex * s.distance;
                s.view.removeChild(s.pageList[lastId]);
                s.dispatchEvent("onSlideEnd");
            }else {
                s.view.mouseEnable = false;
                s.isMoving = true;
                let tweenData: any = {};
                tweenData[s.paramXY] = -s.currentPageIndex * s.distance;
                if (s._ease) {
                    tweenData.ease = s._ease;
                }
                tweenData.onComplete = function () {
                    s.view.mouseEnable = true;
                    s.isMoving = false;
                    s.view.removeChild(s.pageList[lastId]);
                    s.dispatchEvent("onSlideEnd");
                };
                annie.Tween.to(s.view, s.slideSpeed, tweenData);
                s.dispatchEvent("onSlideStart", {currentPage: s.currentPageIndex, lastPage: lastId});
            }
        }

        /**
         * 用于插入分页
         * @method addPageList
         * @param {Array} classList  每个页面的类，注意是类，不是对象
         * @since 1.0.3
         * @public
         */
        public addPageList(classList: any): void {
            var s = this;
            s.pageClassList = s.pageClassList.concat(classList);
            if (s.listLen == 0 && s.pageClassList.length > 0) {
                let pageFirst = new s.pageClassList[0]();
                s.pageList.push(pageFirst);
                s.view.addChild(pageFirst);
            }
            s.listLen = s.pageClassList.length;
        }
        public destroy(): void {
            let s=this;
            s.pageList=null;
            s.pageClassList=null;
            super.destroy();
        }
    }
}