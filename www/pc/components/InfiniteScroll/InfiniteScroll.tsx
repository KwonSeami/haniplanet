import * as React from 'react';
import {Waypoint} from 'react-waypoint';
import styled from 'styled-components';

interface InfiniteScrollProps {
  loadMore: () => void;
  threshold?: string;
  hasMore: boolean;
  loader: React.ReactNode;
  children: any;
  className?: string;
  loaderPosition?: 'top' | 'bottom';
  ref?: React.Ref<HTMLDivElement>;
}

export const InfiniteScrollDiv = styled.div`
  padding-top: 35px;
`;

const WaypointLoader = React.memo<
  Pick<InfiniteScrollProps, 'loadMore' | 'threshold' | 'loader'>
>(({
  loadMore,
  threshold,
  loader
}) => (
  <Waypoint
    onEnter={loadMore}
    bottomOffset={threshold}
  >
    {loader}
  </Waypoint>
));

const InfiniteScroll = React.memo<InfiniteScrollProps>(
  React.forwardRef(({
    loadMore,
    threshold,
    hasMore,
    loader,
    children,
    className,
    loaderPosition = 'bottom'
  }, ref) => (
    <InfiniteScrollDiv
      className={className}
      ref={ref}
    >
      {(loaderPosition === 'top' && hasMore) && (
        <WaypointLoader
          loadMore={loadMore}
          threshold={threshold}
          loader={loader}
        />
      )}
      {children}
      {(loaderPosition === 'bottom' && hasMore) && (
        <WaypointLoader
          loadMore={loadMore}
          threshold={threshold}
          loader={loader}
        />
      )}
    </InfiniteScrollDiv>
  ))
);

export default InfiniteScroll;
