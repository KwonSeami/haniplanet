import React from 'react';
import throttle from 'lodash/throttle';
import AdditionalContent from '../../components/layout/AdditionalContent';
import {
  StyledSearchInput,
  StyledFeedContentDiv,
  MaxWidthWrapper,
  StyledPagination,
  CommunityWrapperDiv
} from '../../components/community/common';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {LeftFeed} from '../../components/search/styleCompPC';
import {numberWithCommas} from '../../src/lib/numbers';
import {useRouter} from 'next/router';
import {fetchCommunityThunk} from '../../src/reducers/community/thunk';
import NoSSR from 'react-no-ssr';
import FeedTheme from '../../components/Feed/FeedTheme';
import Story from '../../components/story/Story';
import SelectBox from '../../components/inputs/SelectBox';
import {PROD_CLIENT_URL} from '../../src/constants/env';
import {RootState} from '../../src/reducers';
import Loading from '../../components/common/Loading';
import isEmpty from 'lodash/isEmpty';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import ExploreApi from '../../src/apis/ExploreApi';
import OGMetaHead from '../../components/OGMetaHead';
import {saveFeed} from '../../src/reducers/feed';
import {makeFeedKey} from '../../src/lib/feed';
import useMapStateToProps from '../../src/hooks/feed/useMapStateToProps';
import loginRequired from '../../hocs/loginRequired';
import useSetPageNavigation from '../../src/hooks/useSetPageNavigation';
import HashReload from '../../components/HashReload';
import {setLayout} from '../../src/reducers/system/style/styleReducer';
import {$WHITE} from '../../styles/variables.types';
import queryString from 'query-string';
import CommunitySideMenu from '../../components/community/CommunitySideMenu';
import PopularStory from '../../components/community/PopularStory';
import LatestCommunity from '../../components/community/LatestCommunity';
import {
  isCategoriesFetched,
  isCategoryAccessible
} from '../../src/lib/categories';
import cn from 'classnames';
import CommunityBoard from '../../components/community/CommunityBoard';
import {HEADER_HEIGHT} from "../../styles/base.types";
import FollowMenu from '../../components/FollowMenu';
import FloatingMenu from '../../components/community/detail/FloatingMenu';
import {checkOnlinePage} from '../../src/lib/community';
import OnClassBanner from '../../components/common/OnClassBanner';
import NoContentText from '../../components/NoContent/NoContentText';
import Page404 from '../../components/errors/Page404';
import userTypeRequired from '../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../src/constants/users';

const ORDER_BYS = [
  {label: '최신순', value: '-created_at'},
  {label: '조회순', value: '-retrieve_count'},
  {label: '좋아요순', value: '-up_count'},
  {label: '댓글순', value: '-comment_count'}
];

const PAGE_SIZE = 20;
const PAGE_GROUP_SIZE = 10;

const FOOTER_HEIGHT = 280;

const Community: React.FC = () => {
  const dispatch = useDispatch();

  const sideMenu = React.useRef(null);
  const exploreApi: ExploreApi = useCallAccessFunc(access => new ExploreApi(access));

  // Router
  const router = useRouter();
  const {query, pathname, asPath} = router;
  const hash = asPath.search(/\#[a-z]/g) > -1 ? asPath.split('#')[1] : '';

  // Variables
  const {
    purpose,
    category,
    q,
    page,
    order_by
  } = query;
  const orderBy = (order_by as string) || '-created_at';

  // Redux
  const {
    pending,
    currentFeed
  } = useMapStateToProps();
  const {community, categories, me, headerLayout: {fakeHeight}} = useSelector(
    ({
      community,
      categories,
      orm,
      system: {
        session: {id},
        style: {header: {layout}}
      },
    }: RootState) => ({
      community,
      categories,
      me: pickUserSelector(id)(orm),
      headerLayout: layout
    }),
    shallowEqual
  );

  const {categoriesById} = categories;

  const {user_type, is_admin} = me || {} as IUser;
  const {get_my_history_stories} = community;

  const setUrl = React.useCallback((queryParams: Indexable, hash?: string) => {
    const _query = {
      ...query,
      ...queryParams
    };
    router.push(`${pathname}?${queryString.stringify(_query)}${hash ? `#${hash}` : ''}`)
  }, [query, pathname]);

  React.useEffect(() => {
    if (hash === 'nav') {
      setHeightFixed(true);
      dispatch(setLayout({
        themetype: 'black',
        position: 'fixed',
        fakeHeight: true,
        background: $WHITE
      }))
    }
  }, [hash]);

  React.useEffect(() => {
    dispatch(fetchCommunityThunk());
  }, []);

  React.useEffect(() => {
    exploreApi.story(!!category ? {
      page,
      tag_id: category,
      order_by: order_by,
      q: q
    } : {
      purpose: 'main',
      page,
      order_by: order_by,
      q: q
    })
    .then(({status, data}) => {
      if (status === 200) {
        const {results, count} = data;

        dispatch(saveFeed({
          key: makeFeedKey(asPath),
          results,
          fetchType: 'overwrite'
        }));
        setStoryCount(count);
      }
    })
  }, [page, category, order_by, q, asPath]);

  useSetPageNavigation('/community');

  //State
  const [storyCount, setStoryCount] = React.useState(0);
  const [heightFixed, setHeightFixed] = React.useState(false);
  const [titleViewOnly, setTitleViewOnly] = React.useState(false);
  const [keyword, setKeyword] = React.useState((q as string) || '');
  const [isOnlinePage, setIsOnlinePage] = React.useState(false);

  const [isOnPosition, setIsOnPosition] = React.useState(false);

  const compareBrowserHeight = React.useCallback(() => {
    const notContentSize = HEADER_HEIGHT + FOOTER_HEIGHT;
    const windowContentSize = window.innerHeight - notContentSize;

    const sideMenuContent = sideMenu.current && sideMenu.current.getElementsByClassName('menu-box')[0];
    const sideMenuContentHeight = sideMenuContent ? sideMenuContent.clientHeight : 0;

    return sideMenuContentHeight > windowContentSize;
  }, [sideMenu.current]);

  const [browserHeightIsSmallerThanSideMenuHeight, setBrowserHeightIsSmallerThanSideMenuHeight] = React.useState(false);

  const throttleCompareBrowserHeight = React.useCallback(throttle(() => {
    setBrowserHeightIsSmallerThanSideMenuHeight(compareBrowserHeight());
  }, 100), [compareBrowserHeight]);

  React.useEffect(() => {
    if (fakeHeight === false && heightFixed) {
      setHeightFixed(false);
    }
  }, [fakeHeight, heightFixed]);

  // 현재 사용자의 UserType으로 접근할 수 없는 카테고리인 경우 피드 뷰 옵션을 제거
  React.useEffect(() => {
    isCategoriesFetched(categories)
      && setTitleViewOnly((category && !isCategoryAccessible(categories, category, user_type)) || isOnlinePage);
  }, [categories, category, user_type, isOnlinePage]);

  React.useEffect(() => {
    if (isCategoriesFetched(categories))
      setIsOnlinePage(checkOnlinePage(categoriesById[category]?.name));
  }, [categories, categoriesById, category]);

  React.useEffect(() => {
    window.addEventListener('resize', throttleCompareBrowserHeight);

    return () => {
      window.removeEventListener('resize', throttleCompareBrowserHeight);
    }
  }, [throttleCompareBrowserHeight]);

  const handleScrollWindow = React.useCallback(() => {
    if (sideMenu.current) {
      const sideMenuContent = sideMenu.current.getElementsByClassName('menu-box')[0];
      const sideMenuContentHeight = sideMenuContent.clientHeight;

      const scrollEventPosition = sideMenu.current.clientHeight - sideMenuContentHeight;
      const currentScrollPosition = window.scrollY;

      if (currentScrollPosition > scrollEventPosition) {
        setIsOnPosition(true);
      } else {
        setIsOnPosition(false);
      }
    }
  }, [browserHeightIsSmallerThanSideMenuHeight, sideMenu.current]);

  const throttleHandleScrollWindow = React.useCallback(throttle(handleScrollWindow, 10), [handleScrollWindow]);

  //callback
  const onChangeHandler = ({target: {value}}) => {
    setKeyword(value);
  };
  const onSearchHandler = (value) => {
    setUrl({
      q: value,
      page: 1
    })
  };

  React.useEffect(() => {
    if (browserHeightIsSmallerThanSideMenuHeight) {
      window.addEventListener('scroll', throttleHandleScrollWindow);

      return () => {
        window.removeEventListener('scroll', throttleHandleScrollWindow);
      }
    }
  }, [browserHeightIsSmallerThanSideMenuHeight]);

  if (pathname !== '/community' && categoriesById[category] === undefined)
    return <Page404/>;

  return (
    <>
      <OGMetaHead title="커뮤니티"/>
      <CommunityWrapperDiv>
        <CommunitySideMenu
          ref={sideMenu}
          isOnPosition={isOnPosition}
          isFetchingCallback={() => throttleCompareBrowserHeight()}
        />
        <MaxWidthWrapper>
          <FollowMenu
            top={38}
            right={-25}
            menuCompFn={() => (
              <FloatingMenu />
            )}
          >
          {!category && (
            <section className="board-box">
              <PopularStory />
              <LatestCommunity />
            </section>
          )}
          <StyledFeedContentDiv className="clearfix">
            <span
              className="hash-target"
              id="nav"
            />
            <HashReload/>
            <LeftFeed>
              <div className="top-wrapper">
                <h2>
                  <span>{`${numberWithCommas(storyCount)}건`}</span>
                  의 글이 있습니다.
                </h2>
                <SelectBox
                  className={cn({'right': titleViewOnly})}
                  option={ORDER_BYS}
                  value={orderBy}
                  onChange={order_by => setUrl({
                    order_by,
                    page: 1
                  })}
                />
              </div>
              <div className="styled-feed-wrapper">
                <NoSSR>
                  {pending ? (
                    <Loading/>
                  ) : (
                    isEmpty(currentFeed.ids) ? (
                      <FeedTheme
                        titleViewOnly={titleViewOnly}
                      >
                        <NoContentText
                          alt="등록 된 글이 없습니다."
                          borderBox
                        >
                          <p>등록 된 글이 없습니다.</p>
                        </NoContentText>
                      </FeedTheme>
                    ) : (
                      <>
                        <FeedTheme
                          titleViewOnly={titleViewOnly}
                        >
                          <div className="feed">
                            <ul>
                              {currentFeed.ids.map(props => {
                                const {user_types, id} = props || {};
                                const isMyUserType = is_admin || (user_types || []).includes(user_type);

                                return props && (
                                  <li key={id}>
                                    <Story
                                      allowDetail={isMyUserType}
                                      fixedView={titleViewOnly}
                                      storyType="community"
                                      shareUrl={`${PROD_CLIENT_URL}/community/${id}`}
                                      is_admin={is_admin}
                                      {...props}
                                    />
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </FeedTheme>
                        <StyledPagination
                          currentPage={Number(page) || 1}
                          pageSize={PAGE_SIZE}
                          pageGroupSize={PAGE_GROUP_SIZE}
                          totalCount={storyCount}
                          onClick={currPage => setUrl({
                            page: currPage
                          }, 'nav')}
                        />
                      </>
                    )
                  )}
                </NoSSR>
              </div>
            </LeftFeed>
            <AdditionalContent hideFooter>
              <StyledSearchInput
                className="input-margin"
                placeholder="찾고 싶은 글이 있으신가요?"
                value={keyword}
                onChange={onChangeHandler}
                onSearch={onSearchHandler}
              />
              {isOnlinePage && (
                <OnClassBanner/>
              )}
              {get_my_history_stories && (
                <CommunityBoard
                  title="내가 본 글"
                  data={get_my_history_stories}
                  pageSize={5}
                  isHistoryData
                />
              )}
            </AdditionalContent>
          </StyledFeedContentDiv>
          </FollowMenu>
        </MaxWidthWrapper>
      </CommunityWrapperDiv>
    </>
  );
};

Community.displayName = 'Community';

export default loginRequired(
  userTypeRequired(
    React.memo(Community),
    MAIN_USER_TYPES
  )
);
