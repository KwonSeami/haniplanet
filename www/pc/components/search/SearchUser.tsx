import * as React from 'react';
import styled from 'styled-components';
import {
  $BORDER_COLOR,
  $WHITE,
  $TEXT_GRAY,
  $POINT_BLUE,
  $GRAY
} from '../../styles/variables.types';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import AdditionalContent from '../layout/AdditionalContent';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import {FeedContentDiv, LeftFeed, FeedTitle} from './styleCompPC';
import Avatar from '../AvatarDynamic';
import Button from '../inputs/Button';
import {useDispatch, useSelector} from 'react-redux';
import {followUser} from '../../src/reducers/orm/user/follow/thunks';
import isEmpty from 'lodash/isEmpty';
import Loading from '../common/Loading';
import SearchApi from '../../src/apis/SearchApi';
import {fetchUserListThunk} from '../../src/reducers/orm/user/thunks';
import {userListSelector} from '../../src/reducers/orm/user/selector';
import isEqual from 'lodash/isEqual';
import {numberWithCommas} from '../../src/lib/numbers';
import SearchRank from './SearchRank';
import {ISearchProps} from '../../src/@types/search';
import SearchNoContentText from './SearchNoContent';

const StyledInfiniteScroll = styled(InfiniteScroll)`
  padding: 0;
`;

const SearchUserLi = styled.li`
  float: left;
  width: 215px;
  height: 135px;
  position: relative;
  margin: 0 17px 10px 0;
  padding: 18px 12px; 
  box-sizing: border-box;
  border-top: 1px solid ${$BORDER_COLOR};

  &:nth-child(3n) {
    margin-right: 0;
  }

  h3 {
    padding-top: 17px;
    ${fontStyleMixin({
      size: 13,
      weight: '600'
    })}
  }

  p {
    padding-top: 2px;
    ${fontStyleMixin({
      size: 12,
      color: $TEXT_GRAY
    })}
  }
`;

const StyledButton = styled(Button)<ISearchUserItem>`
  position: absolute;
  right: -1px;
  top: 18px;

  img {
    width: 7px;
    display: inline-block;
    vertical-align: middle;
    margin: -3px 3px 0 0;
    
    ${({is_follow}) => is_follow && `
      width: 10px;
    `}
  }

  &:hover {
    border-color: ${$GRAY};
  }
`;


export interface ISearchUserItem {
  onFollowUser: () => void;
  avatar: string,
  name: string;
  last_career: string;
  id: HashId;
  is_follow: boolean;
  className?: string;
}

export const SearchUserItem: React.FC<ISearchUserItem> = React.memo(({
  avatar,
  name,
  last_career,
  id,
  is_follow,
  onFollowUser,
  className
}) => (
  <SearchUserLi className={className}>
    <Avatar
      id={id}
      userExposeType="real"
      src={avatar}
      size={50}
    />
    <h3>{name}</h3>
    {last_career && (
      <p>{last_career}</p>
    )}
    <StyledButton
      size={{
        width: '72px',
        height: '24px',
      }}
      border={{
        radius: '0',
        width: '1px',
        color: is_follow ? 'transparent !important' : $BORDER_COLOR,
      }}
      backgroundColor={is_follow && $POINT_BLUE}
      font={{
        size: '11px',
        weight: 'bold',
        color: is_follow && $WHITE,
      }}
      onClick={() => {
        onFollowUser();
      }}
      is_follow={is_follow}
    >
      <img
        src={staticUrl(is_follow
          ? '/static/images/icon/check/icon-check3.png'
          : '/static/images/icon/check/icon-mini-plus.png'
        )}
        alt="팔로우"
      />
      팔로우
    </StyledButton>
  </SearchUserLi>
));

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
      api: new SearchApi(access).user(query),
    }));
  }, [access, query]);
  
  return (
    <FeedContentDiv className="clearfix">
      <LeftFeed>
        {pending ? (
          <Loading/>
        ) : (
          !isEmpty(users) ? (
            <>
              <FeedTitle>
                회원
                <p className="list-conut">
                  {/* TODO: list count 값 넣어주세요. */}
                  <span>{`${numberWithCommas(rest.count)}건`}</span>
                  의 검색결과
                </p>
              </FeedTitle>
              <StyledInfiniteScroll
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
                    <SearchUserItem
                      key={data.id}
                      onFollowUser={() => {
                        dispatch(followUser(data.id));
                      }}
                      {...data}
                    />
                  ))}
                </ul>  
              </StyledInfiniteScroll>
            </>
          ) : (
            <SearchNoContentText/>
          )
        )}
      </LeftFeed>
      <AdditionalContent>
        <SearchRank
          title="인기 검색어"
          api={() => new SearchApi().rank()}
        />
      </AdditionalContent>
    </FeedContentDiv>
  );
};

SearchUser.displayName = 'SearchUser';

export default React.memo(SearchUser);
