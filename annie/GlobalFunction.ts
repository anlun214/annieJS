/**
 * @class 全局
 */
import Stage = annie.Stage;
/**
 * 往控制台打印调试信息
 * @method trace
 * @param {Object} arg 任何个数,任意类型的参数
 * @since 1.0.0
 * @public
 * @static
 * @example trace(1);trace(1,"hello");
 */
var trace = function (...arg:any[]) {
    for (var i in arguments) {
        console.log(arguments[i]);
    }
};
/**
 * 全局事件触发器
 * @static
 * @property  globalDispatcher
 * @type {annie.EventDispatcher}
 * @public
 * @since 1.0.0
 */
var globalDispatcher:annie.EventDispatcher=new annie.EventDispatcher();
//禁止页面滑动
document.ontouchmove = function(e){
    if(!annie.canHTMLTouchMove) {
        e.preventDefault();
    }
};
import Flash2x=annie.RESManager;
import F2xContainer=annie.Sprite;
import F2xMovieClip=annie.MovieClip;
import F2xText=annie.TextField;
import F2xInputText=annie.InputText;
import F2xBitmap=annie.Bitmap;
import F2xShape=annie.Shape;
Stage["addUpdateObj"](annie.Tween);
Stage["flushAll"]();
