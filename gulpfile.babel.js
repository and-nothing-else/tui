import gulp from 'gulp'
import gutil from 'gulp-util'
import livereload from 'gulp-livereload'
import server from 'gulp-express'

import jade from 'gulp-jade'

import sass from 'gulp-ruby-sass'
import autoprefixer from 'gulp-autoprefixer'
import sourcemaps from 'gulp-sourcemaps'
import minifyCSS from 'gulp-minify-css'
import inline_base64 from 'gulp-inline-base64'

import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import browserify from 'browserify'
import babelify from 'babelify'
import uglify from 'gulp-uglify'


const
    dirs = {
        npm: './node_modules',
        src: './src',
        src_images: './src/images',
        dest: './dist'
    },
    files = {
        vendor: {
        },
        source: {
            templates: `${dirs.src}/*.jade`,
            script: `${dirs.src}/scripts/script.js`,
            style: `${dirs.src}/sass/style.sass`
        },
        dest: {
            vendor: `${dirs.dest}/vendor`,
            scripts: `${dirs.dest}/scripts`,
            images: `${dirs.dest}/images`,
            styles: `${dirs.dest}/styles`
        }
    },
    production = gutil.env.type === 'production';


gulp.task('server', function() {
    server.run(['server.js']);
});

gulp.task('clean', () => {
    for(let i of Object.keys(files.dest)){
        gulp.src(files.dest[i], {read: false}).pipe(clean());
    }
});


gulp.task('copy', () => {
    gulp.src(`${dirs.src_images}/**/*.*`)
        .pipe(gulp.dest(files.dest.images))
        .pipe(production ? gutil.noop() : livereload());
});

gulp.task('jade', () => {
    gulp.src(files.source.templates)
        .pipe(jade())
        .pipe(gulp.dest(dirs.dest))
        .pipe(production ? gutil.noop() : livereload());
});

gulp.task('sass', () => {
    return sass(files.source.style, {sourcemap: !production})
        .on('error', sass.logError)
        .pipe(inline_base64({
            baseDir: files.source.style_dir,
            maxSize: 320 * 320,
            debug: !production
        }))
        .pipe(autoprefixer({
            browsers: ['> 5%', 'last 2 versions', 'IE 8'],
            cascade: !production
        }))
        .pipe(production ? minifyCSS({compatibility: 'ie8'}) : gutil.noop())
        .pipe(production ? gutil.noop() : sourcemaps.write())
        .pipe(gulp.dest(files.dest.styles))
        .pipe(production ? gutil.noop() : livereload());
});

gulp.task('compile', () => {
    return browserify(
        {
            entries: files.source.script,
            debug: !production,
            transform: [babelify.configure({
                'presets': ['es2015']
            })]
        }
    )
        .bundle()
        .pipe(source('script.js'))
        .pipe(buffer())
        .pipe(production ? uglify() : gutil.noop())
        .pipe(gulp.dest(files.dest.scripts))
        .pipe(production ? gutil.noop() : livereload());
});


gulp.task('watch', () => {
    livereload.listen(35729, (err) => {
        if (err) {
            return console.log(err);
        }
        gulp.watch(`${dirs.src_images}/**/*.*`, ['copy']);
        gulp.watch(`${dirs.src}/*.jade`, ['jade']);
        gulp.watch(`${dirs.src}/**/*.{js,jsx}`, ['compile']);
        gulp.watch(`${dirs.src}/**/*.{sass,scss}`, ['sass']);
    });
    livereload();
});


let task_pool = ['copy', 'jade', 'sass', 'compile'];
if(gutil.env.type !== 'production') {
    task_pool.push('watch');
}


gulp.task('default', task_pool);
