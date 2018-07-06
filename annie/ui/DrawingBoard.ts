/**
 * Created by anlun on 2017/5/24.
 */
/**
 * @module annie
 */
namespace annie {
    /**
     * 画板类
     * @class annie.DrawingBoard
     * @public
     * @extends annie.Bitmap
     * @since 1.1.1
     */
    export class DrawingBoard extends annie.Bitmap {
        protected context: CanvasRenderingContext2D = null;
        protected _isMouseDown: boolean = false;

        /**
         * 绘画半径
         * @property drawRadius
         * @type {number}
         * @public
         * @since 1.1.1
         */
        public get drawRadius(): number {
            return this._drawRadius;
        };

        public set drawRadius(value: number) {
            this._drawRadius = value;
        }

        protected _drawRadius: number = 50;
        /**
         * 绘画颜色, 可以是任何的颜色类型
         * @property drawColor
         * @type {string}
         * @public
         * @since
         * @type {any}
         */
        public drawColor: any = "#ffffff";
        /**
         * 背景色 可以是任何的颜色类型
         * @property bgColor
         * @type {any}
         * @public
         * @since 1.1.1
         */
        public bgColor: any = "";
        /**
         * 画板宽
         * @property drawWidth
         * @type {number}
         * @readonly
         * @public
         * @since 1.1.1
         */
        public drawWidth: number = 0;
        /**
         * 画板高
         * @property drawHeight
         * @type {number}
         * @readonly
         * @public
         * @since 1.1.1
         */
        public drawHeight: number = 0;
        /**
         * 总步数数据
         * @property totalStepList
         * @protected
         * @type {any[]}
         */
        protected totalStepList: any = [];
        /**
         * 单步数据
         * @protected
         * @property addStepObj
         * @type {Object}
         */
        protected addStepObj: any;
        /**
         * 当前步数所在的id
         * @property currentStepId
         * @protected
         * @type {number}
         */
        protected currentStepId: number = 0;

        /**
         * 构造函数
         * @method DrawingBoard
         * @param width 画板宽
         * @param height 画板高
         * @param bgColor 背景色 默认透明
         * @since 1.1.1
         */
        constructor(width: number, height: number, bgColor: any = "") {
            super();
            var s = this;
            var bd = document.createElement("canvas");
            bd.width = width;
            bd.height = height;
            s.context = bd.getContext("2d");
            s.context.lineCap = "round";
            s.context.lineJoin = "round";
            s.bitmapData = bd;
            s.drawHeight = height;
            s.drawWidth = width;
            s.reset(bgColor);
            var mouseDown = s.onMouseDown.bind(s);
            var mouseMove = s.onMouseMove.bind(s);
            var mouseUp = s.onMouseUp.bind(s);
            s.addEventListener(annie.MouseEvent.MOUSE_DOWN, mouseDown);
            s.addEventListener(annie.MouseEvent.MOUSE_MOVE, mouseMove);
            s.addEventListener(annie.MouseEvent.MOUSE_UP, mouseUp);
        }

        /**
         * @method onMouseDown
         * @private
         * @param {annie.MouseEvent} e
         */
        private onMouseDown(e: annie.MouseEvent): void {
            let s = this;
            s._isMouseDown = true;
            let ctx = s.context;
            ctx.beginPath();
            ctx.strokeStyle = s.drawColor;
            ctx.lineWidth = s._drawRadius;
            let lx: number = e.localX >> 0;
            let ly: number = e.localY >> 0;
            ctx.moveTo(lx, ly);
            s.addStepObj = {};
            s.addStepObj.c = s.drawColor;
            s.addStepObj.r = s._drawRadius;
            s.addStepObj.sx = lx;
            s.addStepObj.sy = ly;
            s.addStepObj.ps = [];
        };
        /**
         * @method onMouseUp
         * @private
         * @param {annie.MouseEvent} e
         */
        private onMouseUp(e: annie.MouseEvent): void {
            let s = this;
            if(s._isMouseDown) {
                s._isMouseDown = false;
                if (s.addStepObj.ps && s.addStepObj.ps.length > 0) {
                    s.currentStepId++;
                    s.totalStepList.push(s.addStepObj);
                }
            }
        };
        /**
         * @method onMouseMove
         * @private
         * @param {annie.MouseEvent} e
         */
        private onMouseMove(e: annie.MouseEvent): void {
            let s = this;
            if (s._isMouseDown) {
                let ctx = s.context;
                let lx: number = e.localX >> 0;
                let ly: number = e.localY >> 0;
                ctx.lineTo(lx, ly);
                ctx.stroke();
                s.addStepObj.ps.push(lx, ly);
            }
        };

        /**
         * 重置画板
         * @method reset
         * @param bgColor
         * @public
         * @since 1.1.1
         */
        public reset(bgColor: any = ""): void {
            let s = this;
            if (bgColor != "") {
                s.bgColor = bgColor;
            }
            if (s.bgColor != "") {
                s.context.fillStyle = s.bgColor;
                s.context.fillRect(0, 0, s.bitmapData.width, s.bitmapData.height);
            } else {
                s.context.clearRect(0, 0, s.bitmapData.width, s.bitmapData.height);
            }
            s.currentStepId = 0;
            s.totalStepList = [];
        }

        /**
         * 撤销步骤
         * @method cancel
         * @param {number} step 撤销几步 0则全部撤销,等同于reset
         * @public
         * @since 1.1.1
         */
        public cancel(step: number = 0): boolean {
            let s = this;
            if (step == 0) {
                s.reset();
            } else {
                if (s.currentStepId - step >= 0) {
                    s.currentStepId -= step;
                    s.totalStepList.splice(s.currentStepId, step);
                    if (s.bgColor != "") {
                        s.context.fillStyle = s.bgColor;
                        s.context.fillRect(0, 0, s.bitmapData.width, s.bitmapData.height);
                    } else {
                        s.context.clearRect(0, 0, s.bitmapData.width, s.bitmapData.height);
                    }
                    let len: number = s.totalStepList.length;
                    for (let i = 0; i < len; i++) {
                        let ctx = s.context;
                        ctx.beginPath();
                        ctx.strokeStyle = s.totalStepList[i].c;
                        ctx.lineWidth = s.totalStepList[i].r;
                        ctx.moveTo(s.totalStepList[i].sx, s.totalStepList[i].sy);
                        let ps: any = s.totalStepList[i].ps;
                        let pLen: number = ps.length;
                        for (let m = 0; m < pLen; m += 2) {
                            ctx.lineTo(ps[m], ps[m + 1]);
                            ctx.stroke();
                        }
                    }
                } else {
                    return false;
                }
            }
            return true;
        }
        public destroy(): void {
            let s=this;
           s.context=null;
           s.totalStepList=null;
           s.drawColor=null;
           s.bgColor=null;
           s.addStepObj=null;
            super.destroy();
        }
    }
}