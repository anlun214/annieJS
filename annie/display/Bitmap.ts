/// <reference path="DisplayObject.ts" />
/**
 * @module annie
 */
namespace annie {
    /**
     * 利用 Bitmap() 构造函数，可以创建包含对 BitmapData 对象的引用的 Bitmap 对象。
     * 创建了 Bitmap 对象后，使用父 Sprite 实例的 addChild() 或 addChildAt() 方法将位图放在显示列表中。
     * 一个 Bitmap 对象可在若干 Bitmap 对象之中共享其 BitmapData 引用，
     * 与转换属性或旋转属性无关。由于能够创建引用相同 BitmapData 对象的多个 Bitmap 对象，
     * 因此，多个显示对象可以使用相同的复杂 BitmapData 对象，而不会因为每个显示对象实例使用一个 BitmapData 对象而产生内存开销。
     * @class annie.Bitmap
     * @public
     * @extends annie.DisplayObject
     * @since 1.0.0
     */
    export class Bitmap extends DisplayObject {
        private _bitmapData: any = null;
        private _realCacheImg: any = null;
        /**
         * 有时候一张贴图图，我们只需要显示他的部分。其他不显示,对你可能猜到了
         * SpriteSheet就用到了这个属性。默认为null表示全尺寸显示bitmapData需要显示的范围
         * @property rect
         * @public
         * @since 1.0.0
         * @type {annie.Rectangle}
         * @default null
         */
        public rect: Rectangle = null;
        /**
         * @property _isCache
         * @private
         * @since 1.0.0
         * @type {boolean}
         * @default false
         */
        private _isCache: boolean = false;

        /**
         * 构造函数
         * @method Bitmap
         * @since 1.0.0
         * @public
         * @param {Image|Video|other} bitmapData 一个HTMl Image的实例
         * @param {annie.Rectangle} rect 设置显示Image的区域,不设置些值则全部显示Image的内容
         * @example
         *      var imgEle=new Image();
         *      imgEle.onload=function (e) {
         *          var bitmap = new annie.Bitmap(imgEle)
         *          //居中对齐
         *          bitmap.x = (s.stage.desWidth - bitmap.width) / 2;
         *          bitmap.y = (s.stage.desHeight - bitmap.height) / 2;
         *          s.addChild(bitmap);
         *
         *          //截取图片的某一部分显示
         *          var rect = new annie.Rectangle(0, 0, 200, 200),
         *          rectBitmap = new annie.Bitmap(imgEle, rect);
         *          rectBitmap.x = (s.stage.desWidth - bitmap.width) / 2;
         *          rectBitmap.y = 100;
         *          s.addChild(rectBitmap);
         *      }
         *      imgEle.src='http://test.annie2x.com/biglong/logo.jpg';
         *
         * <p><a href="http://test.annie2x.com/biglong/apiDemo/annieBitmap/index.html" target="_blank">测试链接</a></p>
         */
        public constructor(bitmapData: any = null, rect: Rectangle = null) {
            super();
            let s = this;
            s._instanceType = "annie.Bitmap";
            s.rect = rect;
            s.bitmapData = bitmapData;
        }
        /**
         * HTML的一个Image对象或者是canvas对象或者是video对象
         * @property bitmapData
         * @public
         * @since 1.0.0
         * @type {any}
         * @default null
         */
        public get bitmapData(): any {
            return this._bitmapData;
        };
        public set bitmapData(value: any) {
            let s=this;
            s._setProperty("_bitmapData",value,3);
            if (!value) {
                s._bounds.width = s._bounds.height = 0;
            }else{
                s._bounds.width=s.rect?s.rect.width:value.width;
                s._bounds.height=s.rect?s.rect.height:value.height;
            }
        }
        /**
         * 是否对矢量使用像素碰撞 默认开启
         * @property hitTestWidthPixel
         * @type {boolean}
         * @default false
         * @since 1.1.0
         */
        public hitTestWidthPixel:boolean=false;
        /**
         * 重写刷新
         * @method update
         * @public
         * @param isDrawUpdate 不是因为渲染目的而调用的更新，比如有些时候的强制刷新 默认为true
         * @since 1.0.0
         */
        public update(isDrawUpdate:boolean=false): void {
            let s = this;
            if(!s._visible)return;
            super.update(isDrawUpdate);
            //滤镜
            let bitmapData = s._bitmapData;
            if ((s._UI.UD||s._UI.UF) && bitmapData) {
                if(bitmapData.width==0||bitmapData.height==0)return;
                s._UI.UD = false;
                if (s.cFilters.length > 0) {
                    if (!s._realCacheImg) {
                        s._realCacheImg = window.document.createElement("canvas");
                    }
                    let _canvas = s._realCacheImg;
                    let tr = s.rect;
                    let w = tr ? tr.width : bitmapData.width;
                    let h = tr ? tr.height : bitmapData.height;
                    let newW = w + 20;
                    let newH = h + 20;
                    _canvas.width = newW;
                    _canvas.height = newH;
                    let ctx = _canvas.getContext("2d");
                    ctx.clearRect(0, 0, newW, newH);
                    ctx.translate(10, 10);
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = "#0";
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ////////////////////
                    if (tr) {
                        ctx.drawImage(s._bitmapData, tr.x, tr.y, w, h, 0, 0, w, h);
                    } else {
                        ctx.drawImage(s._bitmapData, 0, 0);
                    }
                    /////////////////////
                    let cf = s.cFilters;
                    let cfLen = cf.length;
                    if(cfLen>0) {
                        let imageData = ctx.getImageData(0, 0, newW, newH);
                        for (let i = 0; i < cfLen; i++) {
                            cf[i].drawFilter(imageData);
                        }
                        ctx.putImageData(imageData, 0, 0);
                    }
                    //s._realCacheImg.src = _canvas.toDataURL("image/png");
                    s._texture = s._realCacheImg;
                    s._offsetX = -10;
                    s._offsetY = -10;
                    s._isCache = true;
                } else {
                    s._isCache = false;
                    s._offsetX = 0;
                    s._offsetY = 0;
                    s._texture = bitmapData;
                }
                let bw: number;
                let bh: number;
                if (s.rect) {
                    bw = s.rect.width;
                    bh = s.rect.height;
                } else {
                    bw = s._texture.width + s._offsetX * 2;
                    bh = s._texture.height + s._offsetY * 2;
                }
                s._bounds.width = bw;
                s._bounds.height = bh;
                //给webgl更新新
                // s._texture.updateTexture = true;
            }
            s._UI.UF = false;
            s._UI.UM = false;
            s._UI.UA = false;
        }
        /**
         * 从SpriteSheet的大图中剥离出单独的小图以供特殊用途
         * @method convertToImage
         * @static
         * @public
         * @since 1.0.0
         * @param {annie.Bitmap} bitmap
         * @param {boolean} isNeedImage 是否一定要返回img，如果不为true则有时返回的是canvas
         * @return {Canvas|BitmapData}
         * @example
         *      var spriteSheetImg = new Image(),
         *          rect = new annie.Rectangle(0, 0, 200, 200),
         *          yourBitmap = new annie.Bitmap(spriteSheetImg, rect);
         *       spriteSheetImg.onload=function(e){
         *          var singleSmallImg = annie.Bitmap.convertToImage(yourBitmap);//convertToImage是annie.Bitmap的一个静态方法
         *          trace(singleSmallImg);
         *       }
         *       spriteSheetImg.src = 'http://test.annie2x.com/biglong/apiDemo/annieBitmap/resource/sheet.jpg';
         */
        public static convertToImage(bitmap: annie.Bitmap,isNeedImage:boolean=true): any {
            if (!bitmap.rect) {
                return bitmap.bitmapData;
            } else {
                let _canvas = window.document.createElement("canvas");
                let w: number = bitmap.rect.width;
                let h: number = bitmap.rect.height;
                _canvas.width = w;
                _canvas.height = h;
                // _canvas.style.width = w / devicePixelRatio + "px";
                // _canvas.style.height = h / devicePixelRatio + "px";
                let ctx = _canvas.getContext("2d");
                let tr = bitmap.rect;
                ctx.drawImage(bitmap.bitmapData, tr.x, tr.y, w, h, 0, 0, w, h);
                if(isNeedImage){
                    var img=new Image();
                    img.src=_canvas.toDataURL();
                    return img;
                }else {
                    return _canvas;
                }
            }
        }
        /**
         * 重写hitTestPoint
         * @method  hitTestPoint
         * @param {annie.Point} globalPoint
         * @param {boolean} isMouseEvent
         * @return {any}
         * @public
         * @since 1.0.0
         */
        public hitTestPoint(globalPoint: Point, isMouseEvent: boolean = false): DisplayObject {
            let s = this;
            if (isMouseEvent && !s.mouseEnable)return null;
            let p = s.globalToLocal(globalPoint);
            p.x += s._offsetX;
            p.y += s._offsetY;
            if (s.getBounds().isPointIn(p)) {
                if (s.hitTestWidthPixel) {
                    let image = s._texture;
                    if (!image || image.width == 0 || image.height == 0) {
                        return null;
                    }
                    let _canvas = DisplayObject["_canvas"];
                    _canvas.width = 1;
                    _canvas.height = 1;
                    let ctx = _canvas["getContext"]('2d');
                    ctx.clearRect(0, 0, 1, 1);
                    if(s.rect){
                        p.x+=s.rect.x;
                        p.y+=s.rect.y;
                    }
                    ctx.setTransform(1, 0, 0, 1, -p.x, -p.y);
                    ctx.drawImage(image, 0, 0);
                    if (ctx.getImageData(0, 0, 1, 1).data[3] > 0) {
                        return s;
                    }
                }else {
                    return s;
                }
            }
            return null;
        }
        public destroy():void {
            //清除相应的数据引用
            let s = this;
            s._bitmapData=null;
            s._realCacheImg=null;
            s.rect=null;
            super.destroy();
        }
    }
}