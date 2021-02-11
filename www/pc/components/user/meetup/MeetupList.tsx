import * as React from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import MeetupMyActivity from './MeetupMyActivity';
import Loading from '../../common/Loading';
import Pagination from '../../UI/Pagination';
import {makeFeedKey} from '../../../src/lib/feed';
import NoContentText from '../../NoContent/NoContentText';
import {fetchFeed} from '../../../src/reducers/feed';
import {numberWithCommas} from '../../../src/lib/numbers';
import {pickStorySelector} from "../../../src/reducers/orm/story/selector";
import {RootState} from "../../../src/reducers";
import MeetupMyApply from './MeetupMyApply';

const MeetupListDiv = styled.div`
  .pagination {
    margin: 50px auto 100px;
  }

  .no-content {
    padding: 68px 0;
  }
`;

const PAGE_SIZE = 20;
const PAGE_GROUP_SIZE = 10;

interface Props {
  fetchURI: string;
  currentPage: number;
  handleChangePage: (page: number) => void;
}

const MeetupList = React.memo<Props>(({
  fetchURI,
  currentPage,
  handleChangePage,
}) => {
  // Router
  const router = useRouter();
  const {asPath, query: {page_type}} = router;

  // Redux
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
            const [id, ..._] = storyId.split('-');
            return {...pickStorySelector(id)(orm), storyId};
          }).filter(item => !!item.id),
        },
      };
    },
    shallowEqual
  );
  React.useEffect(() => {
    dispatch(fetchFeed({
      access,
      uri: fetchURI,
      fetchType: 'overwrite',
      key: makeFeedKey(asPath),
    }));
  }, [access, fetchURI, asPath]);

  return (
    <MeetupListDiv>
      {pending ? (
        <Loading />
      ) : (numberWithCommas(currentFeed.count) !== 0 ? (
        <>
          <ul>
            {(currentFeed.ids || []).map((item) => (
              page_type === 'applied'
                ? <MeetupMyApply
                    key={`meetup-item-${item.id}`}
                    {...item}
                  />
                : <MeetupMyActivity
                    key={`meetup-item-${item.id}`}
                    {...item}
                  />
            ))}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalCount={currentFeed.count}
            pageSize={PAGE_SIZE}
            pageGroupSize={PAGE_GROUP_SIZE}
            onClick={handleChangePage}
          />
        </>
      ) : (
        <NoContentText>
          <p>해당 정보가 없습니다.</p>
        </NoContentText>
        )
      )}
    </MeetupListDiv>
  );
});

export default MeetupList;
