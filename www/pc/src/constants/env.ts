export const DEV = process.env.NODE_ENV !== 'production';

export const PROD_CLIENT_URL = 'https://www.haniplanet.com';

export const GA_TRACKING_ID = 'UA-106790733-1';
export const FB_TRACKING_ID = '321574088476255';
export const SENTRY_TRACKING_ID = 'https://7d2965918bc844fe81129923929a06c7@sentry.io/1540869';

export const SITE_NAME = '한의플래닛';
export const SITE_TITLE = '한의사를 위한 모든 것';
export const SITE_DESCRIPTION = 'We have all you need, KMD';
export const SITE_IMAGE = PROD_CLIENT_URL + '/static/images/logo/hani-app-1024.png';
export const FAVICON = PROD_CLIENT_URL + '/static/images/favicon.ico';

export const GOOGLE_SITE_VERIFICATION = 'iihd07AzQ20pwS1WVLE6ZNtr3ZUWT_lkmzpDLs-TVCE';
export const NAVER_SITE_VERIFICATION = '1b0baa140e9aa90c05a439c0beb0ff45a177509c';

export const GOOGLE_ADS_ID = 'AW-795712204';

export const KAKAO_JAVASCRIPT_KEY = '8588ec48775ebf6cfcceb77281676b16';

export const IS_PROD = !DEV;
export const IS_API_STAGE = process.env.API_ENV === 'stage';
export const IS_PROD_SERVER = IS_PROD && !IS_API_STAGE;

console.log(`+${process.env.API_ENV}+`);
console.log(`+${process.env.NODE_ENV}+`);

// web socket
export const PRODUCTION_URL = 'https://api.haniplanet.com';
export const STAGE_URL = process.env.STAGE_URL || 'https://api.huplanet.kr';
export const BASE_URL = IS_PROD_SERVER ? PRODUCTION_URL : STAGE_URL;

// web socket
export const PRODUCTION_SOCKET_URL = 'wss://api.haniplanet.com';
export const STAGE_SOCKET_URL = process.env.STAGE_SOCKET_URL || 'wss://api.huplanet.kr';
export const BASE_SOCKET_URL = IS_PROD_SERVER ? PRODUCTION_SOCKET_URL : STAGE_SOCKET_URL;

console.log(`IS_API_STAGE=${IS_API_STAGE}`);
console.log(`BASE_SOCKET_URL=${BASE_SOCKET_URL}`);

export const staticUrl = (src: string) => `${
  process.env.S3_BUCKET ?
    `https://${process.env.S3_BUCKET}.s3.ap-northeast-2.amazonaws.com` :
    ''
}${src}`;

export const CHANNEL_TALK_PLUGIN_KEY = 'c0991914-09ea-4d97-b757-c1678619a64e';

export const GRAPHQL_BASE_URL = BASE_URL + '/graphql/';

export const FROALA_PROD_KEY = '1CC3kC5D7B4F5D3F3bhwvE5kekowdhdnxF5mh1A-7mA11C8D6B5B1G4I3F2I3A6==';
export const FROALA_STAGE_KEY = '1CC3kC5D7B4F5D3F3bhwvE5kqujfflC-16C6gC-9rE1D4A3A10B1B6A5B1F4G3==';
