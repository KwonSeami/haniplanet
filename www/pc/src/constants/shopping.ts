import {IS_PROD_SERVER} from './env';

export const SHINHAN_DISCOUNT_PERCENTAGE = 0.05;
export const SHINHAN_PG_SERVER_DOMAIN = IS_PROD_SERVER ? 'https://shinhan.haniplanet.com' : 'https://shinhan.huplanet.kr';

export const GOODS_ORDER_MAX_QUANTITY = 9999;
