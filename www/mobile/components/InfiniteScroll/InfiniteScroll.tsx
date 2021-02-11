import * as React from 'react';
import {Waypoint} from 'react-waypoint';
import styled from 'styled-components';
import Loading from "../common/Loading";

interface InfiniteScrollProps {
  loadMore: () => void;
  threshold?: string;
  hasMore: boolean;
  loader: React.ReactNode;
  children: any;
  className?: string;
  scrollableAncestor?: any;
}

export const InfiniteScrollDiv = styled.div`
  /* padding-top: -36px; */
`;

const InfiniteScroll = React.memo<InfiniteScrollProps>(
  (
    {
      loadMore,
      threshold,
      hasMore,
      loader,
      children,
      className,
      scrollableAncestor = window,
    }) => (
    <InfiniteScrollDiv className={className}>
      {children}
      {hasMore && (
        <Waypoint
          onEnter={loadMore}
          bottomOffset={threshold}
          scrollableAncestor={scrollableAncestor}
        >
          <div>
            {loader}
          </div>
        </Waypoint>
      )}
    </InfiniteScrollDiv>
  )
);

const LoaderWrapper = styled.div`
  text-align: center;
  
  
  p {
    font-weight: 500;
    font-size: 20px;
    color: #666;
    text-align: center;
  }
`;

export const InfiniteScrollLoader = React.memo<{onClick: React.MouseEventHandler}>(({onClick}) => {
  return (
    <LoaderWrapper onClick={e => onClick && onClick(e)}>
      <Loading />
    </LoaderWrapper>
  )
});

export default InfiniteScroll;
