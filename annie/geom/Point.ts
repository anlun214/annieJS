/**
 * @module annie
 */
namespace annie {
    /**
     * @class annie.Point
     * @extends annie.AObject
     * @since 1.0.0
     * @public
     */
    export class Point extends annie.AObject {
        constructor(x:number=0, y:number=0) {
            super();
            var s = this;
            s.x = x;
            s.y = y;
        }
        /**
         * @property x
         * @public
         * @since 1.0.0
         * @type{number}
         */
        public x:number=0;
        /**
         * @property y
         * @since 1.0.0
         * @public
         * @type {number}
         */
        public y:number=0;

        /**
         * 求两点之间的距离
         * @method distance
         * @static
         * @param p1
         * @param p2
         * @returns {number}
         */
        public static distance(p1:Point,p2:Point):number{
            return Math.sqrt( p1.x*p1.x*+p1.y*p2.y);
        }

    }
}