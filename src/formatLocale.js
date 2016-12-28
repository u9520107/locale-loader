export default function formatLocale(l) {
  const tokens = l.split(/[-_]/);
  tokens[0] = tokens[0].toLowerCase();
  if (tokens[1]) {
    tokens[1] = tokens[1].toUpperCase();
  }
  return tokens.join('-');
}
