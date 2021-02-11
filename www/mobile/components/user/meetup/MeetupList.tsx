import * as React from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Loading from '../../common/Loading';
import MeetupMyActivity from '../../meetup/MeetupMyActivity';
import {makeFeedKey} from '../../../src/lib/feed';
import {fetchFeed} from '../../../src/reducers/feed';
import {pickStorySelector} from "../../../src/reducers/orm/story/selector";
import {numberWithCommas} from '../../../src/lib/numbers';
import Pagination from '../../UI/Pagination';
import NoContentText from '../../NoContent/NoContentText';
import MeetupMyApply from '../../meetup/MeetupMyApply';
import {fetchUserThunk} from '../../../src/reducers/orm/user/thunks';

const MeetupListDiv = styled.div`
  background-color: #f6f7f9;
  overflow: hidden;

  > ul {
    max-width: 680px;
    margin: 0 auto;
    overflow: hidden;
  }

  .no-content {
    max-width: 680px;
    margin: 8px auto 50px;
    padding: 68px 0 71px;

    @media screen and (max-width: 680px) {
      margin-bottom: 0;
    }
  }
`;

const PAGE_SIZE = 20;
const PAGE_GROUP_SIZE = 5;

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
    ({system: {session: {access}}, feed, orm}) => {
      const currentFeed = feed[makeFeedKey(asPath)];

      return {
        access,
        pending: currentFeed ? currentFeed.pending : true,
        currentFeed: currentFeed && {
          ...currentFeed,
          ids: currentFeed.ids.map(storyId => {
            const [id] = storyId.split('-');
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
      ) : (numberWithCommas(currentFeed.count) !== 0? (
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

MeetupList.displayName = 'MeetupList';
export default MeetupList;
