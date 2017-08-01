import gulp from 'gulp'
import autoprefixer from 'gulp-autoprefixer'
import clean from 'gulp-clean-dest'
import minify from 'gulp-clean-css'
import rename from 'gulp-rename'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import uglify from 'gulp-uglify'

import path from 'path'
import browserSync from 'browser-sync'

import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'

import browserify from 'browserify'
import babelify from 'babelify'

const dirs = {
  src: 'src',
  dest: 'dist'
}

const config = {
  sass: {
    entry: 'index.scss',
    output: 'app.css',
    src: path.join(__dirname, dirs.src, 'scss'),
    dest: path.join(__dirname, dirs.dest, 'css')
  },
  js: {
    entry: 'index.js',
    output: 'app.js',
    src: path.join(__dirname, dirs.src, 'js'),
    dest: path.join(__dirname, dirs.dest, 'js')
  }
}

const server = browserSync.create()
const bundler = browserify({
  entries: path.join(config.js.src, config.js.entry),
  debug: true
})

gulp.task('js', () => {
  bundler.transform(babelify)

  return bundler.bundle()
    .on('error', () => {
      console.log('--> Bundling error')
    })
    .pipe(source(config.js.output))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify())
    .pipe(clean(config.js.dest))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.js.dest))
    .pipe(server.reload({
      stream: true
    }))
})

gulp.task('sass', () =>
  gulp.src(path.join(config.sass.src, config.sass.entry))
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename(config.sass.output))
    .pipe(minify())
    .pipe(clean(config.sass.dest))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.sass.dest))
    .pipe(server.reload({
      stream: true
    }))
)

gulp.task('sync', () => {
  server.init({
		notify: false,
		open: false,
    server: {
      baseDir: 'dist'
    }
  })
})

gulp.task('watch', [ 'sync', 'bundle' ], () => {
  gulp.watch(path.join(config.sass.src, '**/*.scss'), [ 'sass' ])
  gulp.watch(path.join(config.js.src, '**/*.js'), [ 'js' ])
  gulp.watch(path.join(dirs.dest, '**/*.html')).on('change', server.reload)
})

gulp.task('bundle', [ 'js', 'sass' ])

gulp.task('default', [ 'watch' ])
