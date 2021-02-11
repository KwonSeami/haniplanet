import * as React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import cn from 'classnames';
import queryString from 'query-string';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import AdditionalContent from '../../../components/layout/AdditionalContent';
import Label from '../../../components/UI/tag/Label';
import Feed from '../../../components/Feed';
import FollowPopup from '../../../components/user/FollowPopup';
import MoaCategoryPC from '../../../components/user/MoaCategory.pc';
import RecommendUser from '../../../components/layout/AdditionalContent/RecommendUser';
import Story from '../../../components/story/Story';
import useLocation from '../../../src/hooks/router/useLocation';
import {pushPopup} from '../../../src/reducers/popup';
import {fontStyleMixin, backgroundImgMixin, heightMixin} from '../../../styles/mixins.styles';
import {fetchUserThunk} from '../../../src/reducers/orm/user/thunks';
import {followUser} from '../../../src/reducers/orm/user/follow/thunks';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {RootState} from '../../../src/reducers';
import {BASE_URL, staticUrl} from '../../../src/constants/env';
import {USER_TYPE_TO_KOR} from '../../../src/constants/users';
import {$FONT_COLOR, $GRAY, $TEXT_GRAY, $WHITE, $POINT_BLUE, $BORDER_COLOR} from '../../../styles/variables.types';
import loginRequired from '../../../hocs/loginRequired';
import CommonStyleButton from "../../../components/CommonStyleButton";
import FollowButton from "../../../components/FollowButton";
import OGMetaHead from "../../../components/OGMetaHead";
import {numberWithCommas} from '../../../src/lib/numbers';
import {InfiniteScrollDiv} from '../../../components/InfiniteScroll/InfiniteScroll';
import FeedTheme from '../../../components/Feed/FeedTheme';
import NoSSR from 'react-no-ssr';
import Avatar from '../../../components/Avatar';
import {getOpenRangeOption} from "../../../src/lib/editor";
import DoctalkBadge from '../../../components/doctalk/DoctalkBadge';
import DoctalkButton from '../../../components/doctalk/Button';
import useSetFooter from '../../../src/hooks/useSetFooter';

const DoctalkLinkWrapper = styled.div`
  width: 1095px;
  ${heightMixin(50)};
  margin: 0 auto;
  background-color: ${$WHITE};

  .doctalk-btn {
    float: right;

    button {
      width: 133px;
      height: 34px;
      border: 1px solid #00b430;
      border-radius: 5px;
      background-color: #40b044;

      span {
        font-size: 12px;
        font-weight: bold;
      }
    }
  }

  p {
    display: inline-block;
    margin-left: 5px;
    opacity: 0.8;
    ${fontStyleMixin({
      size: 12,
    })};

    span {
      ${fontStyleMixin({
        weight: 'bold',
        color: '#2e9832'
      })};
    }
  }
`;

const BannerDiv = styled.div`
  position: relative;
  width: 100%;
  height: 385px;
  background-color: #f5f7f9;
  box-sizing: border-box;

  & > ul {
    width: 1035px;
    margin: auto;
    box-sizing: border-box;
    padding-left: 17px;
    padding-right: 13px;

    & + ul {
      position: absolute;
      left: 50%;
      bottom: 135px;
      width: 1125px;
      transform: translateX(-50%);
    }
  }

  &.me {
    height: 393px;

    > ul + ul {
      bottom: 104px;
    }
  }
`;

const ProfileUl = styled.ul`
  text-align: center;
  padding: 40px 0 3px;

  li {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    padding: 0 58px;

    h2 {
      padding-top: 4px;
      ${fontStyleMixin({
        size: 30,
        weight: '300'
      })};
    }

    p {
      ${fontStyleMixin({
        size: 16,
        weight: '300',
        color: $TEXT_GRAY
      })};
      
      span {
        ${fontStyleMixin({
          weight: '300',
          color: $GRAY
        })};
      }
    }
    
    .avatar {
      height: 93px;
      
      & > div {
        margin: auto;
      }
    }

    &.follow-btn {
      position: relative;
      top: -16px;
      font-size: 12px;
      min-width: 100px;
      padding: 0;
      cursor: pointer;

      &.me {
        top: -29px;
      }

      span {
        display: block;
        letter-spacing: 1px;
        ${fontStyleMixin({
          size: 40,
          family: 'Montserrat',
          weight: '300'
        })};
      }

      &::after {
        content: '';
        width: 30%;
        height: 1px;
        background-color: ${$FONT_COLOR};
        position: absolute;
        bottom: -2px;
        left: 50%;
        margin-left: -15px;
      }
    }

    > div {
      position: relative;
      display: inline-block;
      z-index: 1;

      .label:hover {
        & +.tooltip {
          opacity: 1;
          visibility: visible;
        }
      }
    }

    .doctalk-badge {
      margin: 5px 0 0 0;
    }
  }
`;

const StyledLabel = styled(Label)`
  cursor: default;
  ${heightMixin(22)};
  margin: 5px 3px 0 0;

  & + span {
    margin-right: 0;
  }
`;

const Tooltip = styled.span`
  position: absolute;
  display: block;
  top: 3px;
  left: 47px;
  padding: 12px 23px 14px 16px;
  line-height: 17px;
  white-space: pre;
  text-align: left;
  border-radius: 9px;
  border: 1px solid ${$BORDER_COLOR};
  background-color: ${$WHITE};
  box-shadow: 0 2px 3px 0 rgba(168,168,168,0.2);
  transition: all 0.4s;
  visibility: hidden;
  opacity: 0;
  ${fontStyleMixin({
    size: 12,
    color: $GRAY
  })};
`;

const ButtonLeftLi = styled.li`
  float: left;

  .profile-edit {
    display: block;
    position: relative;
    padding: 6px 0 12px;
    ${fontStyleMixin({
      size: 13,
      weight: '600',
      color: $GRAY
    })};

    &::after {
      content: '';
      position: absolute;
      top: 23px;
      left: 16px;
      width: 65px;
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

  ul {
    background-color: ${$WHITE};

    li {
      display: inline-block;
      vertical-align: middle;
      width: 100px;
      ${heightMixin(38)};
      text-align: center;
      box-sizing: border-box;

      &:hover {
        text-decoration: underline;
      }
      
      &:not(:first-child) a::before {
        content: '';
        position: absolute;
        left: -2px;
        top: 50%;
        width: 1px;
        height: 11px;
        margin-top: -5px;
        background-color: ${$BORDER_COLOR};
      }

      a {
        position: relative;
        display: block;
        width: 100%;
        ${fontStyleMixin({
          size: 14,
          weight: '600'
        })};

        img {
          width: 12px;
          display: inline-block;
          vertical-align: middle;
          margin-top: -2px;
        }
      }

      &.my-point {
        position: relative;
        width: 240px;
        padding: 0 15px;
        text-align: left;
        cursor: pointer;
        ${fontStyleMixin({
          size: 14,
          weight: '600',
          color: $POINT_BLUE
        })};

        span {
          position: absolute;
          right: 0;
          top: 0;
          ${fontStyleMixin({
            size: 24,
            weight: '300',
            color: $POINT_BLUE,
            family: 'Montserrat'
          })};

          img {
            width: 15px;
            display: inline-block;
            vertical-align: middle;
            margin: -2px 3px 0 0;
          }
        }

        &:hover span {
          text-decoration: underline;
        }
      }
    }
  }
`;

const ButtonRightLi = styled.li`
  float: right;

  &.me {
    padding-top: 38px;
  }

  li {
    display: inline-block;
    vertical-align: middle;
    padding: 0 5px;

    img {
      width: 18px;
      display: inline-block;
      vertical-align: middle;
      margin: -2px 2px 0 0;
    }
  }
`;

const MyPageDiv = styled.div`
  position: relative;
  width: 1125px;
  margin: -120px auto auto;
  border-radius: 20px 20px 0 0;
  box-sizing: border-box;
  background-color: ${$WHITE};
  padding: 29px 45px 88px;

  &.me {
    margin-top: -89px;
  }
`;

const LeftFeedDiv = styled.div`
  float: left;
  width: 680px;
  box-sizing: border-box;
`;

const StyledFeed = styled(Feed)`
  border: 0;
  margin-top: 35px;

  &.me {
    padding: 0;
  }

  ${InfiniteScrollDiv} {
    padding-top: 0;
  }
`;

const UserPC = React.memo(() => {
  const {location: {search, pathname}} = useLocation();
  const router=useRouter();
  const {query: {id}} = useRouter();

  const dispatch = useDispatch();
  const {
    system: {session: {access}},
    me,
    user,
  } = useSelector(({system, orm}: RootState) => ({
    me: pickUserSelector(system.session.id)(orm) || {} as any,
    user: pickUserSelector(id)(orm) || {} as any,
    system,
  }));
  const {auth_id, id: ownId, point, nick_name, is_regular, is_doctalk_doctor} = me;
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
  const isMe = ownId === id;
  const {user_type: myUserType} = me;

  const [currURI, setCurrURI] = React.useState('');
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

  // Custom Hook
  useSetFooter(false);

  return (
    <section>
      <OGMetaHead title={`${name}님`} />
      {(isMe && !is_doctalk_doctor && user_type === 'doctor') && (
        <DoctalkLinkWrapper className="clearfix">
          <p>
            닥톡(doctalk)-<span>NAVER 지식iN</span>&nbsp;<b>한의사</b>로 개인과 한의원을 브랜딩하세요!
          </p>
          <DoctalkButton
            className="doctalk-btn clearfix"
            text="doctalk 연동하기"
          />
        </DoctalkLinkWrapper>
      )}
      <BannerDiv className={cn({me: isMe})}>
        <ProfileUl>
          <li
            className={cn('follow-btn', {me: isMe})}
            onClick={() => dispatch(pushPopup(
              FollowPopup,
              {
                type: 'follower',
                userPk: id,
              },
            ))}
          >
            <span>{follower_count}</span>
            팔로워
          </li>
          <li>
            <Avatar
              size={93}
              src={avatar}
              userExposeType="real"
            />
            <h2 className={cn({me: isMe})}>
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
              <div>
                <StyledLabel
                  name={is_regular ? '정회원' : '준회원'}
                  color={is_regular ? '#78cf8e' : '#cfae78'}
                  borderColor={is_regular ? '#78cf8e' : '#cfae78'}
                />
                {!is_regular && (
                  <Tooltip className="tooltip">
                    관리자 확인중에 있습니다.<br/>조금만 기다려주세요!
                  </Tooltip>
                )}
              </div>
            )}
            {is_doctalk_doctor && (
              <DoctalkBadge
                className="doctalk-badge"
                type="long"
              />
            )}
          </li>
          <li
            className={cn('follow-btn', {me: isMe})}
            onClick={() => dispatch(pushPopup(
              FollowPopup,
              {
                type: 'following',
                userPk: id,
              },
            ))}
          >
            <span>{following_count}</span>
            팔로우
          </li>
        </ProfileUl>

        <ul className="clearfix">
          {isMe && (
            <ButtonLeftLi>
              <Link href="/user/profile/edit">
                <a className="profile-edit">
                  <img
                    src={staticUrl('/static/images/icon/icon-setting.png')}
                    alt="프로필 수정"
                  />
                  프로필 수정
                </a>
              </Link>
              <ul>
                <li className="my-point">
                  <Link
                    href={{
                      pathname: '/user/point',
                      query: {tab: 'history'}
                    }}
                  >
                    <a>
                      현재 나의 별
                      <span>
                        <img
                          src={staticUrl("/static/images/icon/icon-point.png")}
                          alt="현재 나의 별"
                        />
                        {numberWithCommas(point)}
                      </span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link
                    href={{
                      pathname: '/user/point',
                      query: {tab: 'charge'}
                    }}
                  >
                    <a>
                      별 충전
                      <img
                        src={staticUrl("/static/images/icon/arrow/icon-blue-arrow.png")}
                        alt="별 충전"
                      />
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
                      별 환급
                      <img
                        src={staticUrl("/static/images/icon/arrow/icon-blue-arrow.png")}
                        alt="별 충전"
                      />
                    </a>
                  </Link>
                </li>
              </ul>
            </ButtonLeftLi>
          )}
          <ButtonRightLi className={cn({me: isMe})}>
            <ul>
              {access && (
                isMe ? (
                  // 내 프로필일 때
                  <>
                    {is_doctalk_doctor && (
                      <li>
                        <Link
                          href="/user/faq"
                        >
                          <a>
                            <CommonStyleButton>
                              <img 
                                src={staticUrl('/static/images/icon/icon-question-faq.png')}
                                alt="나의 FAQ관리"
                              />&nbsp;
                              나의 FAQ관리
                            </CommonStyleButton>
                          </a>
                        </Link>
                      </li>
                    )}
                    {!!hospital_slug && (
                      <li>
                        <CommonStyleButton onClick={() => {
                          router.push({
                            pathname: '/user/profile/edit',
                            query: {
                              tab: 'hospital'
                            }
                          });
                        }}>
                          <img
                            src={staticUrl('/static/images/icon/icon-btn-myhospital.png')}
                            alt="나의 한의원"
                          />
                          나의 한의원
                        </CommonStyleButton>
                      </li>
                    )}
                    <li>
                      <Link href="/payment">
                        <a>
                          <CommonStyleButton>
                            <img
                              src={staticUrl('/static/images/icon/icon-btn-mypayment.png')}
                              alt="나의 결제 내역"
                            />
                            나의 결제 내역
                          </CommonStyleButton>
                        </a>
                      </Link>
                    </li>
                  </>
                ) : (
                  // 타 유저의 프로필일 때
                  <>
                    <li>
                      <Link href={`/user/${id}/profile`}>
                        <a>
                          <CommonStyleButton>
                            <img
                              src={staticUrl('/static/images/icon/icon-btn-userprofile.png')}
                              alt="프로필 보기"
                            />
                            프로필 보기
                          </CommonStyleButton>
                        </a>
                      </Link>
                    </li>
                    <li>
                      <FollowButton
                        id={id}
                        is_follow={is_follow}
                        onClick={() => dispatch(followUser(id))}
                      />
                    </li>
                  </>
                )
              )}
            </ul>
          </ButtonRightLi>
        </ul>
      </BannerDiv>

      <MyPageDiv className={cn('clearfix',{me: isMe})}>
        <LeftFeedDiv>
          <NoSSR>
            <FeedTheme>
              {currURI && (
                <StyledFeed
                  className={cn({me: isMe})}
                  fetchURI={currURI}
                  component={Story}
                />
              )}
            </FeedTheme>
          </NoSSR>
        </LeftFeedDiv>
        <AdditionalContent>
          {isMe && (
            <MoaCategoryPC id={id}/>
          )}
          <RecommendUser name="mypage"/>
        </AdditionalContent>
      </MyPageDiv>
    </section>
  );
});

UserPC.displayName = 'UserPC';

export default loginRequired(UserPC);
