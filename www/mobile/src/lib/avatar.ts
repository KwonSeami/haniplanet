import {staticUrl} from "../constants/env";

export const avatarExposeType = (user_expose_type: string, avatar: string) => {
  switch (user_expose_type) {
    case 'real':
      return avatar || staticUrl('/static/images/icon/icon-default-profile.png');
    case 'nick':
      return staticUrl('/static/images/icon/icon-default-nickname.png');
    case 'anon':
      return staticUrl('/static/images/icon/icon-default-anony.png');
    default:
      return staticUrl('/static/images/icon/icon-default-profile.png');
  }
};
