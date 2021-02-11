import * as React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useDispatch} from 'react-redux';
import LoginCheckBox from './styled/LoginCheckBox';
import Button from '../inputs/Button/ButtonDynamic';
import LoginFormFrame from './styled/LoginFormFrame';
import LoginValueInput from './styled/LoginValueInput';
import FIND_INFO_URL from '../../src/constants/urls/user/FindInfoUrl';
import {staticUrl} from '../../src/constants/env';
import {$WHITE} from '../../styles/variables.types';
import {loginFormReducer, LOGIN_FORM_STATE} from '../../src/lib/loginFormState';
import UserApi from '../../src/apis/UserApi';
import {userLogin} from '../../src/reducers/orm/user/userReducer';
import cn from 'classnames';

const LoginForm = React.memo(
  () => {
    // STATE
    const [
      {auth_id, password, authIdErr, passwordErr},
      dispatchLoginForm
    ] = React.useReducer(loginFormReducer, LOGIN_FORM_STATE);

    // Router
    const router = useRouter();
    const {query: search} = router;

    // Redux
    const dispatch = useDispatch();

    const handleOnChangeLoginForm = ({target: {name, value}}) => {
      dispatchLoginForm({type: 'FIELD', name, value});
    };
    const errorLoginForm = error => {
      dispatchLoginForm({type: 'ERROR', error});
    };

    const formOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!auth_id) {
        alert('아이디를 입력해주세요');
        return null;
      } else if (!password) {
        alert('비밀번호를 입력해주세요');
        return null;
      }

      return UserApi.login({auth_id, password})
        .then(({data, status}) => {
          if (Math.floor(status / 100) !== 4) {
            const {next} = search;
            dispatch(userLogin(data));

            router.push(!!next ? next as string : '/');
          }
        });
    };

    return (
      <LoginFormFrame>
        <form
          action=""
          method="POST"
          onSubmit={formOnSubmit}
        >
          <ul className="login-form">
            <li>
              <LoginValueInput
                className={cn({'login-error': authIdErr})}
                name="auth_id"
                value={auth_id}
                placeholder="아이디를 입력해주세요."
                onChange={handleOnChangeLoginForm}
                onBlur={() => errorLoginForm({
                  authIdErr: !auth_id ? '아이디를 입력해주세요.' : ''
                })}
              />
            </li>
            <li>
              <LoginValueInput
                className={cn({'login-error': passwordErr})}
                type="password"
                name="password"
                value={password}
                placeholder="비밀번호를 입력해주세요."
                onChange={handleOnChangeLoginForm}
                onBlur={() => errorLoginForm({
                  passwordErr: !password ? '비밀번호를 입력해주세요.' : ''
                })}
              />
            </li>
          </ul>
          <Button
            type="submit"
            size={{
              width: '100%',
              height: '50px'
            }}
            font={{
              size: '15px',
              weight: '600',
              color: $WHITE
            }}
            border={{
              radius: '24px',
            }}
            backgroundColor="#499aff"
          >
            로그인
          </Button>
          <div className="login-check-info">
            <LoginCheckBox>
              로그인 상태 유지
            </LoginCheckBox>
            <ul>
              <li>
                <Link href={FIND_INFO_URL.id}>
                  <a>아이디 찾기</a>
                </Link>
              </li>
              <li>
                <Link href={FIND_INFO_URL.password}>
                  <a>비밀번호 찾기</a>
                </Link>
              </li>
            </ul>
          </div>
        </form>
        <div className="sign-up-wrapper">
          <p>
            아직 한의플래닛 회원이 아니신가요?
          </p>
          <Link href="/signup">
            <a>
              회원가입
              <img
                src={staticUrl('/static/images/icon/arrow/icon-white-arrow.png')}
                alt="회원가입"
              />
            </a>
          </Link>
        </div>
      </LoginFormFrame>
    );
  },
);

export default LoginForm;
