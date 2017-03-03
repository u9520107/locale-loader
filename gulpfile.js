import gulp from 'gulp';
import exportLocale from './src/exportLocale';


gulp.task('export-locale', async () => {
  await exportLocale({
    src: './test/**',
  });
});
