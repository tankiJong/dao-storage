const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

// 压缩图片任务
// 在命令行输入 gulp images 启动此任务
const ImgPath = 'src/assets/images';

gulp.task('images', () => {
  // 1. 找到图片
  gulp.src(ImgPath + '/*.*')
    // 2. 压缩图片
    .pipe(imagemin({
      progressive: true,
    }));
});
