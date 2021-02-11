import * as Cookies from 'js-cookie';
import {MAIN_USER_TYPES} from '../constants/users';

export const saveUserToCookieInClient = (
  access: TokenType,
  refresh: TokenType
) => {
  Cookies.set('access', access, {
    expires: 1,
  });
  Cookies.set('refresh', refresh, {
    expires: 14,
  });
};

// doctor => student, student => doctor, else => else
export const userTypeReverser = (user_type: TUserType) => MAIN_USER_TYPES[+!MAIN_USER_TYPES.indexOf(user_type)] || user_type;
