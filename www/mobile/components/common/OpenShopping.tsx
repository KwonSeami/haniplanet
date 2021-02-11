import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import OGMetaHead from '../OGMetaHead';
import {staticUrl} from '../../src/constants/env';
import {heightMixin, fontStyleMixin} from '../../styles/mixins.styles';
import {$WHITE} from '../../styles/variables.types';

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
      width: 51px;
      padding-bottom: 13px;
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

const OpenShopping = () => {
  return (
    <Div>
      <OGMetaHead title="조금만 기다려주세요." />
      <h2>
        <img
          src={staticUrl('/static/images/icon/icon-access.png')}
          alt=""
        />
        조금만 기다려주세요 : )
      </h2>
      <p>
        모바일에서는 플래닛마켓이 접속되지 않으며,<br/>
        현재 PC버전에서만 이용하실 수 있습니다.<br/>
        <br/>
        이 점 참고하시어 이용해주시길 바랍니다.<br/>
        감사합니다.
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

export default OpenShopping;
