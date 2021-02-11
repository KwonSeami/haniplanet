import * as React from 'react';
import {PopupProps} from '../common/popup/base/Popup';
import styled from 'styled-components';
import TitlePopup, {TitleDiv} from '../common/popup/base/TitlePopup';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $TEXT_GRAY} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import Loading from '../common/Loading';
import {isEmpty} from 'lodash';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {fetchUserFollower, fetchUserFollowing, followUser} from '../../src/reducers/orm/user/follow/thunks';
import {userFollowerSelector, userFollowingSelector} from '../../src/reducers/orm/user/follow/selector';
import FollowUser from './FollowUser';
import {RootState} from '../../src/reducers';

const StyledTitlePopup = styled(TitlePopup)`
  .modal-body {
    width: 390px;
    top: 0 !important;
    margin-top: 10%;
    padding-bottom: 40px;

    ${TitleDiv} h2 {
      position: relative;
      padding: 8px 0 9px 37px;
      ${fontStyleMixin({
        size: 15,
        weight: 'bold',
      })}

      span {
        padding-left: 2px;
        ${fontStyleMixin({
          weight: 'bold',
          color: $POINT_BLUE,
        })}
      }

      &::after {
        content: '';
        position: absolute;
        top: 15px;
        left: 20px;
        width: 11px;
        height: 5px;
        background-color: ${$FONT_COLOR};
      }
    }
  }
`;

const StyledInfiniteScroll = styled(InfiniteScroll)`
  padding: 0;
`;

const FollowPopupUl = styled.ul`
  max-height: 615px;
  padding: 3px 15px 0;
  overflow-y: auto;
  border-bottom: 1px solid ${$BORDER_COLOR};

  li {
    position: relative;
    height: 60px;
    padding: 10px 15px 12px;
    box-sizing: border-box;

    &:last-child {
      border-bottom: 0;
    }

    .avatar {
      display: table-cell;
      vertical-align: middle;
      width: 48px;
    }

    .user-info {
      display: table-cell;
      vertical-align: middle;
    
      h2 {
        padding-bottom: 3px;
        ${fontStyleMixin({
  size: 13,
  weight: '600',
})}
      }

      p {
        ${fontStyleMixin({
  size: 12,
  color: $TEXT_GRAY,
})}
      }
    }
  }
`;


const NoContentDiv = styled.div`
  height: 395px;
  text-align: center;
  box-sizing: border-box;
  padding-top: 100px;
  border-bottom: 1px solid ${$BORDER_COLOR};

  img {
    display: block;
    margin: auto;
    width: 80px;
  }

  p {
    padding-top: 7px;
    ${fontStyleMixin({
  size: 14,
  color: $TEXT_GRAY,
})}
  }
`;

const FOLLOW_TYPE_TO_KOR = {
  follower: '팔로워',
  following: '팔로우',
};

const FollowPopup = React.memo<any>(({id, closePop, type, userPk}) => {
  // Redux
  const dispatch = useDispatch();
  const {rest, users, myId} = useSelector(
    ({orm, system: {session: {id: myId}}}: RootState) => {
      const [users, rest] = type === 'follower'
        ? userFollowerSelector(userPk)(orm)
        : userFollowingSelector(userPk)(orm);
      return {users, rest, myId};
    },
    shallowEqual,
  );

  // Data Fetch
  React.useEffect(() => {
    dispatch((type === 'follower' ? fetchUserFollower : fetchUserFollowing)(userPk));
  }, [type, userPk]);

  const isMe = myId === userPk;

  return (
    <StyledTitlePopup
      id={id}
      closePop={closePop}
      title={
        <>
          {FOLLOW_TYPE_TO_KOR[type]}
          <span>{rest.count}</span>
        </>
      }
    >
      {!isEmpty(users) ? (
        <FollowPopupUl>
          <StyledInfiniteScroll
            loader={<Loading/>}
            hasMore={rest.next}
            loadMore={() => {
              dispatch(
                (type === 'follower'
                  ? fetchUserFollower
                  : fetchUserFollowing
                )(userPk, rest.next),
              );
            }}
            threshold="-150px"
          >
            {users.map(user => (
              <FollowUser
                key={user.id}
                onClick={() => dispatch(followUser(user.id))}
                myId={myId}
                {...user}
              />
            ))}
          </StyledInfiniteScroll>
        </FollowPopupUl>
      ) : (
        /*
          @진혜연: 팔로우/팔로잉 하는 사람이 아무도 없을 때의 디자인이 없어 가진님께 요청드린 상황입니다!
          디자인이 완료되면 스타일 작업 부탁드리겠습니다~
        */
        <NoContentDiv>
          <img
            src={staticUrl('/static/images/icon/icon-no-follow.png')}
            alt="팔로우가 없습니다."
          />
          <p>
            {type === 'follower' ? (
              <>{isMe && '나를'} 팔로우 하는 회원이 없습니다.</>
            ) : (
              isMe ? (
                <>
                  팔로우 하는 회원이 없습니다.<br/>
                  추천 회원을 팔로우 해보세요!
                </>
              ) : (
                '팔로우 하는 회원이 없습니다.'
              )
            )}
          </p>
        </NoContentDiv>
      )}
    </StyledTitlePopup>
  );
});
FollowPopup.displayName = 'FollowPopup';

export default FollowPopup;
