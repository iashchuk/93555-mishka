"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var run = require("run-sequence");
var del = require("del");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var jpegoptim = require("imagemin-jpegoptim");
var webp = require("imagemin-webp");
var svgstore = require("gulp-svgstore");
var inject = require("gulp-inject");

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
    imgFolder: "source/img",
    imgWebp: "source/img/**/*.{png,jpg}",
    imgWebpFolder: "source/img/webp",
    spritePattern: "source/img/icon-*.svg",
    picturefill: "node_modules/picturefill/dist/picturefill.js",
    svg4everybody: "node_modules/svg4everybody/dist/svg4everybody.js"
  },
  build: {
    root: "build",
    css: "build/css",
    js: "build/js",
    img: "build/img",
    fonts: "build/fonts",
    html: "build/*.html"
  }
};

function fileContents(filePath, file) {
  return file.contents.toString();
}

/*Удаление*/
gulp.task("clean:build", function () {
  console.log("Очистка папки build...");
  return del(paths.build.root);
});

/*Копирование шрифтов и изображений*/
gulp.task("copy:data", function () {
  console.log("Копирование данных в папку build...");
  return gulp.src([
      paths.source.fonts,
      paths.source.img
    ], {
      base: "source"
    })
    .pipe(gulp.dest(paths.build.root));
});

/*Копирование HTML-страниц*/
gulp.task("copy:html", function () {
  console.log("Копирование HTML-страниц...");
  var sprite = gulp.src("build/img/sprite.svg");
  return gulp.src([
    "source/*.html"
  ], {
    base: "source"
  })
    .pipe(inject(sprite, {transform: fileContents}))
    .pipe(gulp.dest(paths.build.root))
});

/*Оптимизация изображений*/
gulp.task("optimization:images", function () {
  console.log("Оптимизация изображений...");

  return gulp
    .src(paths.source.img)
    .pipe(
      imagemin([
        imagemin.optipng({
          optimizationLevel: 3
        }),

        jpegoptim({
          max: 80,
          progressive: true
        }),

        imagemin.svgo({
          plugins: [{
              removeViewBox: false
            },
            {
              removeTitle: true
            },
            {
              cleanupNumericValues: {
                floatPrecision: 0
              }
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest(paths.build.img));
});

/*Создаем версии изображений в формате Webp*/
gulp.task("create:webp", function () {
  console.log("Конвертирование изображений в формат WebP...");
  return gulp
    .src(paths.source.imgWebp)
    .pipe(imagemin([webp({
      quality: 90
    })]))
    .pipe(rename({
      extname: ".webp"
    }))
    .pipe(gulp.dest(paths.source.imgWebpFolder));
});


/*Создаем SVG-спрайт*/
gulp.task("create:svg-sprite", function () {
  console.log("Создание SVG спрайта...");
  var svgs = gulp
    .src(paths.source.spritePattern)
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(paths.build.img));

    return gulp
      .src(paths.build.html)
      .pipe(inject(svgs, {transform: fileContents}))
      .pipe(gulp.dest(paths.build.root));
});

/*Сборка и минификация стилей SASS*/
gulp.task("style:sass", function () {
  console.log("Сборка и минификация стилей...");

  gulp.src(paths.source.sass)
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(paths.build.css))
    .pipe(gulp.dest(paths.source.css))
    .pipe(minify({
      restructure: false
    }))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(paths.build.css))
    .pipe(gulp.dest(paths.source.css))
    .pipe(server.stream());
});

/*Сборка и минификация JS*/
gulp.task("script:js", function () {
  console.log("Сборка и минификация скриптов...");

  return gulp
    .src(paths.source.js)
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(paths.build.js))
    .pipe(server.stream());
});

gulp.task("js", function () {
  return gulp.src("source/**/*.js")
    .pipe(gulp.dest("build"));
});


/*Сервер проекта*/
gulp.task("serve", function () {
  server.init({
    server: paths.build.root,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(paths.source.sassWatch, ["style:sass"]);
  gulp.watch(paths.source.js, ["script:js"]);
  gulp.watch(paths.source.html, ["copy:html"]).on('change', server.reload);
});

/*Сборка проекта: dev*/
gulp.task("dev", function (done) {
  run(
    "clean:build",
    "create:svg-sprite",
    "copy:data",
    "copy:html",
    "style:sass",
    "script:js",
    done
  );
});

/*Сборка проекта*/
gulp.task("build", function (done) {
  run(
    "clean:build",
    "optimization:images",
    "create:svg-sprite",
    "create:webp",
    "copy:data",
    "copy:html",
    "style:sass",
    "script:js",
    done
  );
});
