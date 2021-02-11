import * as React from 'react';
import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import {fetchFeed} from '../../src/reducers/feed';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import Loading from '../common/Loading';
import {$TEXT_GRAY} from '../../styles/variables.types';
import {fontStyleMixin,} from '../../styles/mixins.styles';
import isEmpty from 'lodash/isEmpty';
import {staticUrl} from '../../src/constants/env';
import {makeFeedKey} from '../../src/lib/feed';
import usePrevious from '../../src/hooks/usePrevious';
import {useRouter} from 'next/router';
import useMapStateToProps from '../../src/hooks/feed/useMapStateToProps';

export const NoContentText = styled.p`
  padding: 55px 0 485px;
  box-sizing: border-box;
  text-align: center;
  ${fontStyleMixin({
    size: 14,
    color: $TEXT_GRAY,
  })}

  img {
    display: block;
    margin: auto;
    width: 25px;
    padding-bottom: 8px;
  }
`;

type TFetchType = 'append' | 'overwrite';

interface IFeedProps {
  fetchURI: string;
  component: React.ComponentType;
  className?: string;
  noContent?: React.ReactNode | React.ComponentType;
  fetchType?: TFetchType;
  highlightKeyword?: string;
  noLastReadText?: boolean;
  passProps?: Indexable;
}

const Feed = React.memo<IFeedProps>(
  (props) => {
    const {
      className,
      fetchURI,
      noContent,
      highlightKeyword,
      component: Comp,
      passProps = {}
    } = props;
    const prevFetchURI = usePrevious(fetchURI);
    const {access, pending, currentFeed} = useMapStateToProps();
    const router = useRouter();
    const {asPath} = router;
    const dispatch = useDispatch();

    const handleFetch = () => {
      const nextFeed = currentFeed.next;

      if (nextFeed !== null && nextFeed !== undefined) {
        dispatch(fetchFeed({uri: nextFeed, key: makeFeedKey(asPath), access}));
      }
    };

    React.useEffect(() => {
      if ((!prevFetchURI && fetchURI) || (prevFetchURI && prevFetchURI !== fetchURI)) {
        // Component Did Mount 상태일 때를 제외하고 fetchURI가 변경되었을 때 실행
        dispatch(fetchFeed({uri: fetchURI, key: makeFeedKey(asPath), access, fetchType: 'overwrite'}));
      }
    }, [fetchURI, asPath, access]);

    return (
      <section className={className}>
        {(!isEmpty(currentFeed) && !isEmpty(currentFeed.ids)) ? (
          <>
            <InfiniteScroll
              loader={<Loading/>}
              hasMore={currentFeed && currentFeed.next}
              loadMore={handleFetch}
              threshold="-350px"
            >
              <ul>
                {currentFeed.ids.map((item, idx) => {
                  if (isEmpty(item)) { return null; }
                  const {storyId} = item;

                  return (
                    <li
                      key={storyId}
                    >
                      <Comp
                        {...item}
                        highlightKeyword={highlightKeyword}
                        {...passProps}
                        index={idx}
                        preview
                      />
                    </li>
                  );
                })}
              </ul>
            </InfiniteScroll>
          </>
        ) : pending ? (
          <Loading/>
        ) : (
          noContent || (
            <NoContentText>
              <img
                src={staticUrl('/static/images/icon/icon-no-content.png')}
                alt="작성된 글이 없습니다."
              />
              작성된 글이 없습니다.
            </NoContentText>
          )
        )}
      </section>
    );
  }
);

Feed.displayName = 'Feed';
export default Feed;
