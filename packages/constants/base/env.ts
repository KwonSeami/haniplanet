export const DEV = process.env.NODE_ENV !== 'production';

export const IS_PROD = !DEV;
export const IS_API_STAGE = process.env.API_ENV === 'stage';
export const IS_PROD_SERVER = IS_PROD && !IS_API_STAGE;

export const PRODUCTION_URL = 'https://api.haniplanet.com';
export const STAGE_URL = 'https://issue606-backend-release.huplanet.kr';
export const BASE_URL = IS_PROD_SERVER ? PRODUCTION_URL : STAGE_URL;
