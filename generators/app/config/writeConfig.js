'use strict';
var fs              = require('fs'),
    jsonfile        = require('jsonfile'),
    createJson      = require('../helpers/createJson'),
    hasFeature      = require('../helpers/hasFeature'),
    fileExists      = require('../helpers/fileExists');

var writeConfig = function (configFile, self) {
  var configJson;

  if(fileExists(configFile, function(result){
    if ( result ){
      configJson = jsonfile.readFileSync(configFile);
      createConfig(self, configJson, function(configJson){
        createJson(configFile, configJson);
      });
    } else {
      configJson = {};
      createConfig(self, configJson, function(configJson){
        createJson(configFile, configJson);
      });
    }
  }));


  function createConfig(self, configJson, cb){

    configJson['projectURL'] = self.projectUrl;

    configJson['browsersync'] = {};

    if(self.environmentOption === 'static') {
      if(self.gulpDirOption){
        configJson['browsersync']['server'] = '../' + self.mainDir;
      } else {
        configJson['browsersync']['server'] = './' + self.mainDir;
      }
    }

    if(self.environmentOption === 'express') {
      configJson['browsersync']['proxy'] = 'http://localhost:3000';
      configJson['browsersync']['port'] = 4000;

      configJson['browsersync']['nodemon'] = {}

      if(self.gulpDirOption){
        configJson['browsersync']['nodemon']['script'] =  '../' + self.mainDir + '/bin/www';
        configJson['browsersync']['nodemon']['watch'] = ['../' + self.mainDir + '/app.js'];
      } else {
        configJson['browsersync']['nodemon']['script'] =  './' + self.mainDir + '/bin/www';
        configJson['browsersync']['nodemon']['watch'] = ['./' + self.mainDir + '/app.js'];
      }

    }

    if(self.postcssScopifyOption) {
      configJson['scope'] = '#scope';
    }

    if(self.postcssClassprefixOption) {
      configJson['prefix'] = 'prfx-';
    }

    configJson['styles'] = {}
    switch(self.preproOption){
      case 'scss':
        configJson['styles']['src'] = self.rootFolder + 'src/scss/style.scss';
        configJson['styles']['src_files'] = self.rootFolder + 'src/scss/**/*.scss';
      break;

      case 'stylus':
        configJson['styles']['src'] = self.rootFolder + 'src/stylus/style.styl';
        configJson['styles']['src_files'] = self.rootFolder + 'src/stylus/**/*.styl';
      break;

      case 'less':
        configJson['styles']['src'] = self.rootFolder + 'src/less/style.less';
        configJson['styles']['src_files'] = self.rootFolder + 'src/less/**/*.less';
      break;
    }
    configJson['styles']['build_srcsmap'] = self.rootFolder + self.templateDest + '/' + self.cssDirPath + '/';
    configJson['styles']['build'] = self.rootFolder + self.templateDest + '/' + self.cssDirPath + '/';
    configJson['styles']['src_lib'] = self.rootFolder + self.templateDest + '/' + self.cssDirPath + '/**/*.css';
    configJson['styles']['build_lib'] = self.rootFolder + self.templateDest + '/' + self.cssDirPath + '/';

    if(self.postcssScopifyOption) configJson['scope'] = '#scope';
    if(self.postcssClassprefixOption) configJson['prefix'] = 'prfx-';
    if(self.postcssAutoprefixerOption || self.postcssCssNextOption) configJson['browsers'] = 'last 3 versions, > 1%';
    if(self.postcssCssSorterOption) configJson['cssSortOrder'] = 'smacss';
    configJson['postcss'] = {};
    configJson['postcss']['src'] = self.rootFolder + self.templateDest + '/' + self.cssDirPath + '/style.css';
    configJson['postcss']['build'] = self.rootFolder + self.templateDest + '/' + self.cssDirPath + '/';


    configJson['images'] = {};
    configJson['images']['src'] = self.rootFolder + 'src/img/**/*';
    configJson['images']['build'] = self.rootFolder + self.templateDest + '/' + self.imgDirPath + '/';

    if(self.environmentOption === 'static') {
      configJson['html'] = {};
      configJson['html']['src'] = self.rootFolder + self.templateDest + '/**/*.html';
      configJson['html']['build'] = self.rootFolder + self.templateDest + '/';
    }

    if(self.templateOption === 'jade' && self.environmentOption === 'static') {
      configJson['jade'] = {};
      configJson['jade']['src'] = self.rootFolder + 'src/jade/*.jade';
      configJson['jade']['watch'] = self.rootFolder + 'src/jade/**/*.jade';
      configJson['jade']['build'] = self.rootFolder + self.templateDest + '/';
    }

    if(self.templateOption === 'pug' && self.environmentOption === 'static') {
      configJson['pug'] = {};
      configJson['pug']['src'] = self.rootFolder + 'src/pug/*.pug';
      configJson['pug']['watch'] = self.rootFolder + 'src/pug/**/*.pug';
      configJson['pug']['build'] = self.rootFolder + self.templateDest + '/';
    }


    if(self.templateOption === 'nunjucks' && self.environmentOption === 'static') {
      configJson['nunjucks'] = {};
      configJson['nunjucks']['src'] = self.rootFolder + 'src/nunjucks/pages/**/*.html';
      configJson['nunjucks']['watch'] = self.rootFolder + 'src/nunjucks/**/*.html';
      configJson['nunjucks']['templates'] = self.rootFolder + 'src/nunjucks/';
      configJson['nunjucks']['build'] = self.rootFolder + self.templateDest + '/';
    }

    if(!configJson['tasks']) {
      configJson['tasks'] = {}
    }
    if(!configJson['tasks']['main']) {
      configJson['tasks']['main'] = []
    }
    if(!configJson['tasks']['default']) {
      configJson['tasks']['default'] = []
    }
    if(!configJson['tasks']['build']) {
      configJson['tasks']['build'] = []
    }

    configJson['tasks']['main'] = ['images', 'scripts', 'styles'];
    configJson['tasks']['default'] = ['main', 'watch'];
    configJson['tasks']['build'] = ['main', 'scripts-build', 'styles-build', 'removeDevFiles'];


    if(self.environmentOption === 'static') {
      if (!hasFeature('html', configJson['tasks']['main'])){
        configJson['tasks']['main'].splice(0, 0, 'html');
      }

      if (!hasFeature('html-build', configJson['tasks']['build'])){
        configJson['tasks']['build'].splice(1, 0, 'html-build');
      }

    }

    if(self.environmentOption === 'static' || self.environmentOption === 'express') {
      if (!hasFeature('browser-sync', configJson['tasks']['default'])){
        configJson['tasks']['default'].splice(2, 0, 'browser-sync');
      }
    }

    if (self.modernizrOption && !hasFeature('modernizr', configJson['tasks']['build'])){
      configJson['tasks']['build'].splice(1, 0, 'modernizr');
    }


    if(self.modernizrOption) {
      configJson['modernizr'] = {};
      configJson['modernizr']['output'] = 'modernizr-custom.js';
      configJson['modernizr']['build'] = self.rootFolder + self.templateDest + '/' + self.jsLibDirPath;
      configJson['modernizr']['excludeTests'] = [];
      configJson['modernizr']['tests'] = [];
      configJson['modernizr']['options'] = ['setClasses', 'addTest', 'testProp', 'fnBind'];
    }


    configJson['scripts'] = {}
    configJson['scripts']['src'] = self.rootFolder + 'src/js/**/*.js'
    configJson['scripts']['build'] = self.rootFolder + self.templateDest + '/' + self.jsDirPath;
    configJson['scripts']['src_lib'] = self.rootFolder + self.templateDest + '/' + self.jsLibDirPath + '/**/*.js';
    configJson['scripts']['build_lib'] = self.rootFolder + self.templateDest + '/' + self.jsLibDirPath + '/';

    switch(self.cfg.javascriptOption) {
      case 'vanilla':
        configJson['scripts']['src'] = self.rootFolder + 'src/js/**/*.js';
      break;

      case 'coffee':
        configJson['scripts']['src'] = self.rootFolder + 'coffee/js/**/*.coffee';
      break;
    }


    configJson['iconFont'] = {};
    configJson['iconFont']['name'] = self.customIconFontName;
    configJson['iconFont']['types'] = ['ttf', 'eot', 'woff', 'woff2', 'svg'];

    configJson['font'] = {};
    configJson['font']['src'] = self.rootFolder + 'src/iconfont/svg/*.svg';
    configJson['font']['build'] = self.rootFolder + self.templateDest  + '/' + self.fontDirPath + '/';
    configJson['font']['templateInput'] = '';
    configJson['font']['templateOutput'] = '';
    configJson['font']['templateFontpath'] = '../fonts/';

    switch(self.preproOption) {
      case 'sass':
        configJson['font']['templateInput'] = self.rootFolder + 'src/iconfont/template/_icons.scss';
        configJson['font']['templateOutput'] = self.fontStyleOutputBase + 'src/scss/modules/_icons.scss';
      break;

      case 'stylus':
        configJson['font']['templateInput'] = self.rootFolder + 'src/iconfont/template/icons.styl';
        configJson['font']['templateOutput'] = self.fontStyleOutputBase + 'src/stylus/modules/icons.styl';
      break;

      case 'less':
        configJson['font']['templateInput'] = self.rootFolder + 'src/iconfont/template/icons.less';
        configJson['font']['templateOutput'] = self.fontStyleOutputBase + 'src/less/modules/icons.less';
      break;
    }

    cb(configJson);
  }

}

module.exports = writeConfig;
