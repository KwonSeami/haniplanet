import {createGlobalStyle} from 'styled-components';
import {staticUrl} from '../src/constants/env';

const FontStyles = createGlobalStyle`
  @font-face {
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 300;
    src: local(NotoSansKR-Light),
    url(${staticUrl('/static/files/fonts/NotoSansKR-Light.woff')}) format('woff'),
    url(${staticUrl('/static/files/fonts/NotoSansKR-Light.woff2')}) format('woff2'),
    url(${staticUrl('/static/files/fonts/NotoSansKR-Light.otf')}) format('opentype');
  }

  @font-face {
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 400;
    src: local(NotoSansKR-Regular),
    url(${staticUrl('/static/files/fonts/NotoSansKR-Regular.woff')}) format('woff'),
    url(${staticUrl('/static/files/fonts/NotoSansKR-Regular.woff2')}) format('woff2'),
    url(${staticUrl('/static/files/fonts/NotoSansKR-Regular.otf')}) format('opentype');
  }

  @font-face {
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 600;
    src: local(NotoSansKR-Medium),
    url(${staticUrl('/static/files/fonts/NotoSansKR-Medium.woff')}) format('woff'),
    url(${staticUrl('/static/files/fonts/NotoSansKR-Medium.woff2')}) format('woff2'),
    url(${staticUrl('/static/files/fonts/NotoSansKR-Medium.otf')}) format('opentype');
  }

  @font-face {
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 700;
    src: local(NotoSansKR-Bold),
    url(${staticUrl('/static/files/fonts/NotoSansKR-Bold.woff')}) format('woff'),
    url(${staticUrl('/static/files/fonts/NotoSansKR-Bold.woff2')}) format('woff2'),
    url(${staticUrl('/static/files/fonts/NotoSansKR-Bold.otf')}) format('opentype');
}
`;

export default FontStyles;
