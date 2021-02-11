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

const Page400 = () => {
  return (
    <Div>
      <OGMetaHead title="잘못된 요청입니다." />
      <h2>
        <img
          src={staticUrl('/static/images/banner/major-error.png')}
          alt="잘못된 요청입니다."
        />
        잘못된 요청입니다.
      </h2>
      <p>
        잘못된 요청으로 인해
        <br/>
        페이지를 연결할 수 없습니다.
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
};

export default Page400;
