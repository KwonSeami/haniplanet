import * as React from 'react';
import styled from 'styled-components';
import OGMetaHead from "../components/OGMetaHead";
import anonRequired from '../hocs/anonRequired';
import LoginForm from '../components/login/LoginForm';
import {fontStyleMixin} from '../styles/mixins.styles';
import {$WHITE} from '../styles/variables.types';
import {setLayout, clearLayout} from '../src/reducers/system/style/styleReducer';
import {useDispatch} from 'react-redux';

const Section = styled.section`
  background-color: #f6f7f9;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  > div {
    margin: 0 auto;
    padding: 0 15px;
    background-color: ${$WHITE};
    box-sizing: border-box;

    h2 {
      max-width: 328px;
      margin: 0 auto;
      padding: 20px 5px 36px;
      line-height: 1.2;
      letter-spacing: -0.8px;
      background-color: ${$WHITE};
      box-sizing: border-box;
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
  }

  @media screen and (min-width: 680px) {
    padding: 50px 0;

    > div {
      width: 426px;
      height: 490px;
      border: 1px solid #eee;

      h2 {
        padding: 46px 4px 36px;
      }
    }
  }
`;

const LoginPage = React.memo(() => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setLayout({
      headerDetail: '로그인',
      isHeaderTitle: true,
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, []);

  return (
    <Section>
      <OGMetaHead title="로그인하기" />
      <div>
        <h2>
          한의사를 위한 모든 것
          <p>한의플래닛</p>
        </h2>
        <LoginForm/>
      </div>
    </Section>
  )
});

LoginPage.displayName = 'LoginPage';
export default anonRequired(LoginPage);
