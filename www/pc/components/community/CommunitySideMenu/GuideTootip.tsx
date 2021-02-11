import React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../../src/constants/env';
import {$WHITE} from '../../../styles/variables.types';
import Link from 'next/link';

const Div = styled.div`
  position: fixed;
  top: 133px;
  left: 256px;
  transition: all 0.3s;

  > img {
    width: 34px;
    margin-right: 10px;
    cursor: pointer;
  }

  > div {
    position: absolute;
    top: -4px;
    left: 40px;
    width: 190px;
    height: 58px;
    border-radius: 8px;
    border: 1px solid #979797;
    background-color: ${$WHITE};
    box-sizing: border-box;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;

    p {
      padding: 10px 14px;
      font-size: 12px;
    }

    img {
      position: absolute;
      right: 10px;
      width: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  &:hover {
    > div {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const GuideTooTip = () => {

  return (
    <Div className="tootip">
      <img
        src={staticUrl('/static/images/icon/icon-community-guide-tootip.png')}
        alt="가이드 툴팁"
        />
      <div>
        <Link href="/community/rktyPO">
          <a>
            <p>
              무엇이 바뀌었을까요?<br/>
              커뮤니티 가이드를 봐주세요!
            </p>
            <img
              src={staticUrl('/static/images/icon/arrow/icon-gray-left-arrow.png')}
              alt="가이드 보러가기"
            />
          </a>
        </Link>
      </div>
    </Div>
  )
}

GuideTooTip.displayName = 'GuideTooTip';

export default React.memo(GuideTooTip);