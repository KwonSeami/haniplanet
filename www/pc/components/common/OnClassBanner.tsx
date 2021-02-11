import React from 'react';
import styled from 'styled-components';
import A from '../UI/A';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $WHITE} from '../../styles/variables.types';

const OnClassBannerWrapper = styled.div`
  margin-bottom: 24px;

  .onclass-banner {
    width: 320px;
    height: 300px;
    padding: 29px 28px;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/banner/onclass-banner-bg.png'),
      position: 'right bottom',
      size: '197px'
    })};
    background-color: #14327d;
    box-sizing: border-box;

    h2 {
      ${fontStyleMixin({
        size: 21,
        weight: 'bold',
        color: $WHITE
      })};
    }

    p {
      margin: 6px 0 21px;
      ${fontStyleMixin({
        size: 13,
        weight: '300',
        color: $WHITE
      })};
    }

    button {
      width: 132px;
      height: 38px;
      ${fontStyleMixin({
        size: 13,
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
      border: 1px solid ${$BORDER_COLOR};

      img {
        vertical-align: middle;
        width: 17px;
        margin: -3px 0 0 5px;
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
          한의플래닛에서는 자신만의 컨텐츠로 <br />
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
        <button className="pointer">
          강의제안서 다운로드
          <img
            src={staticUrl('/static/images/icon/download-black.png')}
            alt="강의제안서 다운로드"
            />
        </button>
      </A>
    </OnClassBannerWrapper>
  );
};

OnClassBanner.displayName = 'OnClassBanner';
export default React.memo(OnClassBanner);