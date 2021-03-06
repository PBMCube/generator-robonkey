'use strict';
var path = require('path');

function setBaseConfigVars(self, cb){

  self.environmentOption = self.cfg.environmentOption;

  self.gulpDirOption = self.cfg.gulpDirOption;
  self.gulpCmdOption = self.cfg.gulpCmdOption;
  self.gulpTypeOption = self.cfg.gulpTypeOption;

  if(self.gulpDirOption) {
    self.cfg.rootFolder = '..';
    self.cfg.nodeModules = '../../gulp/node_modules/';
  } else {
    self.cfg.rootFolder = '.';
    self.cfg.nodeModules = '../../node_modules/';
  }

  self.nodeModules = self.cfg.nodeModules;

  self.rootFolder = self.cfg.rootFolder;
  self.mainDir = self.cfg.mainDir;

  cb();
}

module.exports = setBaseConfigVars;
