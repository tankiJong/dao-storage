'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var webpack = require('webpack-stream');
var wp = require('webpack');

var $ = require('gulp-load-plugins')();

function extend(target) {
  var sources = [].slice.call(arguments, 1);
  sources.forEach(function(source) {
    for (var prop in source) {
      target[prop] = source[prop];
    }
  });

  return target;
}

function webpackWrapper(watch, test, callback) {
  var webpackOptions = {
    watch: watch,
    module: {
      // preLoaders: [{
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader'
      // }],
      loaders: [{
        test: /.js$/,
        exclude: /node_modules/,
        loaders: [
          'ng-annotate',
          'babel?presets[]=es2015&plugins[]=transform-runtime',
        ],
      }, {
        test: /\.html$/,
        name: 'mandrillTemplates',
        loader: 'raw!html-minify',
      }, {
        test: /\.svg$/,
        loader: 'svg-sprite?' + JSON.stringify({
          name: '[name]',
          prefixize: true,
        }),
      }],
    },
    output: {
      filename: 'index.module.js',
    },
  };

  var DEFAULT_ENV = {
    API_URL: '"http://123.59.138.141"',
  };

  var CURRENT_ENV = extend({}, DEFAULT_ENV);

  if (process.env.API_URL) {
    CURRENT_ENV.API_URL = JSON.stringify(process.env.API_URL);

    if (process.env.API_URL === '/') {
      CURRENT_ENV.API_URL = JSON.stringify('.');
    }
  }

  // plugins
  webpackOptions.plugins = [
    new wp.DefinePlugin({
      'process.env': CURRENT_ENV,
    }),
  ];


  if (watch) {
    webpackOptions.devtool = 'inline-source-map';
  }

  var webpackChangeHandler = function(err, stats) {
    if (err) {
      conf.errorHandler('Webpack')(err);
    }
    $.util.log(stats.toString({
      colors: $.util.colors.supportsColor,
      chunks: true,
      hash: false,
      version: false
    }));
    browserSync.reload();
    if (watch) {
      watch = false;
      callback();
    }
  };

  var sources = [path.join(conf.paths.src, '/app/index.module.js')];
  if (test) {
    sources.push(path.join(conf.paths.src, '/app/**/*.spec.js'));
  }

  return gulp.src(sources)
    .pipe(webpack(webpackOptions, null, webpackChangeHandler))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app')));
}

gulp.task('scripts', function() {
  return webpackWrapper(false, false);
});

gulp.task('scripts:watch', ['scripts'], function(callback) {
  return webpackWrapper(true, false, callback);
});

gulp.task('scripts:test', function() {
  return webpackWrapper(false, true);
});

gulp.task('scripts:test-watch', ['scripts'], function(callback) {
  return webpackWrapper(true, true, callback);
});
