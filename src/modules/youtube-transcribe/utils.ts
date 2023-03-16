const extractStringInBetween = (
  text: string,
  left: string | RegExp,
  right: string | RegExp
) => {
  let pos;
  if (left instanceof RegExp) {
    const match = text.match(left);
    if (!match) {
      return '';
    }

    pos = match.index + match[0].length;
  } else {
    pos = text.indexOf(left);
    if (pos === -1) {
      return '';
    }

    pos += left.length;
  }
  text = text.slice(pos);
  pos = text.indexOf(right as string);

  if (pos === -1) {
    return '';
  }

  text = text.slice(0, pos);
  return text;
};

export const findAndParseJSON = (
  text: string,
  left: string | RegExp,
  right: string | RegExp
) => {
  let json = extractStringInBetween(text, left, right);
  json = json.replace(/^[)\]}'\s]+/, '');
  return JSON.parse('{' + json);
};
