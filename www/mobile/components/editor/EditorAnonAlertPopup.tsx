import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import {useGlobalState} from './editorState';

const PopupWrapper = styled.div<{height: number}>`
  height: ${({height}) => height}px;
  width: 100%;
  opacity: 0;
  padding: 0 auto;
  position: fixed;
  top: 0;
  left: 0;
  
  &.ease-in {
    opacity: 1;
    transition: 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  &.ease-out {
    opacity: 0;
    transition: 400ms cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  
  div {
    background: #333;
    border-radius: 10px;
    box-shadow: 0 2px 6px 0 #ddd;
    box-sizing: border-box;
    height: 80px;
    width: 210px;
    line-height: 17px;
    padding: 10px 28px 18px;
    position: relative;
    text-align: center;
    top: ${({height}) => height/2}px;
    transform: translateY(-50%);
    left: calc(50% - 105px);
    
    & > img {
      display: inline-block;
      height: 13px;
      width: 13px;
    }
    
    & > p {
      color: #fff;
      font-size: 14px;
      text-align: center;
    }
  }
`;

const EditorAnonAlertPopup: React.FC = (() => {
  // State
  const [pop, setPop] = React.useState(false);
  const [ease, setEase] = React.useState();
  
  // Editor State
  const [user_expose_type] = useGlobalState('user_expose_type');
  
  React.useEffect(() => {
    if (user_expose_type === 'anon') {
      setPop(true);
      // setEase('ease-in');
      
      setTimeout(() => {
        setEase('ease-in');
      }, 400);
      
      setTimeout(() => {
        setEase('ease-out');
      }, 1600);

      setTimeout(() => {
        setPop(false);
        setEase();
      }, 2000);
    }
  }, [user_expose_type]);
  
  return pop && (
    <PopupWrapper
      className={cn(ease)}
      height={window.innerHeight}
    >
      <div>
        <img alt="주의" src={staticUrl('/static/images/icon/icon-gray-caution.png')}/>
        <p>
          익명의 글 작성 시,<br />
          수정/삭제가 불가능합니다.
        </p>
      </div>
    </PopupWrapper>
  );
});

export default EditorAnonAlertPopup;
