import * as React from 'react';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import queryString from 'query-string';
import Router, {useRouter} from 'next/router';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Loading from '../common/Loading';
import Pagination from '../UI/Pagination';
import {makeFeedKey} from '../../src/lib/feed';
import {fetchFeed} from '../../src/reducers/feed';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {pickStorySelector} from '../../src/reducers/orm/story/selector';
import {RootState} from '../../src/reducers';
import {$TEXT_GRAY} from '../../styles/variables.types';

export const NoContentText = styled.p`
  padding: 55px 0 200px;
  /* padding: 55px 0 485px; */
  box-sizing: border-box;
  text-align: center;
  ${fontStyleMixin({size: 14, color: $TEXT_GRAY})}

  img {
    display: block;
    margin: auto;
    width: 25px;
    padding-bottom: 8px;
  }
`;

interface IFeedProps {
  className?: string;
  noContent?: any;
  pageSize?: number;
  pageGroupSize?: number;
  pageQuery?: string;
  fetchURI: string;
  highlightKeyword?: string;
  component: React.ComponentType;
}

const PaginationFeed: React.FC<IFeedProps> = (props) => {
  const {
    className,
    noContent,
    pageSize = 20,
    pageGroupSize = 10,
    pageQuery = 'page',
    fetchURI,
    highlightKeyword,
    component: Comp,
  } = props;
  // Router
  const {pathname, asPath, query} = useRouter();
  const page = Number(query[pageQuery]) || 1;

  const dispatch = useDispatch();
  const {access, pending, currentFeed = {}} = useSelector(
    ({system: {session: {access}}, feed, orm}: RootState) => {
      const currentFeed = feed[makeFeedKey(asPath)];

      return {
        access,
        pending: currentFeed ? currentFeed.pending : true,
        currentFeed: currentFeed && {
          ...currentFeed,
          ids: currentFeed.ids.map(storyId => {
            const [id] = storyId.split('-');

            return {storyId, ...pickStorySelector(id)(orm)};
          }),
        },
      };
    },
    shallowEqual,
  );

  const {
    fetchTime,
    ids: currentFeedIds,
    count: currentFeedCount,
  } = currentFeed;

  React.useEffect(() => {
    const cachedTime = moment.duration(Date.now() - fetchTime).asMinutes();

    if (!!fetchURI && (!fetchTime || cachedTime > 5)) {
      const [url, search] = fetchURI.split('?');
      const {page, ...restQuery} = queryString.parse(search);

      dispatch(fetchFeed({
        access,
        uri: `${url}?${queryString.stringify({
          offset: (page - 1) * pageSize,
          limit: pageSize,
          ...restQuery,
        })}`,
        fetchType: 'overwrite',
        key: makeFeedKey(asPath),
      }));
    }
  }, [fetchTime, fetchURI, access, pageSize, asPath]);

  if (pending) {
    return <Loading />;
  } else if (isEmpty(currentFeedIds)) {
    return noContent || (
      <NoContentText>
        <img
          src={staticUrl('/static/images/icon/icon-no-content.png')}
          alt="작성된 글이 없습니다."
        />
        작성된 글이 없습니다.
      </NoContentText>
    );
  }

  return (
    <section className={className}>
      <ul>
        {currentFeedIds.map((item, idx) => (
          <li
            key={item.storyId}
            className="feed-item"
          >
            <Comp
              {...item}
              highlightKeyword={highlightKeyword}
              index={idx}
              preview
            />
          </li>
        ))}
      </ul>
      <Pagination
        className="pagination"
        currentPage={page}
        totalCount={currentFeedCount}
        pageSize={pageSize}
        pageGroupSize={pageGroupSize}
        onClick={nextPage => Router.push(
          {pathname: location.pathname, query: {...query, page: nextPage}},
          {pathname, query: {...query, page: nextPage}},
          {shallow: true},
        )}
      />
    </section>
  );
};

export default React.memo(PaginationFeed);
