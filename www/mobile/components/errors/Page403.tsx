import * as React from 'react';
import OGMetaHead from '../OGMetaHead';
import Link from 'next/link';
import {staticUrl} from '../../src/constants/env';
import styled from 'styled-components';
import {heightMixin, fontStyleMixin} from '../../styles/mixins.styles';
import {$WHITE, $POINT_BLUE} from '../../styles/variables.types';

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
    margin-bottom: 30px;

    img {
      display: block;
      margin: auto;
      width: 51px;
      padding-bottom: 14px;

      &.only-mobile {
        display: none;
      }
    }
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

  @media screen and (max-width: 680px) {
    padding: 184px 0 240px;
    height: auto;

    h2 {
      font-size: 17px;

      img {
        padding-bottom: 12px;
      }
    }
  }
`;

const Page403 = () => {
  return (
    <Div>
      <OGMetaHead title="요청하신 페이지에 대한 접근 권한이 없습니다." />
      <h2>
        <img
          src={staticUrl("/static/images/icon/icon-access.png")}
          alt="요청하신 페이지에 대한 접근 권한이 없습니다."
        />
        요청하신 페이지에 대한 접근 권한이 없습니다.
      </h2>
      <Link href="/">
        <a>
          메인페이지로 이동
          <img
            src={staticUrl("/static/images/icon/arrow/icon-mini-shortcuts2.png")}
            alt="메인페이지로 이동"
          />
          <img
            src={staticUrl("/static/images/icon/arrow/icon-blue-shortcuts.png")}
            alt="메인페이지로 이동"
            className="hover"
          />
        </a>
      </Link>
    </Div>
  );
};

export default Page403;
