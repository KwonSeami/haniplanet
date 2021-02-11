import moment from 'moment';
import ImagePopup from '../index';
import {pushPopup} from '../../../../../src/reducers/popup';
import {getNotShowPopups} from './lib';

export const showImagePopupThunks = (popups: any[], pathname: string) => (dispatch) => {
  const notShowPopups = getNotShowPopups();

  for (const {id, page_path, html, start_at, end_at} of popups) {
    if (!page_path.includes(pathname)) {
      continue;
    } else if (!moment().isBetween(start_at, end_at)) {
      continue;
    } else if (Object.keys(notShowPopups).includes(id.toString())) {
      if (moment().isBefore(notShowPopups[id])) {
        continue;
      }
    }

    dispatch(pushPopup(ImagePopup, {html, popupId: id}));
  }
};
