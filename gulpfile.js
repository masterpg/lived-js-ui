const gulp = require('gulp');
const path = require('path');
const del = require('del');
const sequence = require('run-sequence');
const merge = require('merge-stream');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const shell = require('gulp-shell');
const exec = require('exec-chainable');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const browserSync = require('browser-sync');

//----------------------------------------------------------------------
//
//  Constants
//
//----------------------------------------------------------------------

const BUNDLE_DIR_DEMO = 'demo';

//----------------------------------------------------------------------
//
//  Tasks
//
//----------------------------------------------------------------------

//--------------------------------------------------
//  ライブラリのビルドタスク
//--------------------------------------------------

/**
 * ライブラリのビルドを行います。
 */
gulp.task('build', (done) => {
  return sequence(
    'clean:ts',
    'compile',
    'build:resources',
    'clean:ts',
    done
  );
});

/**
 * TypeScriptのコンパイルを行います。
 */
gulp.task('compile',
  shell.task([
    'node_modules/.bin/tslint -p tslint.json',
    'node_modules/.bin/tsc --project tsconfig.json --declaration',
  ])
);

/**
 * libディレクトリへ必要なリソースを配置します。
 */
gulp.task('build:resources', () => {
  return gulp.src([
    'src/**/*.js',
    'src/**/*.d.ts',
    '!src/types/**/*',
  ], { base: 'src' })
    .pipe(gulp.dest('lib'));
});

//--------------------------------------------------
//  ライブラリの開発タスク
//--------------------------------------------------

/**
 * 開発サーバーを立ち上げて作業するためのタスクを実行します。
 */
gulp.task('serve', (done) => {
  return sequence(
    'clean:ts',
    [
      'serve:bundle',
      'serve:browser-sync',
    ],
    done
  );
});

/**
 * 開発サーバーを立ち上げて作業するのに必要なソースをバンドルします。
 */
gulp.task('serve:bundle', () => {
  return merge(
    bundle(BUNDLE_DIR_DEMO)
  );
});

/**
 * 開発用のローカルサーバーを起動します。
 */
gulp.task('serve:browser-sync', () => {
  browserSync.init({
    port: 5000,
    ui: { port: 5005 },
    open: false,
    server: {
      baseDir: './',
    }
  });
});

//--------------------------------------------------
//  共通/その他
//--------------------------------------------------

/**
 * TypeScriptのコンパイルで出力されたファイルをクリーンします。
 */
gulp.task('clean:ts', () => {
  return del.sync([
    'src/**/{*.js,*.js.map,*.d.ts}',
    'test/**/{*.js,*.js.map,*.d.ts}',
    '!src/types/**/*',
  ]);
});

//----------------------------------------------------------------------
//
//  Functions
//
//----------------------------------------------------------------------

/**
 * 指定されたディレクトリのソースをバンドルします。
 * @param directory
 */
function bundle(directory) {
  return webpackStream({
    entry: {
      'index': path.join(directory, 'index'),
    },
    output: {
      filename: '[name].bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      plugins: [new TsconfigPathsPlugin({ configFile: 'tsconfig.json' })]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          enforce: 'pre',
          loader: 'tslint-loader',
        },
        {
          test: /\.tsx?$/,
          use: [{
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                sourceMap: true,
              },
            },
          }],
          // ローダーの処理対象から外すディレクトリ
          exclude: [/node_modules/, /bower_components/],
        },
      ]
    },
    devtool: 'inline-source-map',
    watch: true,
  }, webpack)
    .pipe(gulp.dest(directory));
}
