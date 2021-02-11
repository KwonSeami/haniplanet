import * as React from 'react';
import Link from 'next/link';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';
import styled from 'styled-components';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {$FONT_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $THIN_GRAY, $WHITE, $BORDER_COLOR} from '../../styles/variables.types';
import {pickTimelineSelector} from '../../src/reducers/orm/timeline/selector';
import {backgroundImgMixin, fontStyleMixin, maxLineEllipsisMixin} from '../../styles/mixins.styles';
import {BASE_URL, staticUrl} from '../../src/constants/env';
import {memberListSelector} from '../../src/reducers/orm/member/selector';
import Feed from '../Feed';
import {fetchMemberThunk} from '../../src/reducers/orm/member/thunks';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {patchBandThunk} from '../../src/reducers/orm/band/thunks';
import WriteStory from '../Feed/write/writeStory/WriteStory';
import {RootState} from '../../src/reducers';
import StoryMobile from '../../components/story/StoryMobile';
import {useRouter, NextRouter} from 'next/router';
import classNames from 'classnames';
import Button from '../inputs/Button/ButtonDynamic';
import Loading from '../common/Loading';
import MoaCategory from './category/MoaCategory';
import OGMetaHead from '../OGMetaHead';
import NoSSR from 'react-no-ssr';
import {setLayout, clearLayout} from '../../src/reducers/system/style/styleReducer';
import debounce from 'lodash/debounce';
import BandApi from '../../src/apis/BandApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';

const Section = styled.section`
  padding-bottom: 80px;
  overflow: hidden;
`;

const MoaDetailBanner = styled.div<{avatar: string;}>`
  position: relative;
  height: 105px;
  box-sizing: border-box;
  ${({avatar}) => backgroundImgMixin({
    img: avatar || staticUrl('/static/images/banner/img-moa-banner-default.png'),
  })}

  ${props => props.avatar && `
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(246, 247, 249, 0.8);
    }
  `}

  span {
    position: absolute;
    top: 9px;
    right: 15px;
    z-index: 1;
    ${fontStyleMixin({size: 11, color: $GRAY})}
  }

  p {
    position: absolute;
    z-index: 1;
    bottom: 16px;
    left: 15px;
    font-size: 13px;
    border-bottom: 1px solid ${$FONT_COLOR};
    margin-left: 30px;

    img {
      width: 26px;
      position: absolute;
      top: -4px;
      left: -30px;
    }
  }
`;

const DetailTitleDiv = styled.div`
  max-width: 680px;
  margin: auto;
  position: relative;
  padding-bottom: 20px;

  h2 {
    text-align: center;
    padding-top: 9px;
    letter-spacing: -2.3px;
    ${fontStyleMixin({size: 25, weight: '300'})}

    span {
      display: block;
      padding: 3px 0 37px;
      ${fontStyleMixin({size: 13, weight: '600', color: $TEXT_GRAY})}
    }
  }

  .moa-info li {
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
      color: ${$THIN_GRAY};
      margin-top: -9px;
    }

    &.admin {
      display: block;
      padding-bottom: 3px;

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

  & > p {
    ${maxLineEllipsisMixin(13, 1.62, 3)};
    padding-top: 10px;
    color: ${$GRAY};

    &.open {
      -webkit-line-clamp: unset;
      overflow: auto;
      height: auto;
    }
  }

  .toggle {
    display: block;
    padding-top: 6px;
    text-decoration: underline;
    
    ${fontStyleMixin({size: 12, weight: 'bold'})}

    img {
      width: 13px;
      margin: 0 0 -4px 2px;
      transform: rotate(90deg);
    }

    &.open img {
      transform: rotate(-90deg);
    }
  }

  .button-group {
    padding-top: 13px;

    li {
      display: inline-block;
      vertical-align: middle;
      position: relative;
      margin-left: 4px;
      width: 26%;

      &:first-child {
        margin-left: 0;
        width: 32%;
      }

      &:last-child {
        width: 39%;
      }

      img {
        position: absolute;
        right: -5px;
        top: -5px;
        width: 16px;
      }

      span {
        color: ${$POINT_BLUE};
      }
    }
  }

  @media screen and (max-width: 680px) {
    padding: 0 20px 20px;
  }
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

  @media screen and (max-width: 680px) {
    margin-bottom: 0;
  }
`;

const AvatarDiv = styled.div<{avatar: string;}>`
  position: relative;
  width: 75px;
  height: 75px;
  margin: -42px auto auto;
  border-radius: 50%;
  ${({avatar}) => backgroundImgMixin({
    img: avatar || staticUrl('/static/images/icon/icon-default-moa-img.png'),
  })}

  & > img {
    width: 24px;
    position: absolute;
    right: 0;
    bottom: -2px;
  }
`;

const Div = styled.div`
  max-width: 680px;
  margin: auto;
  box-sizing: border-box;
  position: relative;
`;

const MoaStyledWriteStory = styled(WriteStory)`
  margin: 16px 0;

  @media screen and (max-width: 680px) {
    margin: 16px 20px;
  }
`;

const StyledFeed = styled(Feed)`
  border-top: 1px solid ${$BORDER_COLOR};
`;

interface ICommonButtonProps {
  text: React.ReactNode;
  color?: string;
  width?: string;
  backgroundColor?: string;
  onClick?: () => void;
}

const CommonButton = React.memo<ICommonButtonProps>(
  ({text, color, width, backgroundColor, onClick}) => (
    <Button
      onClick={onClick}
      font={{size: '14px', color: color ? color : ''}}
      size={{width: '100%', height: '44px'}}
      backgroundColor={backgroundColor ? backgroundColor : '#f6f7f9'}
      border={{radius: '0'}}
    >
      {text}
    </Button>
  ),
);

interface IMoaButton {
  access: HashId;
  band: any;
  user_type: string;
  appliedMemberRest: IRest;
  router: NextRouter;
}

const MoaButton = React.memo<IMoaButton>(
  ({access, band, user_type, router, appliedMemberRest}) => {
    const {band_member_grade, is_in_progress, joinable_user_types, slug} = band;

    if (!access) {
      return <Loading />;
    }
    if (!['visitor', 'normal', 'admin', 'owner', 'staff'].includes(band_member_grade)) {
      return <Loading />;
    }

    if (band_member_grade === 'visitor') {
      if (!joinable_user_types || !joinable_user_types.includes(user_type)) {
        return null;
      }

      const commonButtonProps = is_in_progress ? {
        color: $POINT_BLUE,
        text: '가입 대기중',
        onClick: () => router.push(`/band/${slug}/applied`),
      } : {
        color: $WHITE,
        backgroundColor: $FONT_COLOR,
        text: '가입하기',
        onClick: () => router.push(`/band/${slug}/join`),
      };

      return (
        <CommonButton {...commonButtonProps} />
      );
    }

    if (band_member_grade === 'normal') {
      return (
        <CommonButton
          color={$POINT_BLUE}
          text="내 정보"
          onClick={() => router.push(`/band/${slug}/me`)}
        />
      );
    }

    return (
      <ul>
        <li>
          <CommonButton
            text="정보 수정"
            onClick={() => router.push(`/band/${slug}/edit`)}
          />
        </li>
        <li>
          <CommonButton
            text="내 정보"
            onClick={() => router.push(`/band/${slug}/me`)}
          />
        </li>
        <li>
          <CommonButton
            onClick={() => router.push(`/band/${slug}/applicant`)}
            color={$POINT_BLUE}
            text={
              <>
                가입 신청 회원
                {appliedMemberRest.unread_count > 0 && (
                  <img
                    src={staticUrl('/static/images/icon/icon-new2.png')}
                    alt="new"
                  />
                )}
              </>
            }
          />
        </li>
      </ul>
    );
  },
);

interface Props {
  band: IBand;
}

const ADMIN_PERMISSION_GRADE = ['admin', 'owner', 'staff'];

const MoaDetailMobile = React.memo<Props>((props) => {
  // Ref
  const fileRef = React.useRef(null);

  const router = useRouter();
  const {asPath, query: {slug}} = router;
  const [, search] = asPath.split('?');

  // Props
  const {band} = props;
  const {
    name,
    body = '',
    avatar,
    timelines,
    created_at,
    extension: {owner},
    band_member_grade,
    user_expose_type,
    member_count,
    story_count,
    new_story_count,
    category,
  } = band;

  // Variable
  const {timeline: timelineParams} = React.useMemo(() => queryString.parse(search), [search]);
  const {name: categoryName, avatar_on: categoryImg} = category || {};
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

  // Redux
  const dispatch = useDispatch();

  const {
    system: {session: {access}},
    user: {user_type},
    timeline,
    member: [, rest],
  } = useSelector(
    ({system, orm}: RootState) => ({
      user: pickUserSelector(system.session.id)(orm) || {} as any,
      system,
      timeline: pickTimelineSelector(timelineParams)(orm),
      member: memberListSelector(`${slug}_applied`)(orm),
    }),
    shallowEqual,
  );
  const {write_range} = timeline || {} as any;

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const hasPermissionToWrite = React.useMemo(() => {
    if (!timeline) {
      return false;
    }

    switch (write_range) {
      case 'band': {
        const possibleGrade = [...ADMIN_PERMISSION_GRADE, 'normal'];
        return possibleGrade.includes(band_member_grade);
      }
      case 'user_all': {
        // 로그인한 사용자면 모두 가능
        return !!access;
      }
      case 'human':
      default:
        return true;
    }
  }, [timeline, write_range, band_member_grade, access]);

  const [isBodyOpened, setIsBodyOpened] = React.useState(false);
  const openBodyText = `소개글 ${isBodyOpened ? '접기' : '더보기'}`;

  React.useEffect(() => {
    dispatch(fetchMemberThunk({
      slug,
      sort: 'applied',
      status: 'ongoing',
      option: {
        limit: 10,
        offset: 0,
        order_by: '-created_at',
      },
    }));
  }, [slug]);
  React.useEffect(() => {
    dispatch(setLayout({
      headerDetail: name,
      isHeaderTitle: true,
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, [name]);

  return (
    <Section>
      <OGMetaHead title={name}/>
      <MoaDetailBanner avatar={avatar}>
        <span>개설일 {moment(created_at).format('YYYY.MM.DD')}</span>
        {ADMIN_PERMISSION_GRADE.includes(band_member_grade) && (
          <>
            <p
              className="pointer"
              onClick={() => fileRef.current.click()}
            >
              <img
                src={staticUrl('/static/images/icon/icon-profile-edit.png')}
                alt="이미지 설정"
              />
              이미지 설정
            </p>
            <input
              type="file"
              style={{display: 'none'}}
              ref={fileRef}
              onChange={e => {
                const file = e.target.files[0];

                if (!file.type.includes('image')) {
                  alert('잘못된 파일 타입입니다.');
                  return false;
                }

                dispatch(patchBandThunk(bandApi, slug, {avatar: file}));
              }}
            />
          </>
        )}
      </MoaDetailBanner>
      <DetailTitleDiv>
        <AvatarDiv avatar={avatar}>
          <img
            src={categoryImg || staticUrl('/static/images/icon/icon-expert.png')}
            alt="Moa 프로필 이미지"
          />
        </AvatarDiv>

        <h2>
          {name}
          <span>{categoryName || ''}</span>
        </h2>
        <ul className="moa-info">
          {!isEmpty(owner) && (
            <li className="admin">
              <strong>관리자</strong> {owner}
            </li>
          )}
          <li>
            <Link
              href="/band/[slug]/member"
              as={`/band/${slug}/member`}
            >
              <a
                onClick={e => {
                  if (!ADMIN_PERMISSION_GRADE.includes(band_member_grade) && user_expose_type === 'real') {
                    e.preventDefault();
                  }
                }}
              >
                회원수 <span>{member_count}</span>명
              </a>
            </Link>
          </li>
          <li>
            총 게시글 <span>{story_count}</span>
          </li>
          <li>
            새 글 <span className="new">{new_story_count}</span>
          </li>
        </ul>
        <p ref={bodyRef} className={classNames('pre-line', {open: isBodyOpened})}>
          {body}
        </p>
        {showMoreBtn && (
          <span
            className={classNames('toggle', {open: isBodyOpened})}
            onClick={() => setIsBodyOpened(!isBodyOpened)}
          >
            {openBodyText}
            <img
              src={staticUrl('/static/images/icon/arrow/icon-shortcut.png')}
              alt={openBodyText}
            />
          </span>
        )}
        <div className="button-group">
          <MoaButton
            access={access}
            band={band}
            user_type={user_type}
            router={router}
            appliedMemberRest={rest}
          />
        </div>
      </DetailTitleDiv>

      <section className="clearfix">
        <CategoryDiv>
          <MoaCategory timelines={timelines}/>
        </CategoryDiv>
        <Div>
          {hasPermissionToWrite && (
            <MoaStyledWriteStory
              url="/band/[slug]/timeline/[id]/new"
              asUrl={`/band/${slug}/timeline/${timelineParams}/new`}
            />
          )}
          <NoSSR>
            <StyledFeed
              fetchURI={timelineParams
                ? `${BASE_URL}/timeline/${timelineParams}/story/`
                : `${BASE_URL}/band/${slug}/story/`
              }
              fetchType="overwrite"
              component={StoryMobile}
            />
          </NoSSR>
        </Div>
      </section>
    </Section>
  );
});

CommonButton.displayName = 'CommonButton';
MoaDetailMobile.displayName = 'MoaDetailMobile';

export default MoaDetailMobile;
