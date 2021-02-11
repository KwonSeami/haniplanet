import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import InfiniteScroll from '../../components/InfiniteScroll/InfiniteScroll';
import Loading from '../../components/common/Loading';
import FollowUser from '../../components/user/FollowUser';
import useUserRecommend from '../../src/hooks/user/useUserRecommend';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$GRAY, $WHITE, $POINT_BLUE, $TEXT_GRAY, $BORDER_COLOR} from '../../styles/variables.types';
import loginRequired from '../../hocs/loginRequired';

const Section = styled.section`
  background-color: #f6f7f9;
`;

const MsgText = styled.p`
  padding: 15px;
  ${fontStyleMixin({size: 12, color: $GRAY})}
`;

const MemberWrapDiv = styled.div`
  position: relative;
  background-color: ${$WHITE};
  padding-bottom: 157px;
`;

const MemberTitle = styled.h2`
  padding: 12px 15px;
  letter-spacing: -2px;
  ${fontStyleMixin({size: 18, weight: '300'})}

  span {
    ${fontStyleMixin({color: $POINT_BLUE, family: 'Montserrat'})}
  }
`;

const NoContentLi = styled.li`
  border-top: 1px solid ${$BORDER_COLOR};
  text-align: center;
  padding: 100px 0 268px;
  ${fontStyleMixin({size: 15, color: $TEXT_GRAY})}

  img {
    display: block;
    padding-bottom: 9px;
    margin: auto;
    width: 25px;
  }
`;

const UserRecommendListMobile = React.memo(() => {
  const {
    user,
    users,
    rest,
    fetchMore,
    toggleFollowUser,
  } = useUserRecommend();

  if (isEmpty(user)) {
    return null;
  }

  const {id} = user;

  return (
    <Section>
      <MsgText>
        회원님의 프로필 기준으로 추천됩니다. 팔로우 하면, 회원의 게시글을 볼 수 있습니다.
      </MsgText>
      <MemberWrapDiv>
        <MemberTitle>
          추천&nbsp;
          <span>{rest.count}</span>
        </MemberTitle>
        {/* @정윤재: Sorting 기능은 추후 개발될 예정입니다.
          현재는 해당 기능을 사용할 수 없도록 주석 처리합니다.
          <SelectUl>
            <li className="on">추천순</li>
            <li>이름가나다순</li>
          </SelectUl>
         */}
        <InfiniteScroll
          loader={<Loading/>}
          hasMore={rest.next}
          loadMore={() => {
            fetchMore(rest.next);
          }}
          threshold="-250px"
        >
          <ul className="clearfix">
            {!isEmpty(users) ? (
              users.map(data => (
                <FollowUser
                  key={data.id}
                  {...data}
                  myId={id}
                  onClick={() => {
                    toggleFollowUser(data.id);
                  }}
                />
              ))
            ) : (
              <NoContentLi>
                <img
                  src={staticUrl('/static/images/icon/icon-no-content.png')}
                  alt="현재 추천회원이 없습니다."
                />
                현재 추천회원이 없습니다.
              </NoContentLi>
            )}
          </ul>
        </InfiniteScroll>
      </MemberWrapDiv>
    </Section>
  );
});

UserRecommendListMobile.displayName = 'UserRecommendListMobile';
export default loginRequired(UserRecommendListMobile);
