"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var run = require("run-sequence");
var del = require("del");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var jpegoptim = require("imagemin-jpegoptim");
var webp = require("imagemin-webp");
var svgstore = require("gulp-svgstore");

var paths = {
    source: {
        root: "source",
        html: "source/**/*.html",
        sass: "source/sass/style.scss",
        css: "source/css",
        sassWatch: "source/sass/**/*.{scss,sass}",
        js: "source/js/**/*.js",
        fonts: "source/fonts/**/*.{woff,woff2}",
        img: "source/img/**/*",
        imgWebp: "source/img/**/*.{png,jpg}",
        imgWebpFolder: "source/img/webpgit",
        spritePattern: "source/img/icon-*.svg",
        picturefill: "node_modules/picturefill/dist/picturefill.js",
        svg4everybody: "node_modules/svg4everybody/dist/svg4everybody.js"
    },
    build: {
        root: "build",
        css: "build/css",
        js: "build/js",
        img: "build/img",
        fonts: "build/fonts"
    }
};

/*Удаление*/
gulp.task("clean:build", function() {
    console.log("Очистка папки build...");
    return del(paths.build.root);
});

/*Копирование шрифтов и изображений*/
gulp.task("copy:data", function() {
    console.log("Копирование данных в папку build...");
   return gulp.src([
     paths.source.html,
     paths.source.fonts,
     paths.source.img
    ], {
      base: "source"
    })
    .pipe(gulp.dest(paths.build.root));
});

/*Копирование HTML-страниц*/
gulp.task("copy:html", function() {
    console.log("Копирование HTML-страниц...");
    return gulp
        .src(paths.source.html)
        .pipe(gulp.dest(paths.build.root))
        .pipe(server.stream());
});

/*Оптимизация изображений*/
gulp.task("optimization:images", function() {
    console.log("Оптимизация изображений...");

    return gulp
        .src(paths.source.img)
        .pipe(
            imagemin([
                imagemin.optipng({ optimizationLevel: 3 }),

                jpegoptim({
                    max: 80,
                    progressive: true
                }),

                imagemin.svgo({
                    plugins: [
                        { removeViewBox: false },
                        { removeTitle: true },
                        {
                            cleanupNumericValues: { floatPrecision: 0 }
                        }
                    ]
                })
            ])
        )
        .pipe(gulp.dest(paths.build.img));
});

/*Создаем версии изображений в формате Webp*/
gulp.task("create:webp", function() {
    console.log("Конвертирование изображений в формат WebP...");
    return gulp
        .src(paths.source.imgWebp)
        .pipe(imagemin([webp({ quality: 90 })]))
        .pipe(rename({ extname: ".webp" }))
        .pipe(gulp.dest(paths.source.imgWebpFolder));
});

/*Создаем SVG-спрайт*/
gulp.task("create:svg-sprite", function() {
    console.log("Создание SVG спрайта...");

    return gulp
        .src(paths.source.spritePattern)
        .pipe(svgstore({inlineSvg: true}))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest(paths.build.img));
});

/*Сборка и минификация стилей SASS*/
gulp.task("style:sass", function() {
    console.log("Сборка и минификация стилей...");

    gulp.src(paths.source.sass)
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest(paths.build.css))
        .pipe(gulp.dest(paths.source.css))
        .pipe(minify({ restructure: false }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(paths.build.css))
        .pipe(gulp.dest(paths.source.css))
        .pipe(server.stream());
});

/*Сборка и минификация JS*/
gulp.task("script:js", function() {
    console.log("Сборка и минификация скриптов...");

    return gulp
        .src([
            paths.source.js,
            paths.source.picturefill,
            paths.source.svg4everybody
        ])
        .pipe(concat("script.js"))
        .pipe(gulp.dest(paths.build.js))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(paths.build.js))
        .pipe(server.stream());
});

/*Сервер проекта*/
gulp.task("serve", function() {
    server.init({
        server: paths.build.root,
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch(paths.source.sassWatch, ["style:sass"]);
    gulp.watch(paths.source.js, ["script:js"]);
    gulp.watch(paths.source.html, ["copy:html"]);
});

/*Сборка проекта: dev*/
gulp.task("dev", function (done) {
  run(
    "clean:build",
    "copy:data",
    "style:sass",
    "script:js",
    "create:svg-sprite",
    done
  );
});

/*Сборка проекта*/
gulp.task("build", function(done) {
  run(
    "clean:build",
    "optimization:images",
    "create:webp",
    "copy:data",
    "style:sass",
    "script:js",
    "create:svg-sprite",
    done
  );
});
