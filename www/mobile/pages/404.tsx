import * as React from 'react';
import styled from 'styled-components';
import { fontStyleMixin, heightMixin } from '../styles/mixins.styles';
import { $WHITE } from '../styles/variables.types';
import OGMetaHead from '../components/OGMetaHead';
import { staticUrl } from '../src/constants/env';
import Link from 'next/link';

const Div = styled.div`
  width: 100%;
  height: 100%;
  padding: 330px 0 323px;
  box-sizing: border-box;
  text-align: center;
  background-color: #f6f7f9;

  h2 {
    font-size: 19px;
    letter-spacing: -1.5px;

    img {
      display: block;
      margin: auto;
      width: 170px;
      padding-bottom: 14px;
    }
  }

  p {
    padding: 10px 0 30px;
    line-height: 1.7;
    letter-spacing: -1.4px;
    ${fontStyleMixin({
  size: 14,
  color: '#999'
})};
  }

  a {
    display: block;
    margin: auto;
    width: 200px;
    ${heightMixin(40)};
    ${fontStyleMixin({
  size: 15,
  weight: '600'
})};
    background-color: ${$WHITE};

    img {
      width: 15px;
      display: inline-block;
      vertical-align: middle;
      margin-top: -4px;
    }
  }

  @media screen and (max-width: 680px) {
    padding: 157px 0 194px;
    height: auto;

    h2 {
      font-size: 17px;
    }

    p {
      padding: 10px 40px 30px;
      font-size: 12px;
    }
  }
`;

const Pages404 = () => {
  return (
    <Div>
      <OGMetaHead title="요청하신 페이지를 찾을 수 없습니다." />
      <h2>
        <img
          src={staticUrl('/static/images/graphic/major-error.png')}
          alt="요청하신 페이지를 찾을 수 없습니다."
        />
        요청하신 페이지를 찾을 수 없습니다.
      </h2>
      <p>
        주소가 잘못 입력되었거나, 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.<br />
        입력하신 주소가 정확한지 다시 한번 확인해 주세요.
      </p>
      <Link href="/">
        <a>
          메인페이지로 이동
          <img
            src={staticUrl('/static/images/icon/arrow/icon-mini-shortcuts2.png')}
            alt="메인페이지로 이동"
          />
        </a>
      </Link>
    </Div>
  );
};

export default Pages404;
