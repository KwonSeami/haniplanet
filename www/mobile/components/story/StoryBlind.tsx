import * as React from 'react';
import styled from 'styled-components';
import { fontStyleMixin } from '../../styles/mixins.styles';
import { $TEXT_GRAY } from '../../styles/variables.types';
import { staticUrl } from '../../src/constants/env';

export const BlindDiv = styled.div`
  padding: 43px 0 37px 0;
  text-align: center;

  div {

    img {
      width: 25px;
      height: 21px;
    }
    
    p {
      margin-top: 5px;
      ${fontStyleMixin({
        size: 14,
        color: $TEXT_GRAY
      })}
    }
  }
`;

const blindReasonText = (blindReason) => {
  switch(blindReason){
    case 'privy':
      return `당사자 요청에 의해 블라인드 처리된 글입니다.`;
    case 'reported':
      return `신고 누적 3건으로, 블라인드 처리된 글입니다.`;
    case 'admin':
      return `관리자에 의해 블라인드 처리된 글입니다.`;
    default:
      return `블라인드 처리된 글입니다.`;
  }
};

export const StoryBlind = React.memo(({reason}) => {
  return (
    <BlindDiv>
      {/* ↓ 관리자에 의해 블라인드 처리됐을 경우 구문 */}
      <div>
        <img
          src={staticUrl('/static/images/icon/icon-no-content.png')}
          alt="블라인드"
        />
        <p>
          {blindReasonText(reason)}
        </p>
      </div>
    </BlindDiv>
  )
});

StoryBlind.displayName = 'StoryBlind';
