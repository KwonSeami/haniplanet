import * as React from 'react';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import Loading from '../common/Loading';
import {SECOND} from '../../src/constants/times';

interface Props {
  callback: (refreshToken?: string) => void;
}

const TokenRefresher: React.FC<Props> = ({callback}) => {
  React.useEffect(() => {
    try {
      const cookieRefresh = Cookies.get('refresh');

      if (cookieRefresh) {
        const {exp} = jwt_decode(Cookies.get('access'));

        if (Date.now() >= exp * SECOND) {
          alert('토큰이 만료되었습니다.');
          throw "The expired token";
        } else {
          callback && callback(cookieRefresh);
        }
      } else {
        throw "Refresh token does not exist.";
      }
    } catch(err) {
      callback && callback(null);
    }
  }, [callback]);

  return (
    <Loading />
  );
};

export default React.memo(TokenRefresher);
