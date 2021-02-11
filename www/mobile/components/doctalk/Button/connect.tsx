import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$WHITE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import A from '../../UI/A';

const DoctalkLinkWrapper = styled.div`
  width: 100%;
  max-width: 680px;
  height: 65px;
  margin: 8px auto 0;
  border-radius: 5px;
  background-color: #40b044;

  a {
    height: 100%;
    display: flex;
    align-items: center;

    div {
      box-sizing: border-box;

      &.doctalk-explanation {
        width: calc(100% - 106px);
        padding: 17px 15px;
  
        p {
          ${fontStyleMixin({
            size: 11,
            weight: '300',
            color: $WHITE
          })};
      
          span {
            font-weight: bold;
          }
        }
      }
  
      &.doctalk-linked {
        position: relative;
        width: 106px;
        text-align: center;

        &::before {
          content: '';
          position: absolute;
          top: -11px;
          left: 0;
          width: 1px;
          height: 42px;
          background-color: #7fc882;
        }
  
        img {
          width: 13px;
          margin: -2px 4px 0 0;
          vertical-align: middle;
        }
  
        span {
          ${fontStyleMixin({
            size: 13,
            weight: 'bold',
            color: $WHITE
          })};
        }
      }
    }
  }
`;

const DoctalkConnectButton = React.memo(() => (
  <DoctalkLinkWrapper className="pointer">
    <A
      to="http://bit.ly/38Y8Si4"
      newTab
    >
      <div className="doctalk-explanation">
        <p>
          닥톡(doctalk)-<span>NAVER 지식iN 한의사</span>로 개인과 한의원을 브랜딩하세요!
        </p>
      </div>
      <div className="doctalk-linked">
        <img
          src={staticUrl('/static/images/icon/icon-doctalk.png')}
          alt="닥톡 아이콘"
        />
        <span>연동하기</span>
      </div>
    </A>
  </DoctalkLinkWrapper>
));

DoctalkConnectButton.displayName = 'DoctalkConnectButton';
export default DoctalkConnectButton;
