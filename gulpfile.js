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
  shell.task(
    [
      'node_modules/.bin/tslint -p tslint.json',
      'node_modules/.bin/tsc --project tsconfig.json --declaration',
    ],
    {verbose: true}
  )
);

/**
 * libディレクトリへ必要なリソースを配置します。
 */
gulp.task('build:resources', () => {
  return gulp.src([
    'src/**/*.js',
    'src/**/*.d.ts',
    '!src/typings.d.ts',
  ], {base: 'src'})
    .pipe(gulp.dest('lib'));
});

//--------------------------------------------------
//  ライブラリの開発タスク
//--------------------------------------------------

/**
 * 開発を行うためのタスクを起動します。
 */
gulp.task('dev', (done) => {
  return sequence(
    'clean:ts',
    [
      'dev:bundle:test',
      'dev:serve',
    ],
    done
  );
});

/**
 * test, demoディレクトリのソースをバンドルします。
 */
gulp.task('dev:bundle:test', () => {
  return merge(
    // bundle('test'),
    bundle('demo')
  );
});

/**
 * 開発用のローカルサーバーを起動します。
 */
gulp.task('dev:serve', () => {
  browserSync.init({
    port: 5000,
    ui: {port: 5005},
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
      plugins: [new TsconfigPathsPlugin({configFile: 'tsconfig.json'})]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          // ローダーの処理対象から外すディレクトリ
          exclude: [/node_modules/, /bower_components/],
          use: [{
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                sourceMap: true,
              },
            },
          }],
        }
      ]
    },
    devtool: 'inline-source-map',
    watch: true,
  }, webpack)
    .pipe(gulp.dest(directory));
}
