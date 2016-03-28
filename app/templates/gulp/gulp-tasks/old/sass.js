var fs              = require('fs');
var cfg             = JSON.parse(fs.readFileSync('./config.json'));
var paths           = JSON.parse(fs.readFileSync('./paths.json'));
var gulp            = require('gulp');
var plumber         = require('gulp-plumber');
var concat          = require('gulp-concat');
var sourcemaps      = require('gulp-sourcemaps');
var rename          = require('gulp-rename');

var sass            = require('gulp-sass');
var sassGlob        = require('gulp-sass-glob');


<% if(postCssOption){ %>// postprocessing<% } %><% if(postCssOption){ %>
var postcss         = require('gulp-postcss');<% } %><% if(autoprefixerOption){ %>
var autoprefixer    = require('autoprefixer');<% } %><% if(mqpackerOption){ %>
var mqPacker        = require('css-mqpacker');<% } %><% if(scopifyOption){ %>
var scopify         = require('postcss-scopify');<% } %><% if(includePcssSelectorNot){ %>
var selectorNot     = require('postcss-selector-not');<% } %><% if(includePcssSelectorMatches){ %>
var selectorMatches = require('postcss-selector-matches');<% } %><% if(classprefixOption){ %>
var classPrfx       = require('postcss-class-prefix');<% } %><% if(gradientfixOption){ %>
var gradientFix     = require('postcss-gradient-transparency-fix');<% } %><% if(mqkeyframesOption){ %>
var mqKeyframes     = require('postcss-mq-keyframes');<% } %><% if(cssnanoOption){ %>
var cssnano         = require('cssnano');<% } %><% if(includePcssSort){ %>
var sort            = require('postcss-sort');<% } %>

<% if(postCssOption){ %>var postCssConfigDev = [<% } %><% if(includePcssSelectorNot){ %>
  selectorNot,<% } %><% if(includePcssSelectorMatches){ %>
  selectorMatches,<% } %><% if(gradientfixOption){ %>
  gradientFix,<% } %><% if(classprefixOption){ %>
  classPrfx(cfg.prefix),<% } %><% if(scopifyOption){ %>
  scopify(cfg.scope),<% } %><% if(autoprefixerOption){ %>
  autoprefixer({browsers: ['last 3 versions', '> 1%']}),<% } %><% if(includePcssSort){ %>
  sort<% } %><% if(postCssOption){ %>
];<% } %>

<% if(postCssOption){ %>var postCssConfigBuild = [<% } %><% if(includePcssSelectorNot){ %>
  selectorNot,<% } %><% if(includePcssSelectorMatches){ %>
  selectorMatches,<% } %><% if(gradientfixOption){ %>
  gradientFix,<% } %><% if(classprefixOption){ %>
  classPrfx(cfg.prefix),<% } %><% if(scopifyOption){ %>
  scopify(cfg.scope),<% } %><% if(mqkeyframesOption){ %>
  mqKeyframes,<% } %><% if(mqpackerOption){ %>
  mqPacker,<% } %><% if(autoprefixerOption){ %>
  autoprefixer({browsers: ['last 3 versions', '> 1%']}),<% } %><% if(includePcssSort){ %>
  sort,<% } %><% if(cssnanoOption){ %>
  cssnano({autoprefixer: false, zindex: false}),<% } %><% if(postCssOption){ %>
];<% } %>



// Styles Dev
gulp.task('styles', function() {
  gulp.src(paths.styles.src)
    .pipe(sassGlob())
    .pipe(plumber(onStyleError))
    .pipe(sourcemaps.init())
    .pipe(sass())<% if(postCssOption){ %>
    .pipe(postcss(postCssConfigDev))<% } %>
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.styles.build));
});

// Styles Build
gulp.task('styles-build', function() {
  gulp.src(paths.styles.src)
    .pipe(sassGlob())
    .pipe(plumber(onStyleError))
    .pipe(sass(<% if(!cssnanoOption){ %>{outputStyle: 'compressed'}<% } %>))<% if(postCssOption){ %>
    .pipe(postcss(postCssConfigBuild))<% } %>
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(paths.styles.build));
});




function onStyleError(e) {
  console.log('CSS Error:', e.message, 'lineNumber:', e.lineNumber);
}
