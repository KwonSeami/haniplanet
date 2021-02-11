import {VALIDATE_REGEX} from "../constants/validates";

export const urlWithProtocol = (url: string) => {
  const {VALIDATE_URL: [urlRegex]} = VALIDATE_REGEX;

  if (typeof url !== 'string' || !urlRegex.test(url)) {
    return url;
  }

  const HTTP = 'http://';
  const HTTPS = 'https://';

  const PROTOCOLS = [HTTP, HTTPS];

  const filteredProtocol = PROTOCOLS.filter(p => (
    url.includes(p) && url.split(p).length === 2
  ));

  return filteredProtocol.length > 0
    ? url
    : `${HTTPS}${url}`;
};
