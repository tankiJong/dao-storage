'use strict';

const gulp = require('gulp');
const conf = require('./conf');
const inject = require('gulp-inject');

// 自动 import svg 文件
gulp.task('svg', () => {
  const SVGPath = conf.paths.components + '/svg';

  const target = gulp.src(SVGPath + '/svg.js');

  // It's not necessary to read the files (will speed up things), we're only after their paths:
  const sources = gulp.src([SVGPath + '/**/*.svg'], { read: false });

  const injectConfig = {
    starttag: '// inject:svg',
    endtag: '// injectend',
    addPrefix: '.',
    relative: true,
    transform: (filepath) => {
      return `import '${filepath}';`;
    },
  };

  return target.pipe(inject(sources, injectConfig))
    .pipe(gulp.dest(SVGPath));
});

// 自动生成筛选 svg 的 filter
gulp.task('svg:filter', () => {
  const SVGPath = conf.paths.components + '/svg';

  const target = gulp.src('src/app/index.filter.js');
  const sources = gulp.src([SVGPath + '/**/*.svg'], { read: false });

  const injectFilterConfig = {
    starttag: '// inject:imageFilter',
    endtag: '// injectend',
    transform: (filepath) => {
      let fileName = filepath.replace('/src/app/components/svg/', '');
      fileName = fileName.replace('.svg', '');
      return `if (keyword.indexOf('${fileName}') > -1) {
        images.push('#${fileName}');
      }`;
    },
  };

  return target.pipe(inject(sources, injectFilterConfig))
  .pipe(gulp.dest('src/app/'));
});
