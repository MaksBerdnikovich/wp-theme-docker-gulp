import {src, dest, watch, series, parallel} from 'gulp';
import yargs from 'yargs';
import gulpSass from "gulp-sass";
import nodeSass from "node-sass";
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify-es';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import imagemin from 'gulp-imagemin';
import del from 'del';
import browserSync from "browser-sync";
import zip from "gulp-zip";
import info from "./package.json";
import replace from "gulp-replace";

const PRODUCTION = yargs.argv.prod;
const server = browserSync.create();
const sass = gulpSass(nodeSass);

export const serve = done => {
    server.init({
        proxy: "http://localhost:8000",
        notify: false,
        online: true
    });
    done();
};
export const reload = done => {
    server.reload();
    done();
};
export const clean = () => del(['dist']);

export const styles = () => {
    return src('src/scss/style.scss')
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
        .pipe(gulpif(PRODUCTION, cleanCss({compatibility: '*'})))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(dest('dist/css/'))
        .pipe(server.stream());
};

export const commonStyles = () => {
    return src([
    ])
        .pipe(concat('style.min.css'))
        .pipe(dest('dist/css/'));
};

export const scripts = () => {
    return src('src/js/scripts.js')
        .pipe(dest('dist/js'));
};

export const commonScripts = () => {
    return src([
    ])
        .pipe(concat('scripts.min.js'))
        .pipe(gulpif(PRODUCTION, uglify()))
        .pipe(dest('dist/js/'));
};

export const images = () => {
    return src('src/images/**/*.{jpg,jpeg,png,svg,gif,ico}')
        //.pipe(imagemin())
        .pipe(dest('dist/images'));
};

export const copy = () => {
    return src(['src/**/*', '!src/{images,js,scss}', '!src/{images,js,scss}/**/*'])
        .pipe(dest('dist'));
};

export const compress = () => {
    return src([
        "**/*",
        "!node_modules{,/**}",
        "!vendor{,/**}",
        "!bundled{,/**}",
        "!src{,/**}",
        "!.babelrc",
        "!.gitignore",
        "!gulpfile.babel.js",
        "!package.json",
        "!package-lock.json",
    ]).pipe(
        gulpif(
            file => file.relative.split(".").pop() !== "zip",
            replace("_themename", info.name)
        ))
        .pipe(zip(`${info.name}.zip`))
        .pipe(dest('bundled'));
};

export const watchForChanges = () => {
    watch('src/scss/**/*.scss', styles);
    watch('src/images/**/*.{jpg,jpeg,png,svg,gif,ico}', series(images, reload));
    watch(['src/**/*', '!src/{images,js,scss}', '!src/{images,js,scss}/**/*'], series(copy, reload));
    watch('src/js/**/*.js', series(scripts, reload));
    watch("**/*.html", reload);
    watch("**/*.php", reload);
};

export const dev = series(clean, parallel(styles, scripts, commonStyles, commonScripts, images, copy), serve, watchForChanges);
export const build = series(clean, parallel(styles, scripts, commonStyles, commonScripts, images, copy), compress);
export default dev
