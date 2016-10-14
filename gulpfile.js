/**
 * Created by anlun on 16/6/14.
 */
var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var coreList =[
    "annie/events/EventDispatcher.ts",
    "annie/events/Event.ts",
    "annie/events/MouseEvent.ts",
    "annie/geom/Point.ts",
    "annie/geom/Matrix.ts",
    "annie/geom/Rectangle.ts",
    "annie/display/DisplayObject.ts",
    "annie/display/bitmap.ts",
    "annie/display/Shape.ts",
    "annie/display/Sprite.ts",
    "annie/media/Media.ts",
    "annie/media/Sound.ts",
    "annie/media/Video.ts",
    "annie/media/ImageFrames.ts",
    "annie/display/MovieClip.ts",
    "annie/display/FloatDisplay.ts",
    "annie/display/VideoPlayer.ts",
    "annie/display/TextField.ts",
    "annie/display/InputText.ts",
    "annie/display/Stage.ts",
    "annie/filters/Filters.ts",
    "annie/render/IRender.ts",
    "annie/render/CanvasRender.ts",
    "annie/net/URLLoader.ts",
    "annie/utils/RESManager.ts",
    "annie/utils/Tween.ts",
    "annie/Annie.ts",
    "annie/GlobalFunction.ts"
];
var uiList=[
    "build/annieCore.d.ts",
    "annie/ui/scrollPage.ts",
    "annie/ui/FacePhoto.ts"
];
var onBuildCore = function(){
    var op = {
        noImplicitAny: true,
        declaration: true,
        out: "annieCore.js"
    };
    var outDir = "build";
    var tsResult = gulp.src(coreList).pipe(ts(op));
        tsResult.dts.pipe(gulp.dest(outDir));
        tsResult.js.pipe(gulp.dest(outDir)).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(gulp.dest(outDir));
};
var onBuildUI = function(){
    var op = {
        noImplicitAny: true,
        declaration: true,
        out: "annieUI.js"
    };
    var outDir = "build";
    var tsResult = gulp.src(uiList).pipe(ts(op));
        tsResult.dts.pipe(gulp.dest(outDir));
        tsResult.js.pipe(gulp.dest(outDir)).pipe(uglify()).pipe(rename({ extname: '.min.js' })).pipe(gulp.dest(outDir));
};
var onBuildDoc = function (){
    del([
        'libs'
    ]);
    var op = {
        noImplicitAny: true,
        declaration: true
    };
    var outDir = "libs";
    var tsResult = gulp.src(coreList.concat(uiList.slice(1))).pipe(ts(op));
        tsResult.js.pipe(gulp.dest(outDir));
};
gulp.task('onBuildCore', onBuildCore);
gulp.task('onBuildUI', onBuildUI);
gulp.task("onBuildDoc", onBuildDoc);
gulp.task('onBuildAll',['onBuildCore','onBuildUI']);