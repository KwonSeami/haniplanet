import * as React from 'react';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import Button from '../../components/inputs/Button';
import Loading from '../../components/common/Loading';
import InfiniteScroll from '../../components/InfiniteScroll/InfiniteScroll';
import useUserRecommend from '../../src/hooks/user/useUserRecommend';
import {staticUrl} from '../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../styles/mixins.styles';
import {$GRAY, $POINT_BLUE, $TEXT_GRAY, $BORDER_COLOR, $WHITE} from '../../styles/variables.types';
import loginRequired from '../../hocs/loginRequired';
import Avatar from '../../components/AvatarDynamic';
import {useDispatch} from 'react-redux';
import {setLayout, clearLayout} from '../../src/reducers/system/style/styleReducer';

const BannerDiv = styled.div`
  height: 280px;
  box-sizing: border-box;
  padding-top: 96px;
  text-align: center;
  position: relative;
  ${backgroundImgMixin({img: '/static/images/banner/img-recommend.png'})}

  & > img {
    width: 65px;
    display: block;
    margin: auto;
    padding-bottom: 16px;
  }

  h2 {
    padding-bottom: 8px;
    ${fontStyleMixin({
      size: 28, 
      weight: '300'
    })}
  }

  p {
    ${fontStyleMixin({
      size: 13, 
      color: $GRAY
    })}
  }

  a {
    display: block;
    position: absolute;
    left: 40px;
    top: 145px;
    ${fontStyleMixin({
      size: 15, 
      color: $GRAY
    })}
    
    img {
      width: 30px;
      display: inline-block;
      vertical-align: middle;
      margin: -5px 11px 0 0;
    }
  }
`;

const MemberWrapDiv = styled.div`
  width: 900px;
  margin: auto;
  padding: 45px 112.5px 0;
  /* padding: 45px 0 38px; */
  position: relative;

  h2 {
    padding-bottom: 38px;
    ${fontStyleMixin({
      size: 18, 
      weight: '300'
    })}

    span {
      ${fontStyleMixin({
        color: $POINT_BLUE, 
        family: 'Montserrat'
      })}
      padding-left: 3px;
      text-decoration: underline;
    }
  }
`;

// const Select = styled.select`
//   position: absolute;
//   right: -2px;
//   top: 37px;
//   width: 150px;
//   height: 42px;
//   box-sizing: border-box;
//   border: 0;
//   border-bottom: 1px solid ${$BORDER_COLOR};
//   appearance: none;
//   font-size: 14px;
//   ${backgroundImgMixin({
//     img: '/static/images/icon/arrow/icon-select.png',
//     size: '19px',
//     position: '100% 50%'
//   })}
//   outline: none;

//   &::-ms-expand {
//     display: none;
//   }
// `;

const RecommendUserLi = styled.li`
  float: left;
  width: 215px;
  height: 135px;
  margin: 0 13px 10px 0;
  box-sizing: border-box;
  padding: 19px 13px 30px;
  position: relative;
  border-top: 1px solid ${$BORDER_COLOR};
  
  &:nth-child(4n) {
    margin-right: 0;
  }
  
  .avatar {
    height: 48px;
    margin: 0 0 -6px;
    
    > div {
      margin: -2px 6px 0 0;
    }
  }

  h3 {
    padding-top: 17px;
    ${fontStyleMixin({
      size: 13,
      weight: '600'
    })}
  }

  p {
    padding-top: 1px;
    ${fontStyleMixin({
      size: 12, 
      color: $TEXT_GRAY
    })}
  }
`;

const StyledInfiniteScroll = styled(InfiniteScroll)`
  padding: 0;
`;

const StyledButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 19px;

  img {
    width: 7px;
    display: inline-block;
    vertical-align: middle;
    margin: -3px 3px 0 0;
  }

  &:hover {
    border-color: ${$GRAY};
  }
`;

const NoContentLi = styled.li`
  padding: 100px 0 268px;
  border-top: 1px solid ${$BORDER_COLOR};
  text-align: center;
  ${fontStyleMixin({
    size: 15,
    color: $TEXT_GRAY
  })}

  img {
    display: block;
    padding-bottom: 9px;
    margin: auto;
    width: 25px;
  }
`;

interface IRecommendUser {
  id: HashId;
  name: string;
  avatar: string;
  is_follow: boolean;
  last_career: string;
  onFollowUser: () => void;
}

const RecommendUser = React.memo<IRecommendUser>(({
  name,
  avatar,
  is_follow,
  last_career,
  onFollowUser,
  id,
}) => (
  <RecommendUserLi>
    <Avatar
      id={id}
      src={avatar}
      size={50}
      userExposeType="real"
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
    >
      <img
        src={staticUrl(is_follow
          ? '/static/images/icon/check/icon-check3.png'
          : '/static/images/icon/check/icon-mini-plus.png',
        )}
        alt="팔로우"
      />
      팔로우
    </StyledButton>
  </RecommendUserLi>
));

const UserRecommendListPC = React.memo(() => {
  const {
    user,
    users,
    rest,
    fetchMore,
    toggleFollowUser,
  } = useUserRecommend();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setLayout({
      background: 'transparent',
      fakeHeight: false,
      position: 'absolute'
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, []);

  if (isEmpty(user)) {
    return null;
  }

  const {id} = user;

  return (
    <section>
      <BannerDiv>
        <img
          src={staticUrl('/static/images/icon/icon-recommend.png')}
          alt="회원님을 위한 추천"
        />
        <h2>
          회원님을 위한 추천
        </h2>
        <p>
          회원님의 프로필 기준으로 추천됩니다. 팔로우 하면, 회원의 게시글을 볼 수 있습니다.
        </p>
        <Link href={`/user/${id}`}>
          <a>
            <img
              src={staticUrl('/static/images/icon/arrow/icon-big-shortcuts.png')}
              alt="MY PAGE"
            />
            MY PAGE
          </a>
        </Link>
      </BannerDiv>
      <MemberWrapDiv>
        <h2>
          추천
          <span>{rest.count}</span>명
        </h2>
        {/* @정윤재: Sorting 기능은 추후 개발될 예정입니다.
          현재는 해당 기능을 사용할 수 없도록 주석 처리합니다.
          <Select>
            <option value="count">추천순</option>
            <option value="name">가나다 순</option>
          </Select>
         */}
        <StyledInfiniteScroll
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
                <RecommendUser
                  key={data.id}
                  onFollowUser={() => {
                    toggleFollowUser(data.id);
                  }}
                  {...data}
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
        </StyledInfiniteScroll>
      </MemberWrapDiv>
    </section>
  );
});

UserRecommendListPC.displayName = 'UserRecommendListPC';
export default loginRequired(UserRecommendListPC);
