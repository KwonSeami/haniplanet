import Cookies from 'js-cookie';

export const destroySession = () => {
  Cookies.remove('access');
  Cookies.remove('refresh');
  Cookies.remove('me');
};
