import * as React from 'react';
import {IFormProps} from './useForm';
import {useDispatch} from 'react-redux';
import useLocation from '../../../src/hooks/router/useLocation';
import {pushPopup} from '../../../src/reducers/popup';
import UserApi from '../../../src/apis/UserApi';
import FindResultPopup from '../../layout/popup/FindResultPopup';

const useFormHandle = ({send_by, field}: Pick<IFormProps, 'field' | 'send_by'>) => {
  const referralType = React.useMemo(() => field === 'password' ? 'pwd' : field, [field]);
  const {history} = useLocation();
  const dispatch = useDispatch();

  const [info, setInfo] = React.useState({
    identifier: '',
    send_to: '',
    code: '',
  });
  const [userPassword, setUserPassword] = React.useState({
    password: '',
    password2: '',
  });
  const [csrf, setCsrf] = React.useState('');

  const {identifier, send_to, code} = info;
  const {password, password2} = userPassword;

  const onChangeAtName = setState => ({target: {name, value}}) => {
    setState(current => ({...current, [name]: value}));
  };

  const getAuthCode = React.useCallback(() => UserApi.verifyCode({
    send_by,
    identifier,
    send_to,
    referral: `find_${referralType}`,
  }), [send_by, info, referralType]);

  const findUserInfo = React.useCallback(() => {
    if (!!csrf) {
      if (password !== password2) {
        alert('입력된 비밀번호가 서로 다릅니다');
        return null;
      }
      return UserApi.updatePassword({csrf, password})
        .then(({status}) => {
          if (Math.floor(status / 100) !== 4) {
            alert('비밀번호 변경이 완료되었습니다.');
          }
        });
    } else {
      UserApi.findInfo({code}).then(({data: {result}}) => {
        if (!result) {
          return null;
        }

        if (field === 'id') {
          const {auth_id, created_at} = result;

          dispatch(pushPopup(FindResultPopup, {
            auth_id,
            created_at,
            buttonGroupProps: {
              leftButton: {
                children: '비밀번호 찾기',
                onClick: () => history.replace('/find/password'),
              },
              rightButton: {
                children: '로그인',
                onClick: () => history.replace('/login'),
              },
            },
          }));
        } else {
          setCsrf(result.csrf);
        }
      });
    }
  }, [csrf, password, password2, code, field]);

  return {
    onChangeAtName,
    getAuthCode,
    findUserInfo,
    infoState: {info, setInfo},
    userPasswordState: {userPassword, setUserPassword},
    csrfState: {csrf, setCsrf},
  };
};

export default useFormHandle;
