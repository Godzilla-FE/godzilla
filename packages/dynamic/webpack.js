'use strict';
const fs = require('fs');
const path = require('path');
const url = require('url');

function buildManifest(compiler, compilation) {
  let context = compiler.options.context;
  let manifest = {};

  compilation.chunks.forEach((chunk) => {
    chunk.files.forEach((file) => {
      for (const module of chunk.modulesIterable) {
        let id = module.id;
        let name = typeof module.libIdent === 'function' ? module.libIdent({ context }) : null;
        let publicPath = url.resolve(compilation.outputOptions.publicPath || '', file);

        let currentModule = module;
        if (module.constructor.name === 'ConcatenatedModule') {
          currentModule = module.rootModule;
        }
        if (!manifest[currentModule.rawRequest]) {
          manifest[currentModule.rawRequest] = [];
        }

        manifest[currentModule.rawRequest].push({ id, name, file, publicPath });
      }
    });
  });

  return manifest;
}

class DynamicLoadablePlugin {
  constructor(opts = {}) {
    this.filename = opts.filename;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('emit', (compilation, callback) => {
      const manifest = buildManifest(compiler, compilation);
      var json = JSON.stringify(manifest, null, 2);
      compilation.assets[this.filename] = {
        source: function() {
          return json;
        },
        size: function() {
          return json.length;
        },
      };
      callback();
    });
  }
}

function getBundles(manifest, moduleIds) {
  return moduleIds.reduce((bundles, moduleId) => {
    return bundles.concat(manifest[moduleId]);
  }, []);
}

exports.DynamicLoadablePlugin = DynamicLoadablePlugin;
exports.getBundles = getBundles;
