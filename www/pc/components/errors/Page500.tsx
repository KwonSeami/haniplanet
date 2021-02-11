import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import Link from 'next/link';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {$WHITE, $POINT_BLUE} from '../../styles/variables.types';
import OGMetaHead from "../OGMetaHead";

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
    })}
  }

  a {
    display: block;
    margin: auto;
    width: 200px;
    ${heightMixin(40)}
    ${fontStyleMixin({
      size: 15,
      weight: '600'
    })}
    background-color: ${$WHITE};

    img {
      width: 15px;
      display: inline-block;
      vertical-align: middle;
      margin-top: -4px;

      &.hover {
        display: none;
      }
    }

    &:hover {
      color: ${$POINT_BLUE};

      img {
        display: none;

        &.hover {
          display: inline-block !important;
        }
      }
    }
  }
`;

const Page500 = () => (
  <Div>
    <OGMetaHead title="내부 서버 오류" />
    <h2>
      <img
        src={staticUrl('/static/images/banner/major-error.png')}
        alt="내부 서버 오류"
      />
      내부 서버 오류
    </h2>
    <p>
      서비스가 일시적으로 중단되었습니다.
      <br/>
      동일한 문제가 계속 발생할 경우 고객센터(custommer@balky.kr)로 알려주세요.
    </p>
    <Link href="/">
      <a>
        메인페이지로 이동
        <img
          src={staticUrl('/static/images/icon/arrow/icon-mini-shortcuts2.png')}
          alt="메인페이지로 이동"
        />
        <img
          src={staticUrl('/static/images/icon/arrow/icon-blue-shortcuts.png')}
          alt="메인페이지로 이동"
          className="hover"
        />
      </a>
    </Link>
  </Div>
);

export default Page500;
