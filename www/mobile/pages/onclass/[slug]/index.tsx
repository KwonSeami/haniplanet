import * as React from 'react';
import Link from 'next/link';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import styled from 'styled-components';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {useRouter} from 'next/router';
import classNames from 'classnames';
import {backgroundImgMixin, fontStyleMixin, maxLineEllipsisMixin, heightMixin} from '../../../styles/mixins.styles';
import {$GRAY, $FONT_COLOR, $TEXT_GRAY, $THIN_GRAY, $POINT_BLUE, $WHITE, $BORDER_COLOR} from '../../../styles/variables.types';
import Button from '../../../components/inputs/Button/ButtonDynamic';
import Loading from '../../../components/common/Loading';
import {BASE_URL, staticUrl} from '../../../src/constants/env';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {RootState} from '../../../src/reducers';
import OGMetaHead from '../../../components/OGMetaHead';
import {patchBandThunk, fetchBandThunk} from '../../../src/reducers/orm/band/thunks';
import {pushPopup} from '../../../src/reducers/popup';
import OnClassNoticePopup from '../../../components/layout/popup/OnClassNoticePopup';
import {ADMIN_PERMISSION_GRADE} from '../../../src/constants/band';
import OnClassVideoTable from '../../../components/onClass/OnClassVideoTable';
import {pickBandSelector} from "../../../src/reducers/orm/band/selector";
import MoaCategory from "../../../components/moa/category/MoaCategory";
import Avatar from '../../../components/AvatarDynamic';
import MyClassInfo from '../../../components/onClass/MyClassInfo';
import {followUser} from '../../../src/reducers/orm/user/follow/thunks';
import cn from 'classnames';
import Feed from '../../../components/Feed';
import StoryMobile from '../../../components/story/StoryMobile';
import loginRequired from '../../../hocs/loginRequired';
import NoSSR from 'react-no-ssr';
import WriteStory from '../../../components/Feed/write/writeStory/WriteStory';
import OnClassExtensionPopup from '../../../components/layout/popup/OnClassExtensionPopup';
import {LEARNING_STATUS} from '../../../src/constants/meetup';
import OnClassApi from '../../../src/apis/OnClassApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import userTypeRequired from '../../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../../src/constants/users';
import isPlainObject from 'lodash/isPlainObject';
import useWindowSize from '../../../src/hooks/useWindowSize';
import OnClassQABoard from "../../../components/onClass/OnClassLeftArea/OnClassQABoard";
import OnClassNoticeBoard from '../../../components/onClass/OnClassLeftArea/OnClassNoticeBoard';

const Section = styled.section`
  overflow: hidden;
`;

const DetailTitleDiv = styled.div<{innerWidth: number; avatar: string;}>`
  max-width: 680px;
  margin: auto;
  position: relative;

  .onclass-thumb {
    ${({innerWidth}) => ({
      height: Math.floor(innerWidth / 3 * 2),
    })};
    ${({avatar}) => backgroundImgMixin({
      img: avatar
    })};
  }

  .onclass-title-wrapper {
    padding: 15px 20px 0;

    h2 {
      line-height: 1.53;
      margin-bottom: 9px;
      letter-spacing: -2.3px;
      ${fontStyleMixin({
        size: 25,
        weight: '300'
      })};
  
      span {
        display: block;
        padding: 3px 0 37px;
        ${fontStyleMixin({
          size: 13,
          weight: '600',
          color: $TEXT_GRAY
        })};
      }
    }
  
    .onclass-info li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      font-size: 13px;
      padding-right: 14px;
  
      &::after {
        content: '·';
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        color: ${$THIN_GRAY};
      }
  
      &.admin {
        display: block;
        padding-bottom: 3px;
  
        .avatar {
          display: inline-block;
          margin-right: 2px;
  
          div {
            margin: -1px 7px 0 0;
            vertical-align: middle;
          }
        }
  
        &::after {
          display: none;
        }
      }
  
      &:last-child::after {
        display: none;
      }
  
      span {
        color: ${$POINT_BLUE};
  
        &.new {
          color: ${$TEXT_GRAY};
        }
      }
    }
  }

  .onclass-info-wrapper {
    padding: 0 20px 20px;

    > p {
      ${maxLineEllipsisMixin(13, 1.62, 3)};
      padding-top: 10px;
      color: ${$GRAY};
  
      &.open {
        -webkit-line-clamp: unset;
        overflow: auto;
        max-height: none;
      }
    }
  
    .toggle {
      display: block;
      padding-top: 6px;
      margin-bottom: 4px;
      text-decoration: underline;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold'
      })};
  
      img {
        width: 13px;
        margin: 0 0 -2px 2px;
        transform: rotate(90deg);
      }
  
      &.open img {
        transform: rotate(-90deg);
      }
    }
  
    .button {
      margin-top: 10px;
  
      img {
        width: 15px;
        margin: -3px 0 0 6px;
        vertical-align: middle;
      }
  
      &.reconfirm-btn img {
        width: 13px;
        margin: -3px 0 0 2px;
        vertical-align: middle;
      }
  
      &.onclass-guide-btn {
        img {
          width: 18px;
          margin: -4px 0 0 2px;
        }
      }
    }
  }

  @media screen and (min-width: 680px) {
    > div:first-of-type {
      display: flex;
      padding-top: 25px;
    }

    .onclass-thumb {
      flex: 0 0 210px;
      width: 210px;
      height: 140px;
    }

    .onclass-title-wrapper {
      flex: 1 1 auto;
      padding: 0;
      margin-left: 16px;
    }

    .onclass-info-wrapper {
      padding: 0 0 20px;

      p {
        padding-top: 23px;
      }

      .onclass-guide-btn {
        margin-top: 14px;
      }
    }
  }
`;

const CategoryDiv = styled.div`
  position: relative;
  border-top: 1px solid ${$BORDER_COLOR};

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: ${$BORDER_COLOR};
  }

  @media screen and (max-width: 680px) {
    margin-bottom: 0;
  }
`;

const UserFollowInfo = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 5px;

  div {
    ${heightMixin(20)};
    padding-right: 5px;
    border-radius: 10px;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 10,
      weight: '600',
    })};

    img {
      width: 6px;
      height: 6px;
      vertical-align: middle;
      margin: -2px 3px 0 4px;
    }

    &.follow-cancel {
      color: #aeaeae;
      border: 1px solid #eee;
      background-color: #eee;
    }

    &.follow-add {
      color: ${$POINT_BLUE};
      border: 1px solid rgba(43, 137, 255, 0.3);
      img {
        width: 8px;
        margin: -2px 2px 0 3px;
      }
    }
  }
`;

export const BoardSection = styled.section`
  padding-top: 8px;
  background-color: #f2f3f7;

  > div {
    position: relative;
    max-width: 680px;
    margin: auto;
    padding-bottom: 36px;
    background-color: ${$WHITE};
  }

  .total-story {
    ${heightMixin(42)};
    padding-left: 15px;
    border-bottom: 1px solid #eee;
    ${fontStyleMixin({
      size: 13,
      color: $TEXT_GRAY,
    })};

    span {
      color: ${$FONT_COLOR};
    }
  }

  .qa-category {
    display: flex;
    justify-content: space-between;
    padding: 11px 15px 12px;
    border-bottom: 1px solid #eee;

    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 14,
        weight: '600',
        color: $TEXT_GRAY
      })};
  
      &.on {
        color: ${$POINT_BLUE};
        text-decoration: underline;
      }
  
      & ~ li {
        padding-left: 9px;
        margin-left: 9px;
  
        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 9px;
          background-color: ${$BORDER_COLOR};
        }
      }
    }

    .check-box {
      label {
        padding-left: 21px;

        &::before {
          top: 50%;
          transform: translateY(-50%);
          box-sizing: border-box;
        }
      }
    }
  }

  .notice-pagination {
    margin: 0 auto;
    padding: 42px 0 10px;
  }

  .qa-pagination {
    margin: 0 auto;
    padding: 28px 0 24px;
  }

  .no-content {
    padding: 46px 0 53px;

    p {
      font-size: 14px;
    }
  }

  @media screen and (min-width: 680px) {
    padding-bottom: 40px;
  }
`;

export const WriteButton = styled(Button)`
  position: fixed;
  z-index: 2;
  bottom: 20px;
  right: 15px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);

  img {
    width: 20px;
    margin-right: 2px;
    vertical-align: middle;
  }
`;

const StyledFeed = styled(Feed)`
  border-top: 1px solid ${$BORDER_COLOR};
`;

const StudySection = styled.section`
  max-width: 680px;
  margin: auto;

  .class-info {
    border-bottom: 8px solid #f2f3f7;
    
    .tutor {
      padding: 15px 0;
      border-bottom: 1px solid ${$BORDER_COLOR};

      a {
        display: inline-block;
      }

      p {
        display: inline-block;
        padding-left: 8px;
        margin-left: 8px;
        border-left: 1px solid #d8d8d8;
        ${fontStyleMixin({
          size: 14,
          weight: '600',
        })};
      }
    }
  }

  @media screen and (max-width: 680px) {
    .class-info {
      border-top: 8px solid #f2f3f7;

      .tutor {
        padding: 15px;
      }
    }
  }
`;


const OnClassDetail = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {query: {slug, ...search}} = router;
  const {timeline: timelineParams} = search;

  const {innerWidth} = useWindowSize();   // window size

  // Ref
  const fileRef = React.useRef(null);
  const onClassApi: OnClassApi = useCallAccessFunc(access => access && new OnClassApi(access));

  const {
    me,
    band
  } = useSelector(
    ({system, orm}: RootState) => ({
      me: pickUserSelector(system.session.id)(orm) || {} as any,
      band: pickBandSelector(slug)(orm),
    }),
    shallowEqual,
  );

  const {id: userId, user_type, additional_data} = me || {};
  React.useEffect(() => {
    dispatch(fetchBandThunk(onClassApi, slug));
  }, [slug]);
  const userKeyList = isPlainObject(additional_data) ? additional_data : {};

  const {
    name,
    avatar,
    body = '',
    timelines,
    extension,
    created_at,
    member_count,
    story_count,
    category,
    new_story_count,
    band_member_grade,
  } = band || {};

  const {
    story,
    remaining_days = 0,
    periods = [],
    products = [],
    total_progress_rate = 0,
    total_retrieve_count = 0,
    total_contents_count = 0,
    learning_status = '',
  } = extension || {};

  const isVisitor = band_member_grade === 'visitor';
  const {avatar_on, avatar_off, name: avatar_name} = category || {};
  const {id: storyId, user: owner, receipt_range, meetup_status} = story || {};
  // Variable
  const [isBodyOpened, setIsBodyOpened] = React.useState(false);
  const openBodyText = `소개글 ${isBodyOpened ? '접기' : '더보기'}`;
  const [isOwnerFollow, setIsOwnerFollow] = React.useState((owner || {}).is_follow || false);
  const [showMoreBtn, setShowMoreBtn] = React.useState(true);
  const bodyRef = React.useRef(null);

  const updateShowMoreBtn = React.useCallback(() => {
    (!!bodyRef && bodyRef.current) &&
      setShowMoreBtn(bodyRef.current.clientHeight < bodyRef.current.scrollHeight);
  }, [bodyRef]);

  const onChangeWidthSize = React.useCallback(debounce(updateShowMoreBtn, 300), [updateShowMoreBtn]);

  React.useEffect(() => {
    onChangeWidthSize();
    window.addEventListener("resize", onChangeWidthSize);
    return  () => window.removeEventListener("resize", onChangeWidthSize);
  },[onChangeWidthSize]);

  const statusKor = LEARNING_STATUS[learning_status.split('_')[0]] || '';

  const lastDate = band_member_grade === 'normal'
    ? !isEmpty(periods) && periods[periods.length - 1].end_at
    : (receipt_range || [])[1];
  const isActive = lastDate && moment(lastDate).isAfter();

  const filterProducts = React.useMemo(() => {
    if (!user_type) {
      return [];
    }

    const filteredProductsByUserType = (products || []).filter(({user_types}) => user_types.includes(user_type));
    const filteredProductsByUserKey = !isEmpty(userKeyList) &&
      filteredProductsByUserType.filter(({key = '', value}) => userKeyList[key] === value
    );
    const filteredList = isEmpty(filteredProductsByUserKey)
      ? learning_status === 'normal_avail'
        ? filteredProductsByUserType.filter(({key}) => !key)
        : filteredProductsByUserType.filter(({key, value}) => (key === learning_status.split('_')[0]) && (value === 'True'))
      : filteredProductsByUserKey;

    return filteredList;
  }, [products, user_type, learning_status]);

  const isShowExtendBtn = meetup_status !== 'end' && learning_status.includes('_') && !isEmpty(filterProducts);

  const hasPermissionToWrite = React.useMemo(() => {
    if (!timelineParams) return false;

    const currentTimeline = timelines?.filter(item => item.id === timelineParams)[0];
    if (isEmpty(currentTimeline)) return false;

    const {writable_user_types, writable_member_grades} = currentTimeline;

    return writable_user_types?.includes(me.user_type)
      && writable_member_grades?.includes(band_member_grade);
  }, [timelines, timelineParams, band_member_grade, me]);

  if (isEmpty(band)) {
    return <Loading />
  }

  return (
    <Section>
      <OGMetaHead title={name}/>
      <DetailTitleDiv
        innerWidth={innerWidth}
        avatar={avatar}
      >
        <div>
          <div className="onclass-thumb"/>
          <div className="onclass-title-wrapper">
            <h2>
              {name}
            </h2>
            <ul className="onclass-info">
              {!isEmpty(owner) && (
                <li className="admin">
                  <Avatar
                    src={owner.avatar}
                    size={28}
                    name={owner.name}
                    userExposeType="real"
                    {...owner}
                  />
                  {(!!owner.name && (owner.id !== me.id)) && (
                    <UserFollowInfo className="pointer follow-btn">
                      <div
                        className={cn(isOwnerFollow ? 'follow-cancel' : 'follow-add')}
                        onClick={() => {
                          dispatch(followUser(owner.id, () => setIsOwnerFollow(curr => !curr)));
                        }}
                      >
                        <img
                          src={staticUrl(`/static/images/icon/${isOwnerFollow ? 'plus-gray' : 'check/check-blue-small'}.png`)}
                          alt="팔로우"
                        />
                        팔로우
                      </div>
                    </UserFollowInfo>
                  )}
                </li>
              )}
              <li>
                <Link
                  href="/onclass/[slug]/member"
                  as={`/onclass/${slug}/member`}
                >
                  <a
                    onClick={e => {
                      if (!ADMIN_PERMISSION_GRADE.includes(band_member_grade)) {
                        e.preventDefault();
                      }
                    }}
                  >
                    수강생 <span>{member_count}</span>명
                  </a>
                </Link>
              </li>
              <li>
                총 게시글 <span>{story_count}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="onclass-info-wrapper">
          <p
            className={classNames('pre-wrap', {open: isBodyOpened})}
            ref={bodyRef}
          >
            {body}
          </p>
          {showMoreBtn && (
            <span
              className={classNames('toggle', {open: isBodyOpened})}
              onClick={() => setIsBodyOpened(curr => !curr)}
            >
              {openBodyText}
              <img
                src={staticUrl('/static/images/icon/arrow/icon-shortcut.png')}
                alt={openBodyText}
              />
            </span>
          )}
          <Link
            href="/guide"
          >
            <a>
              <Button
                className="onclass-guide-btn"
                size={{
                  width: '100%',
                  height: '44px'
                }}
                border={{
                  radius: '0',
                  width: '1px',
                  color: '#eee'
                }}
                font={{
                  size: '14px',
                  weight: '600',
                }}
              >
                온라인 강의 이용가이드
                <img
                  src={staticUrl('/static/images/icon/icon-help-btn.png')}
                  alt="온라인 강의 이용가이드"
                />
              </Button>
            </a>
          </Link>
          <Button
            size={{width: '100%', height: '44px'}}
            border={{radius: '0'}}
            font={{size: '14px', color: $POINT_BLUE}}
            backgroundColor="#f6f7f9"
            onClick={() => dispatch(pushPopup(OnClassNoticePopup))}
          >
            강의 유의사항 안내
          </Button>
          {isShowExtendBtn && ( //수강연장or재수강 신청 가능할 때
            learning_status === 'normal_avail'
            ? (
              <Button
                size={{width: '100%', height: '44px'}}
                border={{radius: '0'}}
                font={{size: '14px', color: $WHITE}}
                backgroundColor="#499aff"
                onClick={() => router.push(`/story/${storyId}/`)}
              >
                수강신청
                <img
                  src={staticUrl('/static/images/icon/arrow/arrow-double-white.png')}
                  alt="수강신청"
                />
              </Button>
            ) : (
              <Button
                className="reconfirm-btn"
                size={{width: '100%', height: '44px'}}
                border={{radius: '0'}}
                font={{size: '14px', color: $WHITE}}
                backgroundColor="#499aff"
                onClick={() => dispatch(pushPopup(OnClassExtensionPopup, {
                  status: statusKor,
                  productList: filterProducts
                }))
                }
              >
                {statusKor} 신청
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-white-arrow.png')}
                  alt={`${statusKor} 신청`}
                />
              </Button>
            )
          )}
        </div>
      </DetailTitleDiv>
      <section className="clearfix">
        <CategoryDiv>
          <MoaCategory
            timelines={timelines}
            mainPageName="강의실 홈"
            isOnClass
          />
        </CategoryDiv>
        {timelineParams && (
          (timelines.filter(({name}) => name === '공지사항 및 학습자료실')[0] || {}).id === timelineParams
          ? <OnClassNoticeBoard/>
          : (timelines.filter(({name}) => name === '질문 및 답변')[0] || {}).id === timelineParams
          ? <OnClassQABoard/>
          : <StyledFeed
              className={cn({'no-write': !hasPermissionToWrite})}
              fetchURI={
                timelineParams ?
                  `${BASE_URL}/timeline/${timelineParams}/story/` :
                  `${BASE_URL}/band/${slug}/story/`
              }
              fetchType="overwrite"
              component={StoryMobile}
            />
        )}
        {hasPermissionToWrite && (
          <Link
            href={`/onclass/[slug]/new?timeline=${timelineParams}`}
            as={`/onclass/${slug}/new?timeline=${timelineParams}`}
          >
            <a>
              <WriteButton
                className="write-btn"
                size={{
                  width: '106px',
                  height: '42px'
                }}
                border={{
                  width: '1px',
                  radius: '21px',
                  color: '#a0a0a0',
                }}
                font={{
                  size: '14px',
                  weight: 'bold',
                }}
                backgroundColor={$WHITE}
              >
                <img
                  src={staticUrl('/static/images/icon/icon-write.png')}
                  alt=""
                />
                글쓰기
              </WriteButton>
            </a>
          </Link>
        )}
      </section>
      {!timelineParams && (
        <StudySection>
          <div className="class-info">
            {!isVisitor && (
              <MyClassInfo
                band_member_grade={band_member_grade}
                periods={periods}
                remainingDay={remaining_days}
                receipt_range={receipt_range}
                total_progress_rate={(total_progress_rate || 0).toFixed(0)}
              />
            )}
          </div>
          <OnClassVideoTable
            band_member_grade={band_member_grade}
            isActive={isActive}
          />
        </StudySection>
      )}
    </Section>
  );
};

export default loginRequired(
  userTypeRequired(
    React.memo(OnClassDetail),
    [...MAIN_USER_TYPES, 'hani']
  )
);
