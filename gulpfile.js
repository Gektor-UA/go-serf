// *Створюємо дві константи, яким передаємо всі можливості плагіна gulp який ми встановили 
// *(у файлі package.json в графі "devDependencies" вказано "gulp": "^4.0.2" ну або інша версія)
const {src, dest, watch, parallel, series} = require('gulp');

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-sass та sass
const scss = require('gulp-sass')(require('sass'));

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-concat
// TODO Цей плагін потрібен для того, щоб з декількох файлів створити один або конкатинація файлів
// TODO Також цей плагін вміє переіменовувати готові файли
const concat = require('gulp-concat');

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-uglify-es
// TODO Цей плагін потрібен для того, щоб максиально зжимати файли js
const uglify = require('gulp-uglify-es').default;

// *Створюємо константу, якій передаємо всі можливості плагіна browser-sync
// TODO Цей плагін потрібен для того, автоматично оновлювати сторінку після зміни у файлах
const browserSync = require('browser-sync').create();

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-autoprefixer
// TODO Цей плагін потрібен для того, автоматично додавати префікси для старих версіій браузерів
const autoprefixer = require('gulp-autoprefixer');

// *Створюємо константу, якій передаємо всі можливості плагіна gulp-clean
// TODO Цей плагін потрібен для того, щоб видаляти вказані теки перед build
const clean = require('gulp-clean');

// *Функція для перекодування файла scss в файл css
// *Для запуску потрібно в терміналі написати gulp styles або автоматичне надаштування далі
function styles() {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
        .pipe(concat('style.min.css')) // Конкатинація всіх файлів та переіменування фінального
        .pipe(scss({outputStyle: 'compressed'})) // Перетворення файлу scss в css
        .pipe(dest('app/css')) // Збереження файлу в задану папку
        .pipe(browserSync.stream()) // Оновлюємо сторінку
}
exports.styles = styles;
// *---------------------------------------------------------------------------------------


// *Функція для зжимання файлів js
// *Для запуску потрібно в терміналі написати gulp scripts або автоматичне надаштування далі
function scripts() {
    return src([
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream()) // Оновлюємо сторінку
        
}
exports.scripts = scripts;
// *---------------------------------------------------------------------------------------


// *Функція для перекодування файла scss в файл css
// *Для запуску потрібно в терміналі написати gulp styles або автоматичне надаштування далі
function watching() {
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
}
exports.watching = watching;
// *---------------------------------------------------------------------------------------


// *Функція для автоматичного оновення сторінки після змін у файлах
function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}
exports.browsersync = browsersync;
// *---------------------------------------------------------------------------------------


// *Функція для видалення теки dist
function cleanDist() {
    return src('dist')
    .pipe(clean())
}
// *---------------------------------------------------------------------------------------


// *Функція для автоматичного відбору потрібних зжатих файлів та файлів html і збереження їх у вказане місце
function building() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html'
    ], {base: 'app'})
    .pipe(dest('dist'))
}
// *---------------------------------------------------------------------------------------


// *Запуск всіх функцій паралельно за допомогою плагіна gulp
exports.default = parallel(styles, scripts, browsersync, watching);
// *--------------------------------------------------------

// *Автоматичне видалення теки dits та аново її створення та збереження туди зжатих файлів
exports.build = series(cleanDist, building);
// *--------------------------------------------------------