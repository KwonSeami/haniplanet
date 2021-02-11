import {staticUrl} from '../../src/constants/env';
import * as React from 'react';
import styled from 'styled-components';
import {$WHITE} from '../../styles/variables.types';
import {fontStyleMixin, radiusMixin} from '../../styles/mixins.styles';
import {toastAlarmOpacity} from '../../styles/StyledToastRendererLi';

const StyledTagAlertLi = styled.li`
  height: 32px;
  background-color: ${$WHITE};
  
  padding: 0 14px;
  margin-left: 7px;
  box-shadow: 1px 1px 9px -1px rgba(99, 99, 99, 0.2);
  transition: background-color 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  animation: 2s ${toastAlarmOpacity} ease-in-out;
  opacity: 0;
  
  ${radiusMixin('19px', $WHITE)};

  ${fontStyleMixin({
    size: 13,
    weight: 'bold',
  })};
  
  img {
    width: 18px;
    vertical-align: middle;
    margin: 0 0 4px;
  }
`;

interface ITagFollowToastProps {
  is_follow: boolean,
  name: string,
  id: string,
}
const TagFollowToast = React.memo<ITagFollowToastProps>((payload) => {
  const {is_follow, name} = payload || {};

  return (
    <StyledTagAlertLi>
      {is_follow
        ? <>
            <img
              src={staticUrl('/static/images/icon/check/icon-check-disabled2.png')}
              alt="팔로우 취소"
            />
            {name} 태그 팔로우를 <span className='alert-span'>취소</span>하였습니다.
          </>
        : <>
            <img
              src={staticUrl('/static/images/icon/check/icon-check-blue2.png')}
              alt="팔로우"
            />
            {name} 태그를 <span className='alert-span'>팔로우</span> 하였습니다.
          </>
      }
    </StyledTagAlertLi>
  )
});

export default TagFollowToast;