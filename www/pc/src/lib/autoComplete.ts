import {LocalCache} from 'browser-cache-storage';
import {DAY} from '../constants/times';

const AUTO_COMPLETE_KEY = 'is-auto-complete';

export const setAutoComplete = (userPk: HashId, data) => {
  if (!userPk) {
    return null;
  }

  LocalCache.set(userPk, AUTO_COMPLETE_KEY, data);
};

export const getAutoComplete = (userPk: HashId) =>
  LocalCache.get(userPk, AUTO_COMPLETE_KEY, 30 * DAY);

export const clearAutoComplete = () => LocalCache.del(AUTO_COMPLETE_KEY);