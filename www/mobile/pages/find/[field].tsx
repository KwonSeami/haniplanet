import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $TEXT_GRAY, $FONT_COLOR, $WHITE} from '../../styles/variables.types';
import Radio, {Div} from '../../components/UI/Radio/Radio';
import {useRouter} from 'next/router';
import Page404 from '../../components/errors/Page404';
import {fontStyleMixin} from '../../styles/mixins.styles';
import Router from 'next/router';
import FormMobile from '../../components/findinfo/form/FormMobile';
import anonRequired from "../../hocs/anonRequired";

const Section = styled.section`
  background-color: #f6f7f9;
  width: 100%;
  height: 100%;
  padding-bottom: 248px;
  box-sizing: border-box;

  @media screen and (max-width: 500px) {
    height: auto;
    padding: 0;
  }
`;

const NavUl = styled.ul`
  text-align: center;
`;

interface INavLiProps {
  on?: boolean;
}

const NavLi = styled.li<INavLiProps>`
  position: relative;
  padding: 38px 43px;
  display: inline-block;
  vertical-align: middle; 

  span {
    ${fontStyleMixin({
      size: 14,
      color:  $TEXT_GRAY
    })}
  }

  &:first-child::after {
    content: '';
    position: absolute;
    right: -3px;
    top: 50%;
    margin-top: -4px;
    width: 1px;
    height: 8px;
    background-color: ${$TEXT_GRAY};
  }

  ${({on}) => on && `
    span {
      border-bottom: 1px solid ${$TEXT_GRAY};
      ${fontStyleMixin({
        color:  $FONT_COLOR,
        weight: 'bold'
      })}
    }
  `}

  @media screen and (max-width: 500px) {
    padding: 26px 43px;
  }
`;

const FindInfoUl = styled.ul`
  max-width: 502px;
  margin: auto;
  box-sizing: border-box;
  padding: 20px 50px 96px;
  background-color: ${$WHITE};

  @media screen and (max-width: 500px) {
    padding: 0 15px 96px;
  }
`;

const FindInfoLi = styled.li`
  padding: 15px 0 30px;
  border-top: 1px solid ${$BORDER_COLOR};

  &:first-child {
    border-top: 0;
  }
  @media screen and (max-width: 500px) {
    padding: 17px 0 30px;
  }
`;

const H2 = styled.h2`
  position: relative;

  ${Div} {
    label {
      font-size: 16px;
      letter-spacing: -2px;
    }

    span {
      top: 2px;
    }
  }

  .msg {
    display: block;
    padding: 4px 0 0 30px;
    font-size: 12px;
    color: ${$TEXT_GRAY};
  }
`;

export const TAB_INDEX = {
  id: 'id',
  password: 'password'
};

export type AuthType = '' | 'sms' | 'email';

const FindInfoPC: React.FC<{}> = React.memo(() => {
    const router = useRouter();
    const {query: {field}} = router;
    if (![TAB_INDEX.id, TAB_INDEX.password].includes(field)) {
      return (<Page404 />);
    }

    const [send_by, set_send_by] = React.useState<AuthType>('');
    const memoSetSelect = send_by => React.useCallback(() => set_send_by(send_by), []);
    const referralType = field === 'id' ? '아이디' : '비밀번호';

    return (
      <Section>
        <NavUl>
          <NavLi
            on={TAB_INDEX.id === field}
            onClick={() => Router.replace('/find/id')}
          >
            <span>아이디 찾기</span>
          </NavLi>
          <NavLi
            on={TAB_INDEX.password === field}
            onClick={() => Router.replace('/find/password')}
          >
            <span>비밀번호 찾기</span>
          </NavLi>
        </NavUl>
        <FindInfoUl>
          <FindInfoLi>
            <H2>
              <Radio
                checked={send_by === 'sms'}
                onClick={memoSetSelect('sms')}
              >
                휴대폰 인증
              </Radio>
              <span className="msg">
                가입 당시 입력한 휴대폰 번호로 {referralType}를 찾을 수 있습니다.
              </span>
            </H2>
            {send_by === 'sms' && (
              <FormMobile
                send_by="sms"
                field={field}
                history={history}
              />
            )}
          </FindInfoLi>
          <FindInfoLi>
            <H2>
              <Radio
                checked={send_by === 'email'}
                onClick={memoSetSelect('email')}
              >
                이메일로 인증
              </Radio>
              <span className="msg">
                가입 당시 입력한 이메일 주소로 {referralType}를 찾을 수 있습니다.
              </span>
            </H2>
            {send_by === 'email' && (
              <FormMobile
                send_by="email"
                field={field}
                history={history}
              />
            )}
          </FindInfoLi>
        </FindInfoUl>
      </Section>
    );
  },
);

export default anonRequired(FindInfoPC);
