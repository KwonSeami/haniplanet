import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $TEXT_GRAY} from '../../styles/variables.types';
import BannerCard from '../../components/UI/Card/BannerCard';
import Radio, {Div} from '../../components/UI/Radio/Radio';
import {staticUrl} from '../../src/constants/env';
import FormPC from '../../components/findinfo/form/FormPC';
import {useRouter} from 'next/router';
import Page404 from '../../components/errors/Page404';
import anonRequired from "../../hocs/anonRequired";

export const TAB_INDEX = {
  id: 'id',
  password: 'password',
};

const TAB_ITEMS = [
  {name: '아이디 찾기', index: TAB_INDEX.id, link: {href: '/find/[field]', as: '/find/id'}},
  {name: '비밀번호 찾기', index: TAB_INDEX.password, link: {href: '/find/[field]', as: '/find/password'}},
];

const FindInfoLi = styled.li`
  padding: 12px 0 30px;
  border-top: 1px solid ${$BORDER_COLOR};
`;

const H2 = styled.h2`
  position: relative;

  ${Div} {
    label {
      font-size: 19px;
      font-weight: 300;
      letter-spacing: -2px;
    }

    span {
      top: 2px;
    }
  }

  .msg {
    position: absolute;
    top: 5px;
    left: 126px;
    font-size: 12px;
    color: ${$TEXT_GRAY};
  }
`;

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
      <BannerCard
        title="아이디/비밀번호 찾기"
        items={TAB_ITEMS}
        currentTab={field}
        bannerBackground={staticUrl('/static/images/banner/img-signup.png')}
      >
        <ul>
          <FindInfoLi className="clearfix">
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
              <FormPC
                send_by='sms'
                field={field}
                router={router}
              />
            )}
          </FindInfoLi>
          <FindInfoLi className="clearfix">
            <H2>
              <Radio
                checked={send_by === 'email'}
                onClick={memoSetSelect('email')}
              >
                이메일 인증
              </Radio>
              <span className="msg">
                가입 당시 입력한 이메일 주소로 {referralType}를 찾을 수 있습니다.
              </span>
            </H2>
            {send_by === 'email' && (
              <FormPC
                send_by='email'
                field={field}
                router={router}
              />
            )}
          </FindInfoLi>
        </ul>
      </BannerCard>
    );
  },
);

export default anonRequired(FindInfoPC);
