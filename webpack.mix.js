const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

 mix.js('resources/js/app.js', 'public/js')
    .react()
    .extract(['react'])
    .js('resources/js/scripts.js', 'public/js')
    .js('resources/js/stisla.js', 'public/js')
    .version()
    .postCss('resources/css/app.css', 'public/css', [])
    .postCss('resources/css/components.css', 'public/css', [])
    .postCss('resources/css/custom.css', 'public/css', [])
    .postCss('resources/css/style.css', 'public/css', [])
    ;

// mix.js('resources/js/app.js', 'public/js')
//     .postCss('resources/css/app.css', 'public/css', [
//         //
//     ]);
