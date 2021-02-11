import React from 'react';
import styled from 'styled-components';
import {radiusMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import Button from '../../inputs/Button/ButtonDynamic';
import {$WHITE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import A from '../../UI/A';

const DoctalkButtonWrapper = styled.div`
  button {
    img {
      width: 10px;
      margin-right: 3px;
    }
  }

  .doctalk-link-btn:hover +.doctalk-tooltip {
    opacity: 1;
    visibility: visible;
  }

  .doctalk-tooltip {
    position: absolute;
    z-index: 1;
    left: -1px;
    bottom: -62px;
    width: 204px;
    padding: 10px 0 10px 14px;
    ${radiusMixin('8px', '#eee')}
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    opaicty: 0;
    visibility: hidden;

    p {
      line-height: 16px;
      opacity: 0.8;
      ${fontStyleMixin({
        size: 11,
        color: '#6b6b6b'
      })};

      span {
        ${fontStyleMixin({
          weight: 'bold',
          color: '#00b42f'
        })};
      }
    }
  }
`;

interface Props {
  text?: string;
  hasTooltip?: boolean;
  className?: string;
}

const DoctalkButton = React.memo<Props>(({
  text = '닥톡 연동하기',
  hasTooltip,
  className
}) => {

  return (
    <DoctalkButtonWrapper className={className}>
      <A
        to="http://bit.ly/38Y8Si4"
        newTab
      >
        <Button
          className="doctalk-link-btn"
          size={{
            width: '94px',
            height: '30px'
          }}
          border={{
            width: '1px',
            radius: '0',
            color: '#00b430'
          }}
          font={{
            size: '11px',
            weight: '600',
            color: $WHITE
          }}
          backgroundColor="#40b044"
        >
          <img
            src={staticUrl('/static/images/icon/icon-doctalk.png')}
            alt="닥톡 아이콘"
          />
          <span>{text}</span>
        </Button>
      </A>
      {hasTooltip && (
        <div className="doctalk-tooltip">
          <p>
            닥톡(doctalk)-<span>NAVER 지식iN</span>&nbsp;<b>한의사</b>로<br/>개인과 한의원을 브랜딩하세요!
          </p>
        </div>
      )}
    </DoctalkButtonWrapper>
  );
});

DoctalkButton.displayName = 'DoctalkButton';

export default DoctalkButton;
