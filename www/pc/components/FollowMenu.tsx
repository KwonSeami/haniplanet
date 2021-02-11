import * as React from 'react';
import cn from 'classnames';
import throttle from 'lodash/throttle';
import styled from 'styled-components';
import {Waypoint} from 'react-waypoint';

interface IProps {
  menuCompFn: () => React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

interface FollowMenuWrapperProps {
  top?: number;
  right?: number;
}

const FollowMenuWrapper = styled.div<FollowMenuWrapperProps>`
  position: relative;

  .follow {
    &-container {
      position: absolute;
      top: ${({top}) => top}px;
      right: ${({right}) => right}px;
      height: 100%;
    }
    &-menu {
      position: fixed;
      
      &.bottom {
        position: absolute;
        bottom: 0;
      }
    }
  }
`;

function useWindowSize() {
  const getSize = React.useCallback(() => ({
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined
  }), []);

  const [windowSize, setWindowSize] = React.useState(getSize());
  const isClient = React.useMemo(() => typeof window === 'object', []);

  React.useEffect(() => {
    if (isClient) {
      const handleWindowResize = throttle(() => {
        setWindowSize(getSize());
      }, 300);

      window.addEventListener('resize', handleWindowResize);
      return () => window.removeEventListener('resize', handleWindowResize);
    }
  }, [getSize]);

  return windowSize;
}

const FollowMenu: React.FC<IProps> = ({
  menuCompFn,
  className = '',
  children,
  ...rest
}) => {
  const [isFollow, setIsFollow] = React.useState(true);
  const [bottonOffset, setBottomOffset] = React.useState(0);
  const ref = React.useRef(null);
  const {current: refCurrent} = ref;

  const {height: windowHeight} = useWindowSize();
  const component = menuCompFn();

  const onEnterWaypoint = React.useCallback(() => setIsFollow(false), []);
  const onLeaveWaypoint = React.useCallback(({currentPosition}) => {
    if (currentPosition === 'below') {
      setIsFollow(true);
    }
  }, []);
  
  React.useEffect(() => {
    if (refCurrent) {
      const {offsetTop, clientHeight} = refCurrent;
      setBottomOffset(windowHeight - (offsetTop + clientHeight));
    }
  },[refCurrent, windowHeight])

  return (
    <FollowMenuWrapper
      className="follow-wrapper"
      {...rest}
    >
      {children}
      <div className={`follow-container ${className}`}>
        <div 
          ref={ref}
          className={cn('follow-menu', {bottom: !isFollow})}
        >
          {component}
        </div>
      </div>
      <Waypoint
        onEnter={onEnterWaypoint}
        onLeave={onLeaveWaypoint}
        bottomOffset={`${bottonOffset}px`}
      />
    </FollowMenuWrapper>
  )
};

export default React.memo(FollowMenu);