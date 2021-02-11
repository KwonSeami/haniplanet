import * as React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {userListSelector} from '../../src/reducers/orm/user/selector';
import {fetchUserListThunk} from '../../src/reducers/orm/user/thunks';
import {followUser} from '../../src/reducers/orm/user/follow/thunks';
import SearchApi from '../../src/apis/SearchApi';
import SearchTab from './SearchTab';
import {SearchTopWrapperDiv, SearchContentDiv, SearchTitle} from './index';
import FollowUser from '../user/FollowUser';
import Loading from '../common/Loading';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import {numberWithCommas} from '../../src/lib/numbers';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import {ISearchProps} from '../../src/@types/search';
import SearchNoContentText from './SearchNoContent';

const Div = styled.div`
  padding-bottom: 50px;
`;
const SearchUser: React.FC<ISearchProps> = ({query}) => {
  const dispatch = useDispatch();

  const {
    userList: [users, rest, pending],
    system: {session: {access}}
  } = useSelector(
    ({system, orm}) => ({
      userList: userListSelector('searched')(orm),
      system
    }),
    (prev, curr) => isEqual(prev, curr)
  );

  React.useEffect(() => {
    dispatch(fetchUserListThunk({
      listKey: 'searched',
      api: new SearchApi(access).user(query)
    }));
  }, [access, query]);

  return (
    <SearchContentDiv>
      <SearchTopWrapperDiv>
        <SearchTab/>
        <div className="count">
          <p>
            <span>{numberWithCommas(rest.count)}건</span>
            의 검색결과
          </p>
        </div>
      </SearchTopWrapperDiv>
      {pending ? (
        <Loading/>
      ) : (
        !isEmpty(users) ? (
          <Div>
            <SearchTitle>회원</SearchTitle>
            <InfiniteScroll
              loader={<Loading/>}
              hasMore={rest.next !== null}
              loadMore={() => {
                dispatch(fetchUserListThunk({
                  listKey: 'searched',
                  next: rest.next
                }));
              }}
              threshold="-250px"
            >
              <ul className="clearfix">
                {users.map(data => (
                  <FollowUser
                    key={data.id}
                    onClick={() => {
                      dispatch(followUser(data.id));
                    }}
                    {...data}
                  />
                ))}
              </ul>
            </InfiniteScroll>
          </Div>
        ) : (
          <SearchNoContentText/>
        )
      )}
    </SearchContentDiv>
  );
};

SearchUser.displayName = 'SearchUser';

export default React.memo(SearchUser);
