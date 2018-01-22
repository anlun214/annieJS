/**
 * @module annie
 */
namespace annie {
    /**
     * 将video的内容或者是序列图画到canvas里形成连续播放的效果,以方便做交互
     * @class annie.VideoPlayer
     * @extends annie.Bitmap
     * @public
     * @since 1.0.0
     */
    export class VideoPlayer extends Bitmap{
        /**
         * @method VideoPlayer
         * @param {string} src
         * @param {number} type 视频类型 值为0则会自动检测android下用序列图,其他系统下支持mp4的用mp4,不支持mp4的用序列图,值为1时全部使用序列图,值为2时全部使用mp4
         * @param {number} width
         * @param {number} height
         */
        public constructor(src:any,type:number,width:number,height:number){
            super();
            let s=this;
            s._instanceType="annie.VideoPlayer";
            let isUseVideo:any=true;
            if(type==0){
                if(annie.osType=="android"){
                    isUseVideo=false;
                }else{
                    //检测是否支持mp4,如果不支持,也将用序列
                    let testVideo=document.createElement("video");
                    isUseVideo=testVideo.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')=="probably";
                }
            }else if(type==1){
                isUseVideo=false;
            }
            if(isUseVideo){
                s.video=new Video(src+".mp4",1,1);
            }else{
                s.video=new ImageFrames(src);
            }
            s.videoType=isUseVideo?1:0;
            s._bounds.width=width;
            s._bounds.height=height;
        }
        /**
         * 视频的引用
         * @property video
         * @public
         * @since 1.0.0
         */
        public video:any=null;
        /**
         * 播放的视频类型 值为0是序列图,1是视频 只读
         * @property videoType
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public videoType:number=0;
        /**
         * 重写update
         * @method update
         * @public
         * @since 1.0.0
         */
        public update(isDrawUpdate:boolean=false){
            let  s=this;
            if(s._visible) {
                //刷新视频
                if (s.videoType == 0) {
                    s.video.update(isDrawUpdate);
                    s.rect = this.video.rect;
                    s["_texture"] = s.bitmapData = s.video.currentBitmap;
                } else {
                    s["_texture"] = s.bitmapData = s.video.media;
                }
                super.update(isDrawUpdate);
            }
        }
    }
}