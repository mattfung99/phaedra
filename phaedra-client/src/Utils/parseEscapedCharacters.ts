const parseEscapedCharacters = (escapedCharacter: string): string => {
  const parser: DOMParser = new DOMParser();
  return parser.parseFromString(`<!doctype html><body>${escapedCharacter}`, 'text/html').body.textContent as string;
};

export { parseEscapedCharacters };
