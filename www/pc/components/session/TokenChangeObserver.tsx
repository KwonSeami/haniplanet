// App 컴포넌트가 class 컴포넌트이기 때문에 Hooks을 사용할 수 없어 컴포넌트 형태로 작성합니다.
import * as React from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import PasswordPopup from '../layout/popup/PasswordPopup';
import InactivePopup from '../layout/popup/InactivePopup';
import AgreementPopup from '../layout/popup/AgreementPopup';
import {timeOver} from '../../src/lib/date';
import {pushPopup} from '../../src/reducers/popup';
import {fetchMeThunk} from '../../src/reducers/orm/user/thunks';
import {RootState} from '../../src/reducers';
import {MONTH} from '../../src/constants/times';

// 비밀번호 변경 팝업
const passwordPopupNotice = (user: IUser, dispatch) => {
  const {password_updated_at, password_warned_at, id: myId} = user;
  const passwordOutDated = timeOver(
    new Date(password_updated_at).getTime(),
    6 * MONTH,
  );

  if (!password_warned_at) {
    !!passwordOutDated && dispatch(pushPopup(PasswordPopup, {myId}));
    return null;
  }

  if (timeOver(new Date(password_warned_at).getTime(), MONTH)) {
    dispatch(pushPopup(PasswordPopup, {myId}));
    return null;
  }
};

const TokenChangeObserver: React.FC = () => {
  const dispatch = useDispatch();
  const {access, id} = useSelector(
    ({system: {session}}: RootState) => session,
    shallowEqual,
  );

  React.useEffect(() => {
    if (access && id) {
      dispatch(fetchMeThunk(user => {
        const {status, is_proxy_join, auth_id: currId} = user;

        passwordPopupNotice(user, dispatch);
        status === 'rest' && dispatch(pushPopup(InactivePopup));
        is_proxy_join && dispatch(pushPopup(AgreementPopup, {currId}));
      }));
    }
  }, [access, id]);

  return null;
};

export default React.memo(TokenChangeObserver);
