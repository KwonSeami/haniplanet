import React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin, radiusMixin} from '../../styles/mixins.styles';
import {$WHITE, $POINT_BLUE} from '../../styles/variables.types';
import Link from 'next/link';

const Div = styled.div`
  padding: 16px;
  ${radiusMixin('8px', $WHITE)};

  .add-title {
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    padding-bottom: 12px;
    margin-bottom: 9px;

    p {
      ${fontStyleMixin({
        size: 15,
        weight: 'bold',
        color: $WHITE
      })};

      img {
        width: 22px;
        height: 22px;
        float: right;
      }
    }
  }

  .add-explanation {
    p {
      line-height: 20px;
      ${fontStyleMixin({
        size: 13,
        weight:'600',
        color: $WHITE
      })};

      span {
        background-color: ${$POINT_BLUE};
        margin-right: 4px;
        padding: 0 5px;
        box-sizing: border-box;
        border-radius: 8px;
        ${fontStyleMixin({
          size: 10,
          weight: 'bold',
          color: $WHITE
        })};
      }

      small {
        opacity: 0.7;
        margin-top: 4px;
        ${fontStyleMixin({
          size: 13,
          weight: 'normal',
          color: $WHITE
        })};
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
