const localeFileRegExp = /^([a-z]{2}(-|_)([A-Z]{2}|[0-9]{3}|[A-Z][a-z]{3}(-|_)[A-Z]{2})|[a-z]{3}(-|_)[A-Z]{2})$/;
const fileRegExp = /\.(js|json)$/i;

export default function (filename) {
  if (!fileRegExp.test(filename)) {
    // no js or json file
    return false;
  }
  const name = filename.replace(fileRegExp, '');
  return localeFileRegExp.test(name);
}

// Known forms:
// aa-Aaaa-AA
// aa-000
// aa-AA
// aaa-AA
