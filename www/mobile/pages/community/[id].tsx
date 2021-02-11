import * as React from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {useRouter} from 'next/router';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import ExploreApi from '../../src/apis/ExploreApi';
import {fetchCommunityThunk} from '../../src/reducers/community/thunk';
import {errorOccuredStoryThunk} from '../../src/reducers/orm/story/thunks';
import {saveStory} from '../../src/reducers/orm/story/storyReducer';
import {pickStorySelector} from '../../src/reducers/orm/story/selector';
import Story from '../../components/story/branches/StoryDefault/detail';
import CommunityBoard from '../../components/community/CommunityBoard';
import LatestStory from '../../components/community/LatestStory';
import Loading from '../../components/common/Loading';
import {PROD_CLIENT_URL} from '../../src/constants/env';
import {DetailWrapperDiv, DetailLayoutDiv} from '../../components/community/detail';
import isEmpty from 'lodash/isEmpty';
import UserStory from '../../components/community/UserStory';
import BestPost from '../../components/community/BestPost';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import loginRequired from '../../hocs/loginRequired';
import Page403 from '../../components/errors/Page403';
import Breadcrumbs from '../../components/community/Breadcrumbs';
import {waterMarkOptions} from '../../components/story/story.config';
import {fetchCategoriesThunk} from '../../src/reducers/categories';
import OnClassBanner from '../../components/common/OnClassBanner';
import {checkOnlinePage} from '../../src/lib/community';
import userTypeRequired from '../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../src/constants/users';

const STORIES_DEFAULT_FIELD = {
  story: [],
  latest_stories: [],
  my_story_history: [],
  previous_stories: [],
  next_stories: [],
  error: false
};

const LABEL_ARR = ['human','user_all','only_me'];

const CommunityDetail: React.FC = () => {
  const {query: {id}} = useRouter();
  const dispatch = useDispatch();
  const exploreApi = useCallAccessFunc(access => new ExploreApi(access));

  // Reducer
  const {
    access,
    user: {name, id: userId} = {name: '', id: ''},
    story,
    categoriesById,
  } = useSelector(
    ({
      system: {
        session: {access, id: userId}
      },
      orm,
      categories: {categoriesById},
    }) => ({
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
        } else {
          !!story && dispatch(saveStory({...story, retrieved_at: new Date().getTime()}));
          setStories(curr => ({...curr, ...rest}));
        }
      })
      .catch(() => {
        setStories(curr => ({...curr, error: true}));
      });
  }, [id]);

  if (error) return <Page403/>;
  if (isEmpty(story)) return <Loading/>;

  const {
    user,
    menu_tag = {id: '', name: ''},
    tags = {},
    user_expose_type
  } = story;

  const {name: writerName, is_writer} = user || {} as any;

  const waterMarkProps = {
    options: waterMarkOptions,
    waterMarkText: `${name}_${userId}`
  };
  
  const isOnlinePage = checkOnlinePage(menu_tag?.name);

  return (
    <DetailWrapperDiv>
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
      <DetailLayoutDiv>
        <section className="story-detail-wrapper">
          <Story
            {...story}
            labelArr={LABEL_ARR}
            waterMarkProps={waterMarkProps}
            tags={[
              ...tags,
              menu_tag
            ]}
            isWriter={is_writer}
            access={access}
            shareUrl={`${PROD_CLIENT_URL}/community/${id}`}
            detail
            storyType="community"
          />
        </section>
          {isOnlinePage && (
            <OnClassBanner/>
          )}
        <section>
          {!isEmpty(story) && (
            <CommunityBoard
              title={(
                <h2>
                  <em>{menu_tag.name || '비슷한'}</em> 글 더보기
                </h2>
              )}
              data={[
                ...previous_stories,
                ...next_stories
              ]}
            />
          )}
        </section>
        <BestPost/>
        <LatestStory/>
        {(latest_stories && story && my_story_history && user_expose_type === 'real') && (
          <UserStory
            data={[latest_stories, my_story_history]}
            writerName={writerName}
            user_expose_type={user_expose_type}
          />
        )}
      </DetailLayoutDiv>
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
