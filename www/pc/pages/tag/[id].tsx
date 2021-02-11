import * as React from 'react';
import * as queryString from 'query-string';
import ReactNotSSR from '@hanii/react-not-ssr';
import Link from 'next/link';
import cn from 'classnames';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import {useRouter} from 'next/router';
import {
  $FLASH_WHITE,
  $FONT_COLOR,
  $GRAY,
  $POINT_BLUE,
  $TEXT_GRAY,
  $WHITE,
} from '../../styles/variables.types';
import {btnMixin, fontStyleMixin, radiusMixin,} from '../../styles/mixins.styles';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Feed from '../../components/Feed';
import Story from '../../components/story/Story';
import SearchInput from '../../components/UI/SearchInput';
import HaniGuideLabelList from '../../components/tag/HaniGuideLabelList';
import AdditionalContent from '../../components/layout/AdditionalContent';
import OGMetaHead from '../../components/OGMetaHead';
import {fetchExploreTag, followTag} from '../../src/reducers/orm/tag/thunks';
import WriteStory from '../../components/editor/WriteStory';
import UserApi from '../../src/apis/UserApi';
import StoryApi from '../../src/apis/StoryApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {MAIN_USER_TYPES} from '../../src/constants/users';
import {BASE_URL, staticUrl} from '../../src/constants/env';
import {makeFeedKey} from '../../src/lib/feed';
import {numberWithCommas} from '../../src/lib/numbers';
import {MenuLi, MenuUl} from '../../components/common/Menu';
import {fetchTag} from '../../src/reducers/orm/tag/tagReducer';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {FeedContentDiv, LeftFeed} from '../../components/search/styleCompPC';
import {pickTagSelector, tagListSelector} from '../../src/reducers/orm/tag/selector';
import FeedTheme from '../../components/Feed/FeedTheme';
import BannerFollowButton from '../../components/BannerFollowButton';
import DetailPageBanner from '../../components/UI/banner/DetailPageBanner';
import WaypointHeader from '../../components/layout/header/WaypointHeader';
import isEmpty from 'lodash/isEmpty';
import TagFollowToast from '../../components/ToastAlarm/TagFollowToast';
import {toastReducerThunks} from '@hanii/toast-renderer';
import {StyledTagToastRenderer} from '../../styles/StyledToastRenderer';
import {TAG_MENUS} from '../../components/layout/header/headerNav/headerMenus';
import useSetPageNavigation from '../../src/hooks/useSetPageNavigation';
import useSetFooter from '../../src/hooks/useSetFooter';
import loginRequired from "../../hocs/loginRequired";
import userTypeRequired from "../../hocs/userTypeRequired";

const {intervalPopToastAlarm} = toastReducerThunks;

const BannerDiv = styled(DetailPageBanner)`
  background-color: ${$FLASH_WHITE};
  
  &.no-bg-img {
    .center {
      span {
        ${fontStyleMixin({
          size: 30,
          weight: '300',
          color: $FONT_COLOR
        })};
      }
          
      .alert-span {
        ${fontStyleMixin({
          size: 13,
          weight: 'bold',
          color: $POINT_BLUE
        })};
      }
    }
  }
  
 .center {
    .follow-btn {
      vertical-align: middle;
      margin: -15px 0 0 7px;
    }    
    .alert-span {
      ${fontStyleMixin({
        size: 13,
        weight: 'bold',
        color: $POINT_BLUE
      })};
    }
  }
`;

const LAYOUT_WIDTH = '680px';

const StyledFeedContentDiv = styled(FeedContentDiv)`
  padding: 40px 45px 100px;
`;

const TagFeedDiv = styled.div`
  position: relative;
  margin: auto;
  padding-bottom: 88px;

  .new-meetup-btn {
    width: ${LAYOUT_WIDTH};
    margin: -23px auto 0;
    padding-bottom: 20px;

    p {
      padding-bottom: 6px;
      ${fontStyleMixin({
        size: 12,
        weight: '600'
      })};
    }
  }

  & > .follow-count {
    width: ${LAYOUT_WIDTH};
    margin: auto;
    position: relative;
    padding: 14px 0 11px;
    overflow: hidden;

    h2 {
      ${fontStyleMixin({
        size: 13,
        weight: 'bold'
      })};

      span {
        ${fontStyleMixin({
          color: $POINT_BLUE,
          weight: 'bold'
        })};
      }
    }
  }

  & > .seminar-category-list {
    width: ${LAYOUT_WIDTH};
    height: 22px;
    position: relative;
    padding-bottom: 10px;
    text-align: center;

    li {
      float: left;
      margin: 2.5px;
      border-radius: 0;
      background-color: ${$FLASH_WHITE};

      button {
        ${btnMixin(60, 20, 11, 'bold', null, $TEXT_GRAY)};

        &:hover {
          color: ${$GRAY};
        }
      }

      .on {
        &.total {
          ${radiusMixin('0', $GRAY)};
          color: ${$FONT_COLOR};
        }

        &.ongoing {
          background-color: ${$POINT_BLUE};
          color: ${$WHITE};
          border-radius: 0;
        }

        &.deadline {
          background-color: ${$FONT_COLOR};
          color: ${$WHITE};
          border-radius: 0;
        }

        &.tobe {
          background-color: ${$POINT_BLUE};
          color: ${$WHITE};
          border-radius: 0;
        }

        &.end {
          background-color: ${$TEXT_GRAY};
          color: ${$WHITE};
          border-radius: 0;
        }
      }
    }
  }

  .styled-feed-wrapper {
    position: relative;

    .feed-theme {
      top: -49px;
      padding: 0 0 10px 15px;

      img {
        width: 30px;
        height: 30px;
      }
    }
  }
`;

const TagDetail = React.memo(() => {
  // Router
  const router = useRouter();
  const {asPath} = router;
  const {id: queryId} = router.query;

  const _fetchURI = `${BASE_URL}/tag/${queryId}/story/`;

  // State
  const [realId, setRealId] = React.useState(null);
  const [q, setQ] = React.useState('');
  const [fetchURI, setFetchURI] = React.useState(_fetchURI);
  const [selectedHaniSticker, setSelectedHaniSticker] = React.useState('');
  const [queryParams, setQueryParams] = React.useState({});
  const throttledSetQueryParams = React.useCallback(throttle(setQueryParams, 700), []);
  const [headerColor, setHeaderColor] = React.useState('');

  // Redux
  const dispatch = useDispatch();
  const {count, access, userId, tag, tags, toast, user = {}} = useSelector(
    ({feed, toast, orm, navs, system: {session: {access, id: userId}}}) => ({
      access,
      navs,
      userId,
      toast: toast.tag || [],
      tag: pickTagSelector(realId)(orm) || {},
      tags: tagListSelector('explore')(orm)[0],
      count: (feed[makeFeedKey(asPath)] || {}).count,
      user: pickUserSelector(userId)(orm),
    }),
    shallowEqual
  );

  // Hooks
  React.useEffect(() => {
    dispatch(fetchTag(queryId, ({id: _id}) => setRealId(_id)));
    dispatch(fetchExploreTag());
  }, []);

  // Custom Hooks
  useSetPageNavigation(
    TAG_MENUS.some(item => item.name === tag.name)
      ? `/tag/${tag.name}`
      : '/community'
  );
  useSetFooter(false);

  React.useEffect(() => {
    const sticker = selectedHaniSticker === '전체' ? '' : selectedHaniSticker;
    setQueryParams(curr => ({...curr, sticker}));
  }, [selectedHaniSticker]);

  React.useEffect(() => {
    setFetchURI(`${_fetchURI}?${queryString.stringify(queryParams)}`);
  }, [_fetchURI, queryParams]);

  // Api
  const userApi: UserApi = useCallAccessFunc(access => new UserApi(access));

  // Memo
  const writeStoryProps = React.useMemo<any>(() => {
    return !!access
      ? {
        writeStoryApi: formData => userApi.newStory(userId, formData),
        defaultTag: tag,
        openRangeList: [
          {label: '외부공개', value: 'human'},
          {label: '회원공개', value: 'user_all'},
          {label: '나만보기', value: 'only_me'},
        ],
      }
      : {
        defaultTag: tag,
        defaultUserType: MAIN_USER_TYPES,
        openRangeList: [{label: '외부공개', value: 'human'}],
        writeStoryApi: formData => StoryApi.newStory(formData),
      };
  }, [access, userId, tag]);

  const {is_admin} = user || {} as any;
  const isHani = React.useMemo(() => (tag.name || '').includes('함께 만드는 한의플래닛'), [tag]);
  const isCounsel = React.useMemo(() => (tag.name || '').includes('온라인 상담'), [tag.name]);
  const isConsultant = React.useMemo(() => user && user.user_type === 'consultant', [
    user.user_type,
  ]);
  const isMeetUp = React.useMemo(
    () => ['세미나', '모임'].some(item => (tag.name || '').includes(item)),
    [tag.name]
  );
  // const isJob = React.useMemo(() => (tag.name || '').includes('구인/구직'), [tag]);
  const isJob = React.useMemo(
    () => ['구인', '구직'].some(item => (tag.name || '').includes(item)),
    [tag.name]
  );
  const isAffiliated = React.useMemo(() => (tag.name || '').includes('제휴서비스'), [tag.name]);

  const bgImgMap = [
    [isHani, staticUrl('/static/images/banner/img-bg-hani.jpg')],
    [isCounsel, staticUrl('/static/images/banner/img-bg-counsel.png')],
    [isMeetUp, staticUrl('/static/images/banner/img-bg-meetup.jpg')],
    [isJob, staticUrl('/static/images/banner/img-bg-job.jpg')],
    [isAffiliated, staticUrl('/static/images/banner/img-bg-affiliated.jpg')],
  ];

  const description = isHani
    ? '말하는 대로, 꿈꾸는 대로'
    : isMeetUp
      ? '나누면 나눌수록 깊어지는 지식의 숲'
      : isJob
        ? '새로운 만남, 새로운 시작'
        : isAffiliated
          ? '한의플래닛과 함께라서 더 좋은 서비스'
          : '';

  const bgImg: string = bgImgMap.reduce((prev, curr) => {
    const [flag, imgSrc] = curr;

    return flag ? imgSrc : prev;
  }, '');

  const onChangeSelectedHaniSticker = React.useCallback(name => setSelectedHaniSticker(name), []);

  React.useEffect(() => {
    isMeetUp || isCounsel || isHani || isJob || isAffiliated
      ? setHeaderColor("white")
      : setHeaderColor("black")
  }, [isMeetUp, isCounsel, isHani, isJob, isAffiliated]);

  const onChangeTagDetailSearch = React.useCallback(({target: {value: q}}) => {
    setQ(q);
    throttledSetQueryParams(current => ({...current, q}));
  }, []);

  return (
    !isEmpty(headerColor) && (
      <WaypointHeader
        themetype={headerColor}
        headerComp={
          <BannerDiv
            className={cn({
              'no-bg-img': !(isMeetUp || isCounsel || isHani || isJob || isAffiliated)
            })}
            bgImgSrc={bgImg}
          >
            <div className="center">
              <h2>
                <span>{tag.name}</span>
                <BannerFollowButton className="follow-btn"
                  is_follow={tag.is_follow}
                  onClick={() => {
                    dispatch(followTag(tag.id, () => {
                      dispatch(intervalPopToastAlarm({
                        toastType: "tag",
                        alarmId: `tag-${tag.id}-${tag.is_follow}-${toast.length}`,
                        is_follow: tag.is_follow,
                        name: tag.name,
                      }, 2000));
                    }));
                  }}
                />
                <StyledTagToastRenderer
                  count={1}
                  Item={TagFollowToast}
                  toastType='tag'
                />
                {description && (
                  <p>{description}</p>
                )}
              </h2>
            </div>
          </BannerDiv>
        }
      >
        <div>
          <OGMetaHead title={tag.name} />
          <StyledFeedContentDiv className="clearfix">
            <LeftFeed>
              <TagFeedDiv>
                {tag.name && !(isCounsel && !!access) && !isConsultant && (!isAffiliated || (isAffiliated && is_admin)) && (
                  <div style={{width: '680px', margin: 'auto'}}>
                    <WriteStory {...writeStoryProps} />
                  </div>
                )}
                <ReactNotSSR>
                  <div className="follow-count">
                    <h2>
                      <span>{`${numberWithCommas(count )}건`}</span>의 태그 검색결과
                    </h2>
                  </div>
                  {isHani && <HaniGuideLabelList onChange={onChangeSelectedHaniSticker} />}
                  <div className="styled-feed-wrapper">
                    <FeedTheme className="tag-page">
                      <Feed fetchURI={fetchURI} component={Story} />
                    </FeedTheme>
                  </div>
                </ReactNotSSR>
              </TagFeedDiv>
            </LeftFeed>
            <AdditionalContent>
              <SearchInput
                className="input-margin"
                value={q}
                onChange={onChangeTagDetailSearch}
                placeholder={`${tag.name} 내 상세 검색`}
              />
              {tags.some(({name}) => name === tag.name) && (
                <MenuUl>
                  {tags.map(({id, name, new_story_count}) => (
                    <MenuLi key={id}>
                      <Link as={`/tag/${id}`} href="/tag/[id]">
                        <a>
                          <span>{name}</span>
                          {!!new_story_count && (
                            <img
                              className="new"
                              src={staticUrl('/static/images/icon/icon-new-content.png')}
                              alt="새로운 게시물"
                            />
                          )}
                        </a>
                      </Link>
                    </MenuLi>
                  ))}
                </MenuUl>
              )}
            </AdditionalContent>
          </StyledFeedContentDiv>
        </div>
      </WaypointHeader>
    )
  );
});

TagDetail.displayName = 'TagDetail';

export default loginRequired(
  userTypeRequired(
    TagDetail,
    ['doctor', 'student']
  )
);
