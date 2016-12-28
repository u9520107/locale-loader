const localeFileRegExp = /^[a-z]{2}((-|_)[a-z]{2})?\.(js|json)$/i;

export default function (filename) {
  return localeFileRegExp.test(filename);
}
