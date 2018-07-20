/**
 * @module annie
 */
namespace annie {
    /**
     * 输入文本,此文本类是annie.FloatDisplay对象的典型代表
     * @class annie.InputText
     * @public
     * @since 1.0.0
     * @extends annie.FloatDisplay
     */
    export class InputText extends FloatDisplay {
        /**
         * 输入文本的类型.
         * @property inputType
         * @public
         * @since 1.0.0
         * @type {number} 0 input 1 password 2 mulit
         * @default 0
         */
        public inputType: number = 0;

        /**
         * 在手机端是否需要自动收回软键盘，在pc端此参数无效
         * @property isAutoDownKeyBoard
         * @type {boolean}
         * @since 1.0.3
         * @default true
         */
        public isAutoDownKeyBoard: boolean = true;
        /**
         * @property _inputTypeList
         * @static
         * @type {string[]}
         * @private
         * @since 2.0.0
         */
        private static _inputTypeList:Array<string>=["input","password","textarea"];
        /**
         * @method InputText
         * @public
         * @since 1.0.0
         * @param {number} inputType 0 input 1 password 2 multiline
         * @example
         *      var inputText=new annie.InputText('singleline');
         *      inputText.initInfo('annie',100,100,'#ffffff','left',14,'微软雅黑',false,2);
         */
        public constructor(inputType:number=0) {
            super();
            var input: any = null;
            let s: InputText = this;
            s._instanceType = "annie.InputText";
           if(inputType<2){
                input = document.createElement("input");
                input.type = InputText._inputTypeList[inputType];
            } else {
                input = document.createElement("textarea");
                input.style.resize = "none";
                input.style.overflow = "hidden";
            }
            s.inputType = inputType;
            var remove = function (){
                if (s.isAutoDownKeyBoard&&annie.osType!="pc") {
                    s.htmlElement && s.htmlElement.blur();
                }
            }.bind(s);
            s.addEventListener(Event.REMOVE_TO_STAGE, function (e: Event) {
                s.stage.removeEventListener(annie.MouseEvent.MOUSE_UP, remove);
            });
            s.addEventListener(Event.ADD_TO_STAGE, function (e: Event) {
                s.stage.addEventListener(annie.MouseEvent.MOUSE_UP, remove);
            });
            s.init(input);
        }

        /**
         * 初始化输入文本
         * @method init
         * @param htmlElement
         * @public
         * @return {void}
         * @since 1.0.0
         */
        public init(htmlElement: any): void {
            super.init(htmlElement);
            //默认设置
            let s = this;
            s.htmlElement.style.outline = "none";
            s.htmlElement.style.borderWidth = "thin";
            s.htmlElement.style.borderColor = "#000";
        }
        /**
         * 被始化输入文件的一些属性
         * @method initInfo
         * @public
         * @since 1.0.0
         * @param {string} text 默认文字
         * @param {string}color 文字颜色
         * @param {string}align 文字的对齐方式
         * @param {number}size  文字大小
         * @param {string}font  文字所使用的字体
         * @param {boolean}showBorder 是否需要显示边框
         * @param {number}lineSpacing 如果是多行,请设置行高
         */
        public initInfo(text: string,color: string, align: string, size: number, font: string, showBorder: boolean, lineSpacing: number): void {
            let s: InputText = this;
            s.htmlElement.placeholder = text;
            //font包括字体和大小
            s.htmlElement.style.font = size + "px " + font;
            s.htmlElement.style.color = color;
            s.htmlElement.style.textAlign = align;
            /////////////////////设置边框//////////////
            s.border = showBorder;
            //color:blue; text-align:center"
            if (s.inputType == 2) {
                s.htmlElement.style.lineHeight = lineSpacing + "px";
            }
        }

        /**
         * @property lineSpacing
         * @public
         * @since 2.0.0
         * @type {number}
         */
        public set lineSpacing(value:number){
            this.htmlElement.style.lineHeight = value + "px";
            this.htmlElement.style.height = value + "px";
        }
        public get lineSpacing():number{
            return parseInt(this.htmlElement.style.lineHeight);
        }
        /**
         * 设置文本是否为粗体
         * @property bold
         * @public
         * @type {boolean}
         * @since 1.0.3
         */
        public set bold(bold: boolean) {
            let ss = this.htmlElement.style;
            if (bold) {
                ss.fontWeight = "bold";
            } else {
                ss.fontWeight = "normal";
            }
        }

        public get bold(): boolean {
            return this.htmlElement.style.fontWeight == "bold";
        }

        /**
         * 设置文本是否倾斜
         * @property italic
         * @public
         * @type {boolean}
         * @since 1.0.3
         */
        public set italic(italic: boolean) {
            let s = this.htmlElement.style;
            if (italic) {
                s.fontStyle = "italic";
            } else {
                s.fontStyle = "normal";
            }
        }

        public get italic(): boolean {
            return this.htmlElement.style.fontStyle == "italic"
        }
        /**
         * 文本的行高
         * @property textHeight
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public set textHeight(value: number) {
            this.htmlElement.style.height = value+"px";
        }

        public get textHeight(): number {
            return parseInt(this.htmlElement.style.height);
        }
        /**
         * 文本的宽
         * @property textWidth
         * @public
         * @since 1.0.0
         * @type {number}
         * @default 0
         */
        public set textWidth(value: number) {
            this.htmlElement.style.width = value+"px";
        }

        public get textWidth(): number {
            return parseInt(this.htmlElement.style.width);
        }
        /**
         * 设置文本颜色
         * @property color
         * @type {string}
         * @public
         * @since 1.0.3
         */
        public set color(value: string) {
            var ss = this.htmlElement.style;
            ss.color = value;
        }

        public get color(): string {
            return this.htmlElement.style.color;
        }

        /**
         * 设置或获取是否有边框
         * @property property
         * @type {boolean}
         * @public
         * @since 1.0.3
         */
        public set border(show: boolean) {
            let s = this;
            if (show) {
                s.htmlElement.style.borderStyle = "inset";
                s.htmlElement.style.backgroundColor = "#fff";
            } else {
                s.htmlElement.style.borderStyle = "none";
                s.htmlElement.style.backgroundColor = "transparent";
            }
        }

        public get border(): boolean {
            return this.htmlElement.style.borderStyle != "none";
        }

        /**
         * 获取或设置输入文本的值
         * 之前的getText 和setText 已废弃
         * @property text
         * @public
         * @since 1.0.3
         * @type {string}
         */
        public get text(): string {
            let s = this;
            if (s.htmlElement) {
                return s.htmlElement.value;
            }
        }

        public set text(value: string) {
            let s = this;
            if (s.htmlElement) {
                s.htmlElement.value = value;
            }
        }

        /**
         * 输入文本的最大输入字数
         * @public
         * @since 1.1.0
         * @property maxCharacters
         * @type {number}
         */
        public get maxCharacters():number{
            let l:any=this.htmlElement.getAttribute("maxlength");
            if(l===null){
                return 0;
            }else{
                return l;
            }
        }
        public set maxCharacters(value:number){
            this.htmlElement.setAttribute("maxlength",value);
        }

    }
}