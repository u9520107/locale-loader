const localeFileRegExp = /^[a-z]{2}((-|_)[0-9a-z]{2}[0-9a-z]?)?\.(js|json)$/i;

export default function (filename) {
  return localeFileRegExp.test(filename);
}
