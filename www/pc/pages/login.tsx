import * as React from 'react';
import styled from 'styled-components';
import anonRequired from '../hocs/anonRequired';
import OGMetaHead from '../components/OGMetaHead';
import LoginForm from '../components/login/LoginForm';
import {fontStyleMixin} from '../styles/mixins.styles';
import {$WHITE} from '../styles/variables.types';
import {useDispatch} from 'react-redux';
import {setLayout, clearLayout} from '../src/reducers/system/style/styleReducer';
import { staticUrl } from '../src/constants/env';
import Link from 'next/link';

const Section = styled.section`
  box-sizing: border-box;
  width: 100%;
  padding: 99px 0 135px;
  background-color: #fafafa;

  img {
    display: block;
    width: 208px;
    margin: 0 auto 39px;
  }

  h2 {
    padding: 46px 53px 35px;
    line-height: 1.2;
    letter-spacing: -0.8px;
    ${fontStyleMixin({
      size: 28,
      weight: '300',
      color: '#a3a3a3',
    })};

    p {
      ${fontStyleMixin({
        size: 28,
        weight: '300',
        color: '#499aff',
      })};
    }
  }

  > div {
    width: 426px;
    height: 490px;
    margin: auto;
    border: 1px solid #eee;
    box-sizing: border-box;
    background-color: ${$WHITE};
  }
`;

const LoginPage = React.memo(() => {

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setLayout({
      background: 'transparent',
      themetype: 'white',
      fakeHeight: false,
      position: 'absolute'
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, []);
  
  return (
    <Section>
      <OGMetaHead title="로그인하기" />
      <Link href="/">
        <a>
          <img
            src={staticUrl('/static/images/logo/logo.png')}
            alt="한의플래닛 로고"
          />
        </a>
      </Link>
      <div>
        <h2>
          한의사를 위한 모든 것
          <p>한의플래닛</p>
        </h2>
        <LoginForm />
      </div>
    </Section>
  );
});

LoginPage.displayName = 'LoginPage';
export default anonRequired(LoginPage);
