import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$FONT_COLOR, $WHITE} from '../../styles/variables.types';


const EditorAnonAlarmWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: -100%;
  width: auto;
  transform: translate(-50%,-50%);
  padding: 10px 28px 18px;
  text-align: center;
  border-radius: 10px;
  background-color: ${$FONT_COLOR};
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1;

  &.on {
    left: 50%;
    opacity: 1;
  }

  img {
    width: 13px;
    height: 13px;
  }

  p {
    line-height: 17px;
    white-space: nowrap;
    ${fontStyleMixin({
  size: 14,
  color: $WHITE
})}
  }
`;

const EditorAnonAlarm = () => (
  <EditorAnonAlarmWrapper>
    <img
      src={staticUrl('/static/images/icon/icon-cautiion.png')}
      alt="알림"
    />
    <p>익명의 글 작성 시,<br/> 수정/삭제가 불가능합니다.</p>
  </EditorAnonAlarmWrapper>
);

export default EditorAnonAlarm;
