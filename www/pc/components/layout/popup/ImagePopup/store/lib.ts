import {LocalCache} from 'browser-cache-storage';
import {axiosInstance} from '@hanii/planet-apis/dist';
import {BASE_URL} from '../../../../../src/constants/env';
import {IMAGE_POPUP_KEY, POPUP_NOT_SHOW} from './constants';
import {DAY, MINUTE, MONTH} from '../../../../../src/constants/times';

const getNotShowTime = (daily?: boolean) => (
  new Date().getTime() + (daily ? DAY : 12 * MONTH)
);

export const getShowPopups = (uniqId: string) => (
  LocalCache.get(uniqId || IMAGE_POPUP_KEY, IMAGE_POPUP_KEY, 5 * MINUTE)
);

export const setShowPopups = (uniqId: string, popups: any[]) => (
  LocalCache.set(uniqId || IMAGE_POPUP_KEY, IMAGE_POPUP_KEY, popups)
);

export const getNotShowPopups = () => (
  LocalCache.get(POPUP_NOT_SHOW, POPUP_NOT_SHOW, 12 * MONTH) || {}
);

export const setNotShowPopups = (popupId: number, daily?: boolean) => {
  LocalCache.set(POPUP_NOT_SHOW, POPUP_NOT_SHOW, {
    ...getNotShowPopups(),
    [popupId]: getNotShowTime(daily),
  });
};

export const getPopups = (access: string, uniqId: string) => (
  axiosInstance({baseURL: BASE_URL, token: access})
    .get('/maintain/', {params: {device: 'pc'}})
    .then(({data: {result}}) => {
      const {popups = []} = result || {} as any;
      setShowPopups(uniqId, popups);

      return popups;
    })
);