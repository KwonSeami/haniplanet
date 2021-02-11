import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$WHITE, $POINT_BLUE} from '../../styles/variables.types';
import Link from 'next/link';

const Div = styled.div`
  > div {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 7px 7px 0 0;
    padding: 13px 15px;
    box-sizing: border-box;

    .add-title {
      position: relative;
      display: inline-block;
      width: 98px;
      height: 100%;
      box-sizing: border-box;
      vertical-align: top;
      word-break: keep-all;

      p {
        line-height: 18px;
        ${fontStyleMixin({
          size: 14,
          weight: 'bold',
          color: $WHITE
        })};

        img {
          position: absolute;
          bottom: -15px;
          right: 10px;
          width: 20px;
        }
      }
    }

    .add-explanation {
      display: inline-block;
      width: calc(100% - 113px);
      padding-left: 10px;
      border-left: 1px solid rgba(255, 255, 255, 0.3);
      box-sizing: border-box;
      vertical-align: top;

      p {
        max-width: 201px;
        line-height: 15px;
        ${fontStyleMixin({
          size: 12,
          weight:'600',
          color: $WHITE
        })};

        span {
          background-color: ${$POINT_BLUE};
          margin-right: 3px;
          padding: 0 5px;
          box-sizing: border-box;
          border-radius: 7.5px;
          ${fontStyleMixin({
            size: 10,
            weight: 'bold',
            color: $WHITE
          })};
        }

        small {
          display: inline-block;
          margin-top: 5px;
          opacity: 0.7;
          ${fontStyleMixin({
            size: 10,
            weight: 'normal',
            color: $WHITE
          })};
        }
      }
    }
  }
`;

const HospitalNewBtn = React.memo(() => (
  <Div>
    <Link
      href="/hospital/new"
      as="/hospital/new"
    >
      <div className="pointer">
        <div className="add-title clearfix">
          <p>
            나의 한의원 등록하기
            <img
              src={staticUrl('/static/images/icon/arrow/icon-new-hospital-shortcut.png')}
              alt="나의 한의원 등록하기"
            />
          </p>
        </div>
        <div className="add-explanation">
          <p>
            <span>Top</span>구글 검색 상위노출!<br/>
            <small>검색엔진에 최적화 된 한의플래닛에 나의 한의원을 등록해보세요!</small>
          </p>
        </div>
      </div>
    </Link>
  </Div>
));

HospitalNewBtn.displayName = 'HospitalNewBtn';

export default HospitalNewBtn;
