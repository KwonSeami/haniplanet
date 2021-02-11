import React from 'react';
import {useRouter} from 'next/router';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {fetchCommunityThunk} from '../../src/reducers/community/thunk';
import BestPost from '../../components/community/BestPost';
import LatestStory from '../../components/community/LatestStory';
import {MaxWidthWrapper, WriteBtn, CommunityGuideLink} from '../../components/community/common';
import {staticUrl} from '../../src/constants/env';
import queryString from 'query-string';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import ExploreApi from '../../src/apis/ExploreApi';
import Loading from '../../components/common/Loading';
import SelectBox from '../../components/inputs/SelectBox';
import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$TEXT_GRAY, $FONT_COLOR, $GRAY, $BORDER_COLOR, $WHITE} from '../../styles/variables.types';
import StorySimple from '../../components/story/StorySimple';
import Pagination from '../../components/UI/Pagination';
import SearchInput from '../../_pages/wiki/input/SearchInput';
import CommunityNavigation from '../../components/community/CommunityNavigation';
import {RootState} from '../../src/reducers';
import {saveFeed} from '../../src/reducers/feed';
import loginRequired from '../../hocs/loginRequired';
import {makeFeedKey} from '../../src/lib/feed';
import Link from 'next/link';
import OGMetaHead from '../../components/OGMetaHead';
import useMapStateToProps from '../../src/hooks/feed/useMapStateToProps';
import HashReload from '../../components/HashReload';
import {IUser} from '../../src/@types/community';
import {USER_TYPE_TO_KOR} from '../../src/constants/users';
import {checkOnlinePage} from '../../src/lib/community';
import OnClassBanner from '../../components/common/OnClassBanner';
import {setLayout, clearLayout} from '../../src/reducers/system/style/styleReducer';
import NoContentText from '../../components/NoContent/NoContentText';
import {LocalCache} from 'browser-cache-storage';
import {MONTH, SECOND} from '../../src/constants/times';
import isEmpty from 'lodash/isEmpty';
import A from '../../components/UI/A';
import Page404 from '../../components/errors/Page404';
import userTypeRequired from '../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../src/constants/users';
import useScroll from '../../src/hooks/misc/useScroll';

const ORDER_TYPE = [
  {value: '-created_at', label: '최신순'},
  {value: '-retrieve_count', label: '조회순'},
  {value: '-up_count', label: '좋아요순'},
  {value: '-comment_count', label: '댓글순'},
];

const CommunityWrapper = styled.div`
  .story {
    .header {
      position: relative;
      width: 100%;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;

      @media screen and (max-width: 680px) {
        padding: 0 15px;
        border-bottom: 10px solid #f2f3f7;
      }

      .count {
        padding: 11px 0;
        ${fontStyleMixin({
          size: 13,
          color: $TEXT_GRAY
        })};

        em {
          font-style: normal;
          color: ${$FONT_COLOR};
        }
      }

      .select-box {
        position: absolute;
        top: 0;
        right: 0;
        width: 85px;
        border-bottom: 0;

        p {
          padding-left: 15px;

          img {
            right: -4px;
          }
        }

        ul {
          margin-top: -1px;
          border-top: 1px solid ${$BORDER_COLOR};
        }
      }
    }

    .center-wrapper {
      max-width: 680px;
      margin: 0 auto;

      .pagination {
        padding: 16px 0;
        margin: 0 auto;

        button {
          &:first-child,
          &:last-child {
            display: none;
          }
        }
      }

      .button {
        display: block;
        margin: -2px auto 18px;
        text-decoration: underline;
        ${fontStyleMixin({
          size: 14,
          color: $GRAY
        })};

        img {
          vertical-align: middle;
          width: 18px;
          margin: -2px 0 0 4px;
        }
      }
    }
  }

  .search-input {
    position: relative;
    width: auto;
    height: 40px;
    margin-bottom: 16px;
    border-radius: 20px;
    background-color: #f8f8f8;

    @media screen and (max-width: 680px) {
      margin: 0 15px 16px;
    }

    .search-input-box {
      background-color: transparent;

      .text-field {
        padding: 0 15px;
        ${fontStyleMixin({
          size: 14,
          color: $TEXT_GRAY
        })};
        background-color: transparent;
      }

      .search-icon {
        top: 50%;
        right: 10px;
        width: 26px;
        transform: translateY(-50%);
        opacity: 0.3;
      }
    }
  }

  .background-wrapper {
    padding-bottom: 40px;
    background-color: #f2f3f7;
    overflow: hidden;

    @media screen and (max-width: 680px) {
      background-color: ${$WHITE};
    }
  }

  .hash-target {
    position: relative;
    top: -55px;
    width: 0;
    height: 0;
  }

  .no-content {
    padding: 80px 0;
    p {
      font-size: 13px;
    }
  }
`

const Community: React.FC = () => {
  const exploreApi = useCallAccessFunc(access => new ExploreApi(access));
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    query,
    pathname,
    asPath
  } = router;

  // Redux
  const {pending, currentFeed} = useMapStateToProps();
  const {categories, me} = useSelector(
    ({
      orm,
      system: {session: {id}},
      categories,
    }: RootState) => ({
      me: pickUserSelector(id)(orm),
      categories,
    }),
    shallowEqual
  );

  const {categoriesById} = categories;

  // State
  const {user_type, is_admin} = me || {} as IUser;
  const {purpose, page, order_by, q, category} = query || {};
  const [storyCount, setStoryCount] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState(q as string || '');
  const [isOnlinePage, setIsOnlinePage] = React.useState(false);
  const [guideBanner, setGuideBanner] = React.useState(LocalCache.get('community_guide', 'community_guide', 12 * MONTH)?.isGuide || false);
  const [initialized, setInitialized] = React.useState(false);

  // Effect
  React.useEffect(() => {
    dispatch(fetchCommunityThunk());
    dispatch(setLayout({headerDetail: '커뮤니티'}));

    return () => {
      dispatch(clearLayout());
    }
  }, []);

  const scroll = useScroll()[asPath] || [];
  const [, lastScrollYPosition] = scroll;

  // Page Initialization
  React.useEffect(() => {
    if (!initialized && lastScrollYPosition > 0 && !isEmpty(currentFeed)) {
      const autoScroll = () => {
        window.scrollTo({
          top: lastScrollYPosition,
          behavior: 'smooth'
        });
        setInitialized(true);
      };

      const timer = setTimeout(() => {
        if (document.body.scrollHeight < lastScrollYPosition) {
          const timer2 = setTimeout(() => {
            autoScroll()
          }, 2 * SECOND);

          return () => clearTimeout(timer2);
        } else {
          autoScroll();
        }
      }, 2 * SECOND);

      return () => clearTimeout(timer);
    }
  }, [currentFeed, document.body.scrollHeight, lastScrollYPosition, setInitialized]);

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

  // useCallback
  const setURL = React.useCallback((callback) => {
    const searchParams = callback(query);
    router.push(`/community?${queryString.stringify(searchParams)}${(searchParams.q || searchParams.page) ? '#story': ''}`);
  }, [query]);
  const onChangeHandler = (value) => {
    setSearchValue(value)
  };
  const onSubmitHandler = () => {
    setURL(curr => ({
      ...curr,
      page: 1,
      q: searchValue
    }));
  };

  // 플래닛 PICK 카테고리는 관리자만 글 작성이 가능합니다.
  const canWrite = React.useMemo(() => (
    categoriesById[category]?.name !== '플래닛 PICK' || is_admin
  ), [category, categoriesById, is_admin]);

  React.useEffect(() => {
    if (!isEmpty(categoriesById) && !!category)
      setIsOnlinePage(checkOnlinePage(categoriesById[category]?.name));

  }, [categoriesById, category]);

  if (pathname !== '/community' && categoriesById[category] === undefined)
    return <Page404/>;

  return (
    <>
      <OGMetaHead title="커뮤니티"/>
      <CommunityWrapper>
        {canWrite && (
          <WriteBtn
            onClick={() => router.push({
              pathname: '/community/new',
              ...(category && {query: {category}})
            })}
          >
            <img
              src={staticUrl('/static/images/icon/icon-write.png')}
              alt="글쓰기"
            />
            글쓰기
          </WriteBtn>
        )}
        {!guideBanner && (
          <CommunityGuideLink>
            <MaxWidthWrapper>
              <A
                to="https://bit.ly/2Ag08Hq"
              >
                <p>무엇이 바뀌었을까요? 커뮤니티 가이드를 봐주세요!</p>
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-arrow-right4.png')}
                  alt="자세히 보기"
                />
              </A>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setGuideBanner(true);
                  LocalCache.set('community_guide', 'community_guide', {isGuide: true});
                }}
              >
                <img
                  src={staticUrl('/static/images/icon/icon-close.png')}
                  alt="다시 보지 않기"
                />
              </button>
            </MaxWidthWrapper>
          </CommunityGuideLink>
        )}
        <BestPost
          userType={user_type}
        />
        <span className="hash-target" id="story"/>
        <CommunityNavigation/>
        {pending ? (
          <Loading/>
        ) : (
          <>
            {storyCount ? (
            <section className="story">
              {(q || page) && (
                <HashReload/>
              )}
              <div className="header">
                <MaxWidthWrapper>
                  <div className="count">
                    <em>{storyCount}건</em>의 글이 있습니다.
                  </div>
                  <SelectBox
                    option={ORDER_TYPE}
                    value={order_by as string || '-created_at'}
                    onChange={orderBy => setURL(curr => ({
                      ...curr,
                      order_by: orderBy
                    }))}
                  />
                </MaxWidthWrapper>
              </div>
              <MaxWidthWrapper className="center-wrapper">
                <ul>
                  {currentFeed.ids.map(({id, ...props}) => {
                    const {user_types} = props || {} as any;
                    const userTypeInKorean = USER_TYPE_TO_KOR[(user_types || [])[0]];

                    return props && (
                      <li>
                        {is_admin || (props.user_types || []).includes(user_type) ? (
                          <Link
                            key={id}
                            href="/community/[id]"
                            as={`/community/${id}`}
                          >
                            <a>
                              <StorySimple
                                key={id}
                                {...props}
                              />
                            </a>
                          </Link>
                        ) : (
                          <StorySimple
                            key={id}
                            onClick={() => alert(`${userTypeInKorean} 계정만 접속 가능한 공간입니다.`)}
                            {...props}
                          />
                        )}
                      </li>
                    )
                  })}
                </ul>
                <Pagination
                  currentPage={Number(page) || 1}
                  totalCount={storyCount}
                  pageSize={20}
                  pageGroupSize={5}
                  onClick={page => {
                    setURL(curr => ({
                      ...curr,
                      page
                    }))
                  }}
                />
                <SearchInput
                  value={searchValue}
                  placeholder="찾고 싶은 글이 있으신가요?"
                  onChange={onChangeHandler}
                  onSubmit={onSubmitHandler}
                  hasSearchIcon={true}
                  searchOnImg={staticUrl('/static/images/icon/icon-search.png')}
                />
              </MaxWidthWrapper>
            </section>
            ) : (
              <NoContentText
                alt="등록된 글이 없습니다."
              >
                <p>등록된 글이 없습니다.</p>
              </NoContentText>
            )}
          </>
        )}
        <div className="background-wrapper">
          <MaxWidthWrapper>
            {isOnlinePage && (
              <OnClassBanner/>
            )}
            <LatestStory/>
          </MaxWidthWrapper>
        </div>
      </CommunityWrapper>
    </>
  );
};

Community.displayName = 'Community';

Community.getInitialProps = () => {
  return {hideTalk: true};
};

export default loginRequired(
  userTypeRequired(
    Community,
    MAIN_USER_TYPES
  )
);
