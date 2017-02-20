import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';

const dirs = {
    src: '.',
    dest: 'dist'
};

const conf = {
    js: {
        src: `${dirs.src}/index.js`,
        dest: `${dirs.dest}/index.transpiled.js`
    }
};

gulp.task('js', () => {
    return (
        browserify({
            entries: conf.js.src,
            extensions: ['js'],
            debug: true
        })
        .transform('babelify', {
            presets: ['es2015']
        })
        .bundle()
        .on('error', function(err) {
            console.log(`--> Error bundling: ${err}`);
            this.emit('end');
        })
        .pipe(source(conf.js.dest))
        .pipe(gulp.dest('.'))
    );
});

gulp.task('watch', ['bundle'], () => {
    gulp.watch(`*.js`, ['js']);
});

gulp.task('bundle', ['js']);

gulp.task('default', ['watch']);


















