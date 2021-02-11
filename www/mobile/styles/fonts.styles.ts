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

@font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 300;
    src: url(${staticUrl('/static/files/fonts/montserrat-v13-latin-300.eot')});
    src: local(montserrat-v13-latin-300),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-300.woff')}) format('woff'),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-300.woff2')}) format('woff2'),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-300.eot?#iefix')}) format('embedded-opentype'),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-300.ttf')}) format('truetype');
}

@font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: normal;
    src: url(${staticUrl('/static/files/fonts/montserrat-v13-latin-regular.eot')});
    src: local(montserrat-v13-latin-regular),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-regular.woff')}) format('woff'),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-regular.woff2')}) format('woff2'),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-regular.eot?#iefix')}) format('embedded-opentype'),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-regular.ttf')}) format('truetype');
}

@font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 600;
    src: url(${staticUrl('/static/files/fonts/montserrat-v13-latin-600.eot')});
    src: local(montserrat-v13-latin-600),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-600.woff')}) format('woff'),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-600.woff2')}) format('woff2'),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-600.eot?#iefix')}) format('embedded-opentype'),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-600.ttf')}) format('truetype');
}

@font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 800;
    src: url(${staticUrl('/static/files/fonts/montserrat-v13-latin-800.eot')});
    src: local(montserrat-v13-latin-800),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-800.woff')}) format('woff'),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-800.woff2')}) format('woff2'),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-800.eot?#iefix')}) format('embedded-opentype'),
    url(${staticUrl('/static/files/fonts/montserrat-v13-latin-800.ttf')}) format('truetype');
}
`;

export default FontStyles;
