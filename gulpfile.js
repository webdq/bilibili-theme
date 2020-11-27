const gulp = require("gulp");
const clean = require("gulp-clean");
const less = require("gulp-less");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();

let pageTask = {
  taskList: [],
  taskSeries: [],
};
let pageUrlMap = {
  home: [
    /^https?:\/\/www\.bilibili\.com$/,
    /^https?:\/\/www\.bilibili\.com\/$/,
    /^https?:\/\/www\.bilibili\.com\/\?spm_id_from=./,
  ],
  account: [
    /^https?:\/\/account\.bilibili\.com/,
    /^https?:\/\/passport\.bilibili\.com/,
  ],
  pay: [/^https?:\/\/pay\.bilibili\.com/],
  history: [/^https?:\/\/www\.bilibili\.com\/account\/history/],
  message: [/^https?:\/\/message\.bilibili\.com/],
  ranking: [/^https?:\/\/www\.bilibili\.com\/v\/popular/],
  search: [/^https?:\/\/search\.bilibili\.com/],
  space: [/^https?:\/\/space\.bilibili\.com/],
  video: [
    /^https?:\/\/www\.bilibili\.com\/video/,
    /^https?:\/\/www\.bilibili\.com\/bangumi\/play/,
  ],
  douga: [/^https?:\/\/www\.bilibili\.com(\/v)?\/douga/],
  music: [/^https?:\/\/www\.bilibili\.com(\/v)?\/music/],
  audio: [/^https?:\/\/www\.bilibili\.com(\/v)?\/audio/],
  rap: [/^https?:\/\/www\.bilibili\.com(\/v)?\/rap/],
  dance: [/^https?:\/\/www\.bilibili\.com(\/v)?\/dance/],
  technology: [/^https?:\/\/www\.bilibili\.com(\/v)?\/technology/],
  life: [/^https?:\/\/www\.bilibili\.com(\/v)?\/life/],
  fashion: [/^https?:\/\/www\.bilibili\.com(\/v)?\/fashion/],
  ent: [/^https?:\/\/www\.bilibili\.com(\/v)?\/ent/],
  cinema: [/^https?:\/\/www\.bilibili\.com(\/v)?\/cinema/],
  documentary: [/^https?:\/\/www\.bilibili\.com(\/v)?\/documentary/],
  movie: [
    /^https?:\/\/www\.bilibili\.com(\/v)?\/movie/,
    /^https?:\/\/www\.bilibili\.com(\/v)?\/blackboard/,
  ],
  tv: [/^https?:\/\/www\.bilibili\.com(\/v)?\/tv/],
  variety: [/^https?:\/\/www\.bilibili\.com(\/v)?\/variety/],
  anime: [/^https?:\/\/www\.bilibili\.com(\/v)?\/anime/],
  guochuang: [/^https?:\/\/www\.bilibili\.com(\/v)?\/guochuang/],
  game: [/^https?:\/\/www\.bilibili\.com(\/v)?\/game/],
  digital: [/^https?:\/\/www\.bilibili\.com(\/v)?\/digital/],
  kichiku: [/^https?:\/\/www\.bilibili\.com(\/v)?\/kichiku/],
  information: [/^https?:\/\/www\.bilibili\.com(\/v)?\/information/],
  cinephile: [/^https?:\/\/www\.bilibili\.com(\/v)?\/cinephile/],
  food: [/^https?:\/\/www\.bilibili\.com(\/v)?\/food/],
  read: [/^https?:\/\/www\.bilibili\.com\/read/],
  cheese: [/^https?:\/\/www\.bilibili\.com\/cheese/],
  dynamicModal: [/^https?:\/\/t\.bilibili\.com\/pages\/nav\/index_new/],
  gameModal: [/^https?:\/\/www\.bilibili\.com\/page-proxy\/game-nav\.html/],
  liveModal: [
    /^https?:\/\/live\.bilibili\.com\/blackboard\/dropdown-menu\.html/,
  ],
  mangaModal: [
    /^https?:\/\/manga\.bilibili\.com\/eden\/bilibili-nav-panel\.html/,
  ],
};

Object.keys(pageUrlMap).forEach((item) => {
  let task = function() {
    return gulp
      .src([
        "src/css/common/*.less",
        "src/css/icon/*.less",
        "src/css/page/" + item + ".less",
      ])
      .pipe(less({ allowEmpty: true }))
      .pipe(concat(item + ".css"))
      .pipe(gulp.dest("dist/page"));
  };
  let watching = function() {
    return gulp.watch("src/css/page/" + item + ".less", gulp.series(task));
  };
  pageTask.taskList.push(task);
  pageTask.taskSeries.push(gulp.series(task, watching));
});

let watchCommonLess = function() {
  let watching = function() {
    return gulp.watch(
      ["src/variables.less", "src/css/common/*.less", "src/css/icon/*.less"],
      gulp.series(...pageTask.taskList)
    );
  };
  pageTask.taskSeries.push(gulp.series(watching));
};

let watchMozillaLess = function() {
  let task = function() {
    return gulp
      .src(["src/mozilla.less"])
      .pipe(less({ allowEmpty: true }))
      .pipe(gulp.dest("dist"));
  };
  let watching = function() {
    return gulp.watch(["src/**/*.less"], gulp.series(task));
  };
  pageTask.taskSeries.push(gulp.series(task, watching));
};

watchCommonLess();
watchMozillaLess();

function cleanDist() {
  return gulp.src("dist", { read: false }).pipe(clean());
}

function serve(cb) {
  browserSync.watch("dist/**/*.css").on("change", browserSync.reload);
  browserSync.init({
    port: 4444,
    files: "**",
    server: {
      baseDir: "./",
      index: "dist/page/home.css",
    },
    open: false,
  });
  cb();
}

exports.cleanDist = cleanDist;
exports.page = gulp.parallel(...pageTask.taskSeries);
exports.default = gulp.parallel(serve, ...pageTask.taskSeries);
