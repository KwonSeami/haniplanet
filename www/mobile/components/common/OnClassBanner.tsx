import React from 'react';
import styled  from 'styled-components';
import A from '../UI/A';
import {$BORDER_COLOR, $WHITE} from '../../styles/variables.types';
import Button from '../inputs/Button';
import {staticUrl} from '../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../styles/mixins.styles';

const OnClassBannerWrapper = styled.div`
  border-top: 10px solid #f2f5f7;

  .onclass-banner {
    position: relative;
    width: 100%;
    height: 191px;
    padding: 22px 17px 0;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/banner/onclass-banner-bg.png'),
      position: 'right bottom',
      size: '139px'
    })};
    background-color: #14327d;
    box-sizing: border-box;

    h2 {
      ${fontStyleMixin({
        size: 19,
        weight: 'bold',
        color: $WHITE
      })};
    }

    p {
      margin: 12px 0;
      ${fontStyleMixin({
        size: 11,
        weight: '300',
        color: $WHITE
      })};
    }

    button {
      position: absolute;
      bottom: 20px;
      left: 17px;
      width: 122px;
      height: 28px;
      ${fontStyleMixin({
        size: 11,
        color: $WHITE
      })};
      border: 1px solid ${$WHITE};

      img {
        width: 7px;
        margin-left: 3px;
      }
    }
  }

  > a {
    button {
      width: 100%;
      height: 63px;
      font-size: 15px;
      border: 0;
      border-bottom: 1px solid ${$BORDER_COLOR};

      img {
        vertical-align: middle;
        width: 17px;
        margin: -3px 0 0 5px;
      }
    }
  }
  

  @media screen and (min-width: 680px) {
    margin-top: 24px;
    border: 0;

    .onclass-banner {
      padding: 33px 30px 0;
      background-size: 197px;

      p > br:first-child {
        display: none;
      }

      button {
        bottom: 30px;
        left: 30px;
      }
    }

    > a {
      button {
        border: 1px solid ${$BORDER_COLOR};
      }
    }
  }
`;

const OnClassBanner = () => {
  return (
    <OnClassBannerWrapper>
      <div className="onclass-banner">
        <h2>온라인강의 강사신청</h2>
        <p>
          한의플래닛에서는 자신만의 컨텐츠로 <br/>
          온라인강의를 진행하실 수 있는 <br />
          열정적인 강사님을 상시모집하고 있습니다!
        </p>
        <A
          to="https://bit.ly/2VdM1KI"
          newTab
        >
          <button className="pointer">
            강사신청 바로가기
            <img
              src={staticUrl('/static/images/icon/arrow/arrow-white-triangle.png')}
              alt="강사신청 바로가기"
            />
          </button>
        </A>
      </div>
      <A
        to="https://go.aws/3ckdYqt"
        newTab
      >
        <Button
          size={{
            width: '100%',
            height: '63px'
          }}
          border={{
            radius: '0',
            width: '1px',
            color: $BORDER_COLOR
          }}
          font={{
            size: '15px',
          }}
          backgroundColor={$WHITE}
        >
          강의제안서 다운로드
          <img
            src={staticUrl('/static/images/icon/download.png')}
            alt="강의제안서 다운로드"
          />
        </Button>
      </A>
    </OnClassBannerWrapper>
  );
};

OnClassBanner.displayName = 'OnClassBanner';
export default React.memo(OnClassBanner);
