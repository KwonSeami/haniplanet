import * as React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {
  $BORDER_COLOR,
  $FONT_COLOR,
  $GRAY,
  $POINT_BLUE,
  $TEXT_GRAY,
  $THIN_GRAY,
  $WHITE,
} from '../../styles/variables.types';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {patchBandThunk} from '../../src/reducers/orm/band/thunks';
import {backgroundImgMixin, fontStyleMixin} from '../../styles/mixins.styles';
import {pickTimelineSelector} from '../../src/reducers/orm/timeline/selector';
import {BASE_URL, staticUrl} from '../../src/constants/env';
import AdditionalContent from '../layout/AdditionalContent';
import TotalWritingPC from '../layout/AdditionalContent/TotalWriting/index.pc';
import WriteStory from '../editor/WriteStory';
import {RootState} from '../../src/reducers';
import MoaRecentlyJoinedMemberPC from '../layout/AdditionalContent/MoaRecentlyJoinedMember/index.pc';
import MoaAppliedMemberPC from '../layout/AdditionalContent/MoaAppliedMember/index.pc';
import Story from '../story/Story';
import Feed from '../Feed';
import Button from '../inputs/Button/ButtonDynamic';
import {useRouter} from 'next/router';
import cn from 'classnames';
import OGMetaHead from '../OGMetaHead';
import Loading from '../common/Loading';
import WaypointHeader from '../layout/header/WaypointHeader';
import NoSSR from 'react-no-ssr';
import {setLayout, clearLayout} from '../../src/reducers/system/style/styleReducer';
import {saveTheme} from "../../src/reducers/theme";
import ReactGA from "react-ga";
import {IBand} from '../../src/@types/band';
import { ADMIN_PERMISSION_GRADE } from '../../src/constants/band';
import BandApi from '../../src/apis/BandApi';

const MoaDetailBanner = styled.div<{bannerImg: string;}>`
  position: relative;
  min-width: 1125px !important;
  height: 283px;
  box-sizing: border-box;
  ${props => backgroundImgMixin({
    img: props.bannerImg || staticUrl('/static/images/banner/moa-default.png'),
  })}

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(246, 247, 249, 0.9);
  }
`;

const DetailTitleDiv = styled.div`
  width: 1125px;
  margin: auto;
  position: relative;
  padding-bottom: 16px;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 45px;
    width: 1035px;
    height: 1px;
    background-color: ${$BORDER_COLOR}
  }

  h2 {
    width: 1035px;
    padding-left: 45px;
    margin-top: -85px;
    height: 84px;
    box-sizing: border-box;
    ${fontStyleMixin({size: 29, weight: '300'})}

    span {
      display: block;
      padding: 6px 0 24px;
      ${fontStyleMixin({size: 13, weight: '600', color: $GRAY})}
    }
  }

  div {
    margin-right: 45px;
  }

  ul {
    padding-left: 45px;
  }

  & > p {
    padding: 4px 455px 0 45px;
    line-height: 1.7;
    ${fontStyleMixin({size: 13, color: $GRAY})}

    span {
      display: block;
      padding-bottom: 28px;
      letter-spacing: 0;
      ${fontStyleMixin({size: 12, color: $TEXT_GRAY})}
    }
  }
`;

const AvatarEditDiv = styled.div<{avatar: string;}>`
  position: absolute;
  right: 4px;
  top: -14px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  ${props => backgroundImgMixin({
    img: props.avatar || staticUrl('/static/images/icon/icon-default-moa-img.png'),
  })}

  & > img {
    width: 38px;
    position: absolute;
    right: -5px;
    bottom: -1px;
  }

  p {
    position: absolute;
    left: -98px;
    bottom: -5px;
    font-size: 13px;
    cursor: pointer;

    &::after {
      content: '';
      position: absolute;
      bottom: 3px;
      right: 0;
      width: 66%;
      height: 1px;
      background-color: ${$FONT_COLOR};
    }

    img {
      width: 25px;
      display: inline-block;
      vertical-align: middle;
      margin: -2px 3px 0 0;
    }
  }
`;

const DetailInfoLi = styled.li`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  font-size: 13px;
  padding: 17px 14px 0 0;
  

  &::after {
    content: '·';
    position: absolute;
    right: 7px;
    top: 50%;
    color: ${$THIN_GRAY};
    margin-top: -1px;
  }

  &.admin::after,
  &:last-child::after {
    display: none;
  }

  span {
    color: ${$POINT_BLUE};
    letter-spacing: 0;

    &.new {
      color: ${$TEXT_GRAY};
    }
  }
`;

const ButtonDiv = styled.div`
  position: absolute;
  right: 0;
  bottom: 15px;

  li {
    display: inline-block;
    vertical-align: middle;
    margin-left: 4px;
  }
`;

const Section = styled.section`
  width: 1035px;
  margin: auto;
  position: relative;
  padding: 33px 45px 84px;
`;

const LeftDiv = styled.div`
  float: left;
  width: 680px;
  box-sizing: border-box;

  .no-write > div {
    padding-top: 16px;
  }

  .write-story {
    margin-top: 16px;
  }
`;

type Props = {
  band: IBand;
} & any;

interface ICommonButtonProps {
  text: string;
  color?: string;
  backgroundColor?: string;
  onClick?: () => void;
}

const CommonButton = React.memo<ICommonButtonProps>(
  ({text, color, backgroundColor, onClick}) => (
    <Button
      onClick={onClick}
      backgroundColor={backgroundColor ? backgroundColor : '#f6f7f9'}
      font={{size: '14px', color: color ? color : ''}}
      size={{width: '140px', height: '36px'}}
      border={{radius: '0'}}
    >
      {text}
    </Button>
  ),
);

const MoaDetailPC = React.memo<Props>((props) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setLayout({
      background: 'transparent',
      fakeHeight: false,
      position: 'absolute',
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, []);

  const {
    band,
  } = props;
  const {
    name,
    avatar,
    timelines,
    created_at,
    member_count, story_count, new_story_count,
    user_expose_type,
    extension: {owner},
    band_member_grade,
    body,
    category,
  } = band || {};

  const {name: categoryName, avatar_on: categoryImg} = category || {};
  const fileRef = React.useRef(null);

  const hasAdminPermission = React.useMemo(() =>
    ADMIN_PERMISSION_GRADE.includes(band_member_grade), [band_member_grade],
  );
  const router = useRouter();
  const {query: {slug, ...search}} = router;
  const {timeline: timelineParams} = search;

  const {system: {session: {access}}, user: {user_type}, timeline} = useSelector(
    ({system, orm}: RootState) => ({
      system,
      user: pickUserSelector(system.session.id)(orm) || {} as any,
      timeline: pickTimelineSelector(timelineParams)(orm),
    }),
    shallowEqual,
  );

  const {write_range, ...rest} = timeline || {} as any;

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
  }, [timeline, write_range, access]);

  const showDifferentButton = React.useCallback(() => {
    const {band_member_grade, is_in_progress, joinable_user_types} = band;

    if (!access) {
      return <Loading/>;
    }
    if (!['visitor', 'normal', 'admin', 'owner', 'staff'].includes(band_member_grade)) {
      return <Loading/>;
    }

    if (band_member_grade === 'visitor') {
      if (!joinable_user_types || !joinable_user_types.includes(user_type)) {
        return null;
      }

      const commonButtonProps = is_in_progress ? {
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

    const commonButtonProps = [
      {
        text: '내 정보',
        onClick: () => router.push(`/band/${slug}/me`),
      },
      {
        text: '정보 수정',
        onClick: () => router.push(`/band/${slug}/edit`),
      },
    ];

    return (
      // @진혜연: 디자인이 완료된 후 퍼블리싱 수정이 필요합니다.
      band_member_grade === 'normal' ? (
        <CommonButton {...commonButtonProps[0]}/>
      ) : (
        <ul>
          <li>
            <CommonButton {...commonButtonProps[0]}/>
          </li>
          <li>
            <CommonButton {...commonButtonProps[1]}/>
          </li>
        </ul>
      )
    );

  }, [access, band, user_type, slug]);

  React.useEffect(() => {
    dispatch(saveTheme('title'));
    ReactGA.event({
      category: '목록 뷰 테마',
      action: '목록 뷰 테마 > 제목 뷰 선택',
      label: `목록 뷰 테마 > ${router.asPath}`,
    });
  }, [router.asPath]);

  return (
    <WaypointHeader
      headerComp={
        <div>
          <OGMetaHead title={name}/>
          <MoaDetailBanner bannerImg={avatar}/>
          <DetailTitleDiv>
            <h2>
              {name}
              <span>{categoryName || ''}</span>
            </h2>
            <AvatarEditDiv avatar={avatar}>
              <img
                src={categoryImg || staticUrl('/static/images/icon/icon-expert.png')}
                alt="Moa 프로필 이미지"
              />
              {ADMIN_PERMISSION_GRADE.includes(band_member_grade) && (
                <>
                  <p onClick={() => fileRef.current.click()}>
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

                      dispatch(patchBandThunk(new BandApi(access), slug, {
                        avatar: file,
                      }));
                    }}
                  />
                </>
              )}
            </AvatarEditDiv>
            <ul>
              {!isEmpty(owner) && (
                <DetailInfoLi className="admin">
                  <strong>관리자</strong> {owner}
                </DetailInfoLi>
              )}
              <DetailInfoLi>
                <Link
                  href="/band/[slug]/member"
                  as={`/band/${slug}/member`}
                >
                  <a
                    onClick={e => {
                      if (!ADMIN_PERMISSION_GRADE.includes(band_member_grade) && user_expose_type === 'real' ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    회원수 <span>{member_count}</span>명</a>
                </Link>
              </DetailInfoLi>
              <DetailInfoLi>
                총 게시글 <span>{story_count}</span>
              </DetailInfoLi>
              <DetailInfoLi>
                새 글 <span className="new">{new_story_count}</span>
              </DetailInfoLi>
            </ul>
            <p className="pre-line">
              <span>개설일 {moment(created_at).format('YYYY.MM.DD')}</span>
            </p>
            <p>{body}</p>
            <ButtonDiv>
              {showDifferentButton()}
            </ButtonDiv>
          </DetailTitleDiv>
        </div>
      }
    >
      <Section className="clearfix">
        <LeftDiv>
          {hasPermissionToWrite && (
            <WriteStory
              className="write-story"
              url={`/band/${slug}/timeline/${timelineParams}/new`}
            />
          )}
          <NoSSR>
            <Feed
              className={cn({'no-write': !hasPermissionToWrite})}
              fetchURI={
                timelineParams ?
                  `${BASE_URL}/timeline/${timelineParams}/story/` :
                  `${BASE_URL}/band/${slug}/story/`
              }
              fetchType="overwrite"
              component={Story}
            />
          </NoSSR>
        </LeftDiv>
        <AdditionalContent hideAdArea>
          <TotalWritingPC
            new_story_count={new_story_count}
            activeTimelinePk={timelineParams}
            hasAdminPermission={hasAdminPermission}
            isAddable={true}
            timelines={timelines}
            access={access}
            slug={slug}
          />
          {hasAdminPermission && (
            <>
              <MoaRecentlyJoinedMemberPC slug={slug}/>
              <MoaAppliedMemberPC slug={slug}/>
            </>
          )}
        </AdditionalContent>
      </Section>
    </WaypointHeader>
  );
});

CommonButton.displayName = 'CommonButton';
MoaDetailPC.displayName = 'MoaDetailPC';

export default MoaDetailPC;
