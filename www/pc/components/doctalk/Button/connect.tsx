import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$WHITE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import A from '../../UI/A';

const DoctalkLinkWrapper = styled.div`
  width: 100%;
  height: 65px;
  margin-top: 8px;
  border-radius: 5px;
  background-color: #40b044;
  box-sizing: border-box;

  a {
    display: table;
    width: 100%;

    div {
      display: table-cell;
  
      &.doctalk-explanation {
        position: relative;
        width: 226px;
        padding: 15px 20px;
        box-sizing: border-box;
  
        &::after {
          content: '';
          position: absolute;
          top: 12px;
          right: 0;
          width: 1px;
          height: 42px;
          background-color: #7fc882;
        }
  
        p {
          ${fontStyleMixin({
            size: 12,
            weight: '300',
            color: $WHITE
          })};
      
          span {
            font-weight: bold;
          }
        }
      }
  
      &.doctalk-linked {
        text-align: center;
  
        img {
          width: 13px;
        }
  
        p {
          ${fontStyleMixin({
            size: 12,
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
        <p>연동하기</p>
      </div>
    </A>
  </DoctalkLinkWrapper>
));

DoctalkConnectButton.displayName = 'DoctalkConnectButton';

export default DoctalkConnectButton;
