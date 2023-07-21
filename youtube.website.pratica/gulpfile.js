// Initialize modules
let {src, dest, watch, series} = require('gulp')
let sass = require('gulp-sass')(require('sass'))
let postcss = require('gulp-postcss')
let autoprefixer = require('autoprefixer')
let cssnano = require('cssnano')
let babel = require('gulp-babel')
let terser = require('gulp-terser')
const browsersync = require('browser-sync').create()

// Use dart-sass for @use
//sass.compiler = require('dart-sass')

// Sass Task
function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: true})
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.'}))
}

// Javascript Task
function jsTask() {
    return src('app/js/script.js', { sourcemaps: true})
    .pipe(babel({ presets: ['@babel/preset-env']}))
    .pipe(terser())
    .pipe(dest('dest', { sourcemaps: '.'}))
}

// Browsersync
function browserSyncServe(cb) {
    browsersync.unit({
        server: {
            baseDir: '.',
        },
        notify: {
            style: {
                top: 'auto',
                bottom: '0',
            },
        },
    })
    cb()
}
function browserSyncReLoad(cb) {
    browsersync.reload()
    cb()
}

// Watch Task
function watchTask() {
    watch('*.html', browserSyncReLoad)
    watch(
        ['app/scss/**/*.scss', 'app/**/*.js'],
        series(scssTask, jsTask, browserSyncReLoad)
    )
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask)