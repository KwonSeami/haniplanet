import * as React from 'react';
import * as queryString from 'query-string';
import Link from 'next/link';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import Button from '../../../components/inputs/Button/ButtonDynamic';
import Label from '../../../components/UI/tag/Label';
import Feed, {NoContentText} from '../../../components/Feed';
import UserCategory from '../../../components/user/UserCategory';
import StoryMobile from '../../../components/story/StoryMobile';
import useLocation from '../../../src/hooks/router/useLocation';
import {fontStyleMixin, backgroundImgMixin, heightMixin} from '../../../styles/mixins.styles';
import {fetchUserThunk} from '../../../src/reducers/orm/user/thunks';
import {followUser} from '../../../src/reducers/orm/user/follow/thunks';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {RootState} from '../../../src/reducers';
import {BASE_URL, staticUrl} from '../../../src/constants/env';
import {USER_TYPE_TO_KOR} from '../../../src/constants/users';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $WHITE, $FLASH_WHITE} from '../../../styles/variables.types';
import loginRequired from '../../../hocs/loginRequired';
import OGMetaHead from "../../../components/OGMetaHead";
import {numberWithCommas} from '../../../src/lib/numbers';
import FeedTheme from '../../../components/Feed/FeedTheme';
import NoSSR from 'react-no-ssr';
import Avatar from '../../../components/Avatar';
import cn from 'classnames';
import DoctalkBadge from '../../../components/doctalk/DoctalkBadge';
import DoctalkButton from '../../../components/doctalk/Button';
import {setLayout, clearLayout} from '../../../src/reducers/system/style/styleReducer';
import {Waypoint} from 'react-waypoint';

const DoctalkLinkWrapper = styled.div`
  width: 100%;
  height: 50px;
  padding: 8px 15px;
  margin: 0 auto;
  background-color: ${$WHITE};
  box-sizing: border-box;
  display: flex;
  align-items: center;

  p {
    display: inline-block;
    width: calc(100% - 130px);
    padding-right: 30px;
    box-sizing: border-box;
    opacity: 0.8;
    ${fontStyleMixin({
      size: 11,
    })};

    span {
      ${fontStyleMixin({
        weight: 'bold',
        color: '#00b42f'
      })};
    }
  }

  button.doctalk-btn {
    width: 130px;
    height: 34px;
    border-radius: 5px;
    background-color: #40b044;

    img {
      width: 57px;
      margin-right: 2px;
    }
  }
`;

const BannerDiv = styled.div`
  width: 100%;
  height: 70px;
  background-color: #f5f7f9;
  box-sizing: border-box;
`;

const StyledLabel = styled(Label)`
  ${heightMixin(22)};
  margin: 4px 0 0 2px;
`;

const MyPageDiv = styled.div`
  margin-top: -69px;
`;

const Buttonli = styled.li`
  display: inline-block;
  vertical-align: middle;
  width: 49.5%;

  &:first-child {
    margin-right: 1%;
  }

  a {
    display: block;
    text-align: center;
    background-color: #f6f7f9;
    ${heightMixin(44)};
    ${fontStyleMixin({size: 14, weight: '600'})}
  }

  img {
    width: 18px;
    display: inline-block;
    vertical-align: middle;
    margin: -2px 2px 0 0;
  }

  &.only-payment-button {
    width: 100%;
    margin: 0;
  }

  @media screen and (max-width: 680px) {
    width: 49%;

    &:first-child {
      margin-right: 2%;
    }
  }
`;

const ProfileDiv = styled.div`
  position: relative;
  margin: auto;
  box-sizing: border-box;

  .profile-follow-list {
    display: table;
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
    padding: 25px 0 0;
    text-align: center;

    li {
      display: table-cell;
      vertical-align: middle;
      width: 78px;
      
      .avatar {
        height: 78px;
    
        & > div {
          margin: auto;
        }
      }

      &.follow-btn {
        position: relative;
        min-width: 78px;
        width: auto;
        margin-top: 12px;
        padding: 0;
        font-size: 11px;
        

        span {
          display: block;
          padding-bottom: 2px;
          letter-spacing: 1px;
          line-height: 39px;
          ${fontStyleMixin({
            size: 36,
            family: 'Montserrat',
            weight: '300'
          })}
        }

        p {
          position: relative;

          &::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: 2px;
            width: 30px;
            height: 1px;
            border-bottom: 1px solid ${$FONT_COLOR};
            margin-left: -15px;
          }
        }
      }
    }
  }

  .profile-wrapper {
    padding-bottom: 15px;
    text-align: center;

    h2 {
      padding: 4px 0 2px;
      ${fontStyleMixin({
        size: 27,
        weight: '300'
      })}
    }

    p {
      ${fontStyleMixin({
        size: 15,
        color: $TEXT_GRAY
      })};
      
      span {
        ${fontStyleMixin({
          size: 15,
          color: $GRAY
        })};
      }
    }

    > span:first-of-type {
      margin-left: 0;
    }

    .doctalk-badge {
      height: 22px;
      margin: 4px 0 0 2px;
      vertical-align: middle;
    }
  }

  .profile-setting {
    position: relative;
    display: block;
    padding: 1px 14px 9px;
    text-align: right;
    max-width: 680px;
    margin: 0 auto;

    ${fontStyleMixin({
      size: 13,
      weight: '600',
      color: $GRAY
    })}

    &::after {
      content: '';
      position: absolute;
      bottom: 11px;
      right: 14px;
      width: 63px;
      height: 1px;
      background-color: ${$FONT_COLOR};
    }

    img {
      width: 12px;
      padding-right: 4px;
      display: inline-block;
      vertical-align: middle;
      margin-top: -2px;
    }
  }

  .my-point {
    padding: 10px 0 12px;
    margin: 0;
    border-top: 1px solid ${$BORDER_COLOR};

    & > div {
      max-width: 680px;
      margin: 0 auto;
      position: relative;

      p {
        position: relative;
        width: calc(100% - 124px);
        box-sizing: border-box;
        padding: 0 5px;
        ${fontStyleMixin({
          size: 25,
          weight: '300',
          color: $POINT_BLUE,
          family: 'Montserrat'
        })}
  
        &::after {
          content: '';
          width: 20px;
          height: 30px;
          position: absolute;
          right: 2px;
          top: 50%;
          margin-top: -16px;
          ${backgroundImgMixin({
            img: staticUrl("/static/images/icon/arrow/icon-gray-shortcut.png"),
            size: '20px 30px'
          })}
        }
  
        span {
          display: block;
          ${fontStyleMixin({
            size: 14,
            weight: '600'
          })}
        }
  
        img {
          width: 15px;
          display: inline-block;
          vertical-align: middle;
          margin: -3px 3px 0 0;
        }
      }
  
      ul {
        position: absolute;
        top: 0;
        right: 5px;
  
        li {
          display: inline-block;
          vertical-align: middle;
  
          &:first-child {
            padding-right: 5px;
          }
        }
      }
    }

    @media screen and (max-width: 680px) {
      margin: 0 15px;
    }
  }

  li.my-page-button {
    border-top: 1px solid ${$BORDER_COLOR};
    background-color: ${$FLASH_WHITE};
    
    a {
      display: block;
      width: 100%;
      max-width: 680px;
      padding: 10px 0 12px;
      margin: 0 auto;
      box-sizing: border-box;
      ${fontStyleMixin({
        size: 14,
        weight: '600'
      })};
      ${backgroundImgMixin({
        img: staticUrl("/static/images/icon/arrow/icon-arrow-gray.png"),
        size: '7px auto',
        position: 'right 20px top 50%'
      })};

      img {
        width: 18px;
        display: inline-block;
        vertical-align: middle;
        margin: -2px 3px 0 0;
      }

      @media screen and (max-width: 680px) {
        padding: 10px 20px 12px;
      }
    }
  }
  
  ${({isMe}) => !isMe && `
    @media screen and (max-width: 680px) {
      padding: 10px 20px 16px;
    }
  
    @media screen and (max-width: 359px) {
      padding: 10px 5px 16px;
    }
  `}
`;

const CategoryDiv = styled.div`
  position: relative;
  border-top: 1px solid ${$BORDER_COLOR};
  border-bottom: 8px solid #f2f3f7;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: ${$BORDER_COLOR};
  }
`;

const MyPageContentDiv = styled.div`
  .feed-theme {
    position: relative;
    width: 100%;
    border-bottom: 1px solid ${$BORDER_COLOR};

    ul {
      max-width: 680px;
      margin: 0 auto;
    }
  }

  ${NoContentText} {
    padding: 50px 0 166px;
  }
  
  @media screen and (max-width: 680px) {
    ${NoContentText} {
      border-top: 8px solid #f2f3f7;
    }
  }
`;

const FakeDiv = styled.div`
  height: 1px;
  margin-top: -1px;
`;

const UserMobile = React.memo(() => {
  const {location: {search}} = useLocation();
  const {query: {id}} = useRouter();

  // Redux
  const dispatch = useDispatch();
  const {
    system: {session: {access}},
    me,
    user,
  } = useSelector(
    ({system, orm}: RootState) => ({
      me: pickUserSelector(system.session.id)(orm) || {} as any,
      user: pickUserSelector(id)(orm) || {} as any,
      system,
    }),
    (prev, curr) => isEqual(prev, curr),
  );

  const {
    avatar,
    follower_count,
    following_count,
    hospital_slug,
    is_follow,
    name,
    user_type,
    timeline_id
  } = user;
  const {
    user_type: myUserType,
    auth_id,
    id: ownId,
    point,
    nick_name,
    is_regular,
    is_doctalk_doctor
  } = me;
  const isMe = ownId === id;

  // State
  const [currURI, setCurrURI] = React.useState('');
  const [viewUIFixed, setViewUIFixed] = React.useState(true);

  // Life Cycle
  React.useEffect(() => {
    dispatch(fetchUserThunk(id));
  }, [id]);

  React.useEffect(() => {
    if (timeline_id) {
      const {story, extend_to} = queryString.parse(search);

      if (story === 'follow') {
        setCurrURI(`${BASE_URL}/follow/story/`);
      } else {
        let uri = `${BASE_URL}/timeline/${timeline_id}/story/`;
        if (!!extend_to) {
          uri += `?extend_to=${extend_to}`;
        }
        setCurrURI(uri);
      }
    }
  }, [timeline_id, search]);

  const {headerDetail} = useSelector(
    ({system: {style: {header: {layout}}}}: RootState) => layout,
    shallowEqual,
  );

  React.useEffect(() => {
    dispatch(setLayout({
      headerDetail: '마이페이지'
    }));

    return () => {
      dispatch(clearLayout());
    };
  }, [headerDetail]);

  return (
    <section>
      <OGMetaHead title={`${name}님`} />
      {(isMe && !is_doctalk_doctor && user_type === 'doctor') && (
        <DoctalkLinkWrapper className="clearfix">
          <p>
            닥톡(doctalk)-<span>NAVER 지식iN</span>&nbsp;<b>한의사</b>로 개인과 한의원을 브랜딩하세요!
          </p>
          <DoctalkButton className="doctalk-btn"/>
        </DoctalkLinkWrapper>
      )}
      <BannerDiv />
      <MyPageDiv>
        <ProfileDiv isMe={isMe}>
          <ul className="profile-follow-list">
            <li className="follow-btn">
              <Link
                href="/user/[id]/follower"
                as={`/user/${id}/follower`}
              >
                <a>
                  <p>
                    <span>{follower_count}</span>
                    팔로워
                  </p>
                </a>
              </Link>
            </li>
            <li>
              <Avatar
                size={78}
                src={avatar}
                userExposeType="real"
              />
            </li>
            <li className="follow-btn">
              <Link
                href="/user/[id]/following"
                as={`/user/${id}/following`}
              >
                <a>
                  <p>
                    <span>{following_count}</span>
                    팔로우
                  </p>
                </a>
              </Link>
            </li>
          </ul>
          <div className="profile-wrapper">
            <h2>
              {name}
            </h2>
            {isMe && (
              <p>
                <span>{nick_name}</span>({auth_id})
              </p>
            )}
            <StyledLabel
              name={USER_TYPE_TO_KOR[user_type]}
              color={$FONT_COLOR}
              borderColor="#999"
            />
            {typeof is_regular === 'boolean' && (
              <StyledLabel
                name={is_regular ? '정회원' : '준회원'}
                color={is_regular ? '#78cf8e' : '#cfae78'}
                borderColor={is_regular ? '#78cf8e' : '#cfae78'}
              />
            )}
            {is_doctalk_doctor && (
              <DoctalkBadge
                className="doctalk-badge"
                type="long"
              />
            )}
          </div>
          {isMe && (
            <Link href="/user/profile/edit">
              <a className="profile-setting">
                <img
                  src={staticUrl('/static/images/icon/icon-setting.png')}
                  alt="프로필 수정"
                />
                프로필 수정
              </a>
            </Link>
          )}
          {isMe && (
            <div className="my-point">
              <div>
                <Link
                  href={{
                    pathname: '/user/point',
                    query: {tab: 'history'},
                  }}
                >
                  <a>
                    <p>
                      <span>현재 나의 별</span>
                      <img
                        src={staticUrl("/static/images/icon/icon-point.png")}
                        alt="현재 나의 별"
                      />
                      {numberWithCommas(point)}
                    </p>
                  </a>
                </Link>
                <ul>
                  <li>
                    <Link
                      href={{
                        pathname: '/user/point',
                        query: {tab: 'charge'}
                      }}
                    >
                      <a>
                        <Button
                          border={{radius: '12px'}}
                          size={{width: '52px', height: '52px'}}
                          font={{size: '12px', weight: '600', color: $WHITE}}
                          backgroundColor={$POINT_BLUE}
                        >
                          충전
                        </Button>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={{
                        pathname: '/user/point',
                        query: {tab: 'refund'}
                      }}
                    >
                      <a>
                        <Button
                          border={{radius: '12px'}}
                          size={{width: '52px', height: '52px'}}
                          font={{size: '12px', weight: '600', color: $WHITE}}
                          backgroundColor={$FONT_COLOR}
                        >
                          환급
                        </Button>
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <ul>
            {access && (
              isMe ? (
                <>
                  {is_doctalk_doctor && (
                    <li className="my-page-button">
                      <Link
                        href="/user/[id]/faq"
                        as={`/user/${id}/faq`}
                      > 
                        <a>
                          <img 
                            src={staticUrl('/static/images/icon/icon-question-faq.png')}
                            alt="나의 FAQ"
                          />
                          나의 FAQ
                        </a>
                      </Link>
                    </li>
                  )}
                  {!!hospital_slug && (
                    <li className="my-page-button">
                      <Link
                        href="/user/profile/edit"
                        as="/user/profile/edit?tab=hospital"
                      >
                        <a>
                          <img
                            src={staticUrl('/static/images/icon/icon-btn-myhospital.png')}
                            alt="나의 한의원"
                          />
                          나의 한의원
                        </a>
                      </Link>
                    </li>
                  )}
                  <li className="my-page-button">
                    <Link href="/payment">
                      <a>
                        <img
                          src={staticUrl('/static/images/icon/icon-btn-mypayment.png')}
                          alt="나의 결제 내역"
                        />
                        나의 결제 내역
                      </a>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <Buttonli>
                    <Link
                      href="/user/[id]/profile"
                      as={`/user/${id}/profile`}
                    >
                      <a>
                        <img
                          src={staticUrl('/static/images/icon/icon-btn-userprofile.png')}
                          alt="프로필 보기"
                        />
                        프로필 보기
                      </a>
                    </Link>
                  </Buttonli>
                  <Buttonli>
                    <Button
                      size={{width: '100%', height: '44px'}}
                      backgroundColor={is_follow && $POINT_BLUE || '#f6f7f9'}
                      border={{radius: '0'}}
                      font={{
                        size: '14px',
                        weight: '600',
                        color: is_follow && $WHITE || $FONT_COLOR
                      }}
                      onClick={() => dispatch(followUser(id))}
                    >
                      {is_follow ? (
                        <img
                          src={staticUrl('/static/images/icon/check/icon-check3.png')}
                          alt="팔로우"
                          style={{
                            width: '12px',
                          }}
                        />
                      ) : (
                        <img
                          src={staticUrl('/static/images/icon/icon-btn-follow.png')}
                          alt="팔로우"
                          style={{
                            width: '13px',
                          }}
                        />
                      )}
                      팔로우
                    </Button>
                  </Buttonli>
                </>
              )
            )}
          </ul>
        </ProfileDiv>
        {isMe && (
          <CategoryDiv>
            <UserCategory />
          </CategoryDiv>
        )}
        <Waypoint
            topOffset={55}
            onEnter={() => setViewUIFixed(false)}
            onLeave={() => setViewUIFixed(true)}
        >
          <FakeDiv />
        </Waypoint>
        <MyPageContentDiv>
          <FeedTheme className={cn({fixed: viewUIFixed})} />
          <NoSSR>
              {currURI && (
                <Feed
                  fetchURI={currURI}
                  component={StoryMobile}
                />
              )}
          </NoSSR>
        </MyPageContentDiv>
      </MyPageDiv>
    </section>
  );
});

UserMobile.displayName = 'UserMobile';
export default loginRequired(UserMobile);
