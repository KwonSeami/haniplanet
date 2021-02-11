import * as React from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {useRouter} from 'next/router';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import ExploreApi from '../../src/apis/ExploreApi';
import {fetchCommunityThunk} from '../../src/reducers/community/thunk';
import {errorOccuredStoryThunk} from '../../src/reducers/orm/story/thunks';
import {saveStory} from '../../src/reducers/orm/story/storyReducer';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {pickStorySelector} from '../../src/reducers/orm/story/selector';
import StoryDetail from '../../components/story/branches/StoryDefault/StoryDetail';
import CommunityBoard from '../../components/community/CommunityBoard';
import LatestStory from '../../components/community/LatestStory';
import LatestComment from '../../components/community/LatestComment';
import StorySlider from '../../components/community/detail/StorySlider';
import FollowMenu from '../../components/FollowMenu';
import FloatingMenu from '../../components/community/detail/FloatingMenu';
import Loading from '../../components/common/Loading';
import {PROD_CLIENT_URL} from '../../src/constants/env';
import {DetailWrapperDiv, LeftFeedDiv, RightFeedDiv} from '../../components/community/detail';
import isEmpty from 'lodash/isEmpty';
import loginRequired from '../../hocs/loginRequired';
import Page403 from '../../components/errors/Page403';
import Breadcrumbs from '../../components/community/detail/Breadcrumbs';
import {waterMarkOptions} from '../../components/story/story.config';
import PopularStory from '../../components/community/PopularStory';
import useSetPageNavigation from '../../src/hooks/useSetPageNavigation';
import {MaxWidthWrapper} from '../../components/community/common';
import {HEADER_HEIGHT} from "../../styles/base.types";
import throttle from "lodash/throttle";
import {fetchCategoriesThunk} from '../../src/reducers/categories';
import CommunitySideMenu from '../../components/community/CommunitySideMenu';
import AdditionalContent from '../../components/layout/AdditionalContent';
import {checkOnlinePage} from '../../src/lib/community';
import OnClassBanner from '../../components/common/OnClassBanner';
import {MAIN_USER_TYPES} from '../../src/constants/users';
import userTypeRequired from '../../hocs/userTypeRequired';

const STORIES_DEFAULT_FIELD = {
  story: [],
  latest_stories: [],
  my_story_history: [],
  previous_stories: [],
  next_stories: [],
  error: false
};

const FOOTER_HEIGHT = 280;

const LABEL_ARR = ['human','user_all','only_me'];

const CommunityDetail: React.FC = () => {
  const {query: {id}} = useRouter();
  const dispatch = useDispatch();
  const exploreApi = useCallAccessFunc(access => new ExploreApi(access));

  const sideMenu = React.useRef(null);
  // Reducer
  const {
    access,
    user: {name, id: userId} = {name: '', id: ''},
    story,
    categoriesById
  } = useSelector(
    ({system: {session: {access, id: userId}}, orm, categories: {categoriesById}}) => ({
      access,
      user: pickUserSelector(userId)(orm),
      story: pickStorySelector(id)(orm),
      categoriesById,
    }),
    shallowEqual
  );

  // State
  const [{
    my_story_history,
    latest_stories,
    previous_stories = [],
    next_stories = [],
    error
  }, setStories] = React.useState(STORIES_DEFAULT_FIELD);

  const [isOnPosition, setIsOnPosition] = React.useState(false);

  useSetPageNavigation('/community');

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

  React.useEffect(() => {
    if (browserHeightIsSmallerThanSideMenuHeight) {
      window.addEventListener('scroll', throttleHandleScrollWindow);

      return () => {
        window.removeEventListener('scroll', throttleHandleScrollWindow);
      }
    }
  }, [browserHeightIsSmallerThanSideMenuHeight]);

  // Effect
  React.useEffect(() => {
    dispatch(fetchCategoriesThunk());
    dispatch(fetchCommunityThunk());

    exploreApi.detail(id)
      .then(({
        status,
        data: {result: {story, ...rest}},
      }) => {
        if (Math.floor(status / 100) === 4) {
          dispatch(errorOccuredStoryThunk(id, {...story, status}));
          setStories(curr => ({...curr, error: true}));
        } else {
          !!story && dispatch(saveStory({...story, retrieved_at: new Date().getTime()}));
          setStories(curr => ({...curr, ...rest}));
        }
      })
      .catch(() => {
        setStories(curr => ({...curr, error: true}));
      });
  }, [id]);

  if(error) return <Page403/>
  if(isEmpty(story)) return <Loading/>

  const {
    user,
    title,
    comment_count,
    retrieve_count,
    menu_tag = {id: '', name: ''},
    user_expose_type
  } = story;
  const {
    name: writerName,
    is_writer
  } = user || {};

  const waterMarkProps = {
    options: waterMarkOptions,
    waterMarkText: `${name}_${userId}`
  };

  const isOnlinePage = checkOnlinePage(menu_tag?.name);

  return (
    <DetailWrapperDiv>
      <CommunitySideMenu
        category={menu_tag?.id}
        ref={sideMenu}
        isOnPosition={isOnPosition}
        isFetchingCallback={() => throttleCompareBrowserHeight()}
      />
      <MaxWidthWrapper>
        <FollowMenu
          top={0}
          right={-25}
          menuCompFn={() => (
            <FloatingMenu
              {...story}
              isOnlinePage={isOnlinePage}
              isStoryDetail
            />
          )}
        >
          <div className="detail-wrapper clearfix">
            <LeftFeedDiv>
              <Breadcrumbs
                userType={
                  (!!menu_tag.id && !!categoriesById[menu_tag.id])
                    ? categoriesById[menu_tag.id].user_type
                    : null
                  }
                menuId={
                  !!menu_tag.id
                    ? menu_tag.id
                    : null
                  }
                menuName={
                  (!!menu_tag.id && !!categoriesById[menu_tag.id])
                    ? categoriesById[menu_tag.id].name
                    : null
                  }
              />
              <section>
                <StoryDetail
                  {...story}
                  waterMarkProps={waterMarkProps}
                  labelArr={LABEL_ARR}
                  shareUrl={`${PROD_CLIENT_URL}/community/${id}`}
                  isWriter={is_writer}
                  detail
                  access={access}
                  onlineView={isOnlinePage}
                  storyType="community"
                />
              </section>
                <section>
                  {!isEmpty(story) && (
                    <StorySlider
                      title={`${menu_tag.name || '비슷한'} 글 더보기`}
                      data={[
                        ...next_stories,
                        {title, comment_count, retrieve_count},
                        ...previous_stories,
                      ]}
                    />
                  )}
                </section>
              <section>
                <PopularStory />
              </section>
            </LeftFeedDiv>
            <RightFeedDiv>
              <>
                {isOnlinePage && (
                  <OnClassBanner/>
                )}
                <LatestStory />
                <LatestComment />
                {(user_expose_type === 'real' && writerName) && (
                  (latest_stories && story) ? (
                    <CommunityBoard
                      title={(
                        <>
                          {writerName}<span>님의 최신글</span>
                        </>
                      )}
                      data={latest_stories}
                      pageSize={5}
                    />
                  ) : (
                      <Loading />
                    )
                )}
                {my_story_history ? (
                  <CommunityBoard
                    title="내가 본 글"
                    data={my_story_history}
                    pageSize={5}
                    isHistoryData
                  />
                ) : (
                    <Loading />
                  )}
                <AdditionalContent hideFooter />
              </>
            </RightFeedDiv>
          </div>
        </FollowMenu>
      </MaxWidthWrapper>
    </DetailWrapperDiv>
  )
}

CommunityDetail.displayName = 'communityDetail';

export default loginRequired(
  userTypeRequired(
    React.memo(CommunityDetail), 
    MAIN_USER_TYPES
  )
);

