import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import Link from 'next/link';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {$WHITE, $POINT_BLUE} from '../../styles/variables.types';
import {useRouter} from 'next/router';
import OGMetaHead from "../OGMetaHead";

const Div = styled.div`
  width: 100%;
  height: 100%;
  padding: 355px 0;
  box-sizing: border-box;
  text-align: center;
  background-color: #f6f7f9;

  h2 {
    padding-bottom: 30px;
    font-size: 19px;
    letter-spacing: -1.5px;

    img {
      display: block;
      margin: auto;
      width: 51px;
      padding-bottom: 13px;
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
`;

const Page401 = React.memo(() => {
  const {asPath} = useRouter();
  const pathname = asPath.split('?')[0];
  return (
    <Div>
      <OGMetaHead title="로그인 후 이용 가능한 서비스입니다." />
      <h2>
        <img
          src={staticUrl("/static/images/banner/img-error401.png")}
          alt="요청하신 페이지를 찾을 수 없습니다."
        />
        로그인 후 이용 가능한 서비스입니다.</h2>
      <Link href={`/login?next=${pathname}`}>
        <a>
          로그인하기
          <img
            src={staticUrl("/static/images/icon/arrow/icon-mini-shortcuts2.png")}
            alt="로그인하기"
          />
          <img
            src={staticUrl("/static/images/icon/arrow/icon-blue-shortcuts.png")}
            alt="로그인하기"
            className="hover"
          />
        </a>
      </Link>
    </Div>
  );
});

export default Page401;
