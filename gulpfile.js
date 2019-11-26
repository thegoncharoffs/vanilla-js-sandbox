const {series, parallel, src, dest} = require('gulp'); // npm install --global gulp-cli
const gulp                          = require('gulp'); // npm install --save-dev gulp
const less                          = require('gulp-less'); // npm install gulp-less --save-dev
const browserSync                   = require('browser-sync').create(); // npm install browser-sync --save-dev
const svgstore                      = require('gulp-svgstore'); // npm install gulp-svgstore --save-dev
const svgmin                        = require('gulp-svgmin'); // npm install gulp-svgmin --save-dev
const inject                        = require('gulp-inject'); // npm install gulp-inject --save-dev
const path                          = require('path'); // installed with npm install gulp -g
const autoprefixer                  = require('gulp-autoprefixer'); // npm install --save-dev gulp-autoprefixer

gulp.task('svgstore', function () {
    const svgs = gulp
        .src('./assets/icons/**/*.svg')
        .pipe(svgmin(function (file) {
            const prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [
                    {
                        removeTitle: true
                    },
                    {
                        removeAttrs: {
                            attrs: "(fill|stroke)"
                        }
                    },
                    {
                        removeStyleElement: true
                    },
                    {
                        cleanupIDs: {
                            prefix: prefix,
                            minify: true
                        }
                    }
                ]
            }
        }))
        .pipe(svgstore({inlineSvg: true}));

    function fileContents(filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src('./index.html')
        .pipe(inject(svgs, {transform: fileContents}))
        .pipe(gulp.dest('./'));
});

gulp.task('less', function () {
    return src('./assets/styles/main.less')
        .pipe(less())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(dest('./'));
});

gulp.task('serve', function () {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("./assets/styles/**/*.less").on("change", series("less"));
    gulp.watch("./main.css").on("change", browserSync.reload);
    gulp.watch("./index.html").on("change", browserSync.reload);
});

gulp.task('default', series(parallel('less', 'svgstore'), 'serve'));
