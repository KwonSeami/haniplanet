import * as React from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import Router, {useRouter} from 'next/router';
import loginRequired from '../../../../../hocs/loginRequired';
import userTypeRequired from '../../../../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../../../../src/constants/users';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import TimelineApi from '../../../../../src/apis/TimelineApi';
import {pickUserSelector} from '../../../../../src/reducers/orm/user/selector';
import {pickStorySelector} from '../../../../../src/reducers/orm/story/selector';
import {errorOccuredStoryThunk, fetchStoryThunk} from '../../../../../src/reducers/orm/story/thunks';
import { saveStory, updateStory } from '../../../../../src/reducers/orm/story/storyReducer';
import Page403 from '../../../../../components/errors/Page403';
import Loading from '../../../../../components/common/Loading';
import {waterMarkOptions} from '../../../../../components/story/story.config';
import {DetailWrapperDiv, DetailLayoutDiv} from '../../../../../components/community/detail';
import {PROD_CLIENT_URL} from '../../../../../src/constants/env';
import isEmpty from 'lodash/isEmpty';
import {pickBandSelector} from '../../../../../src/reducers/orm/band/selector';
import {OnClassQASearch} from '../../../../../components/onClass/OnClassLeftArea/OnClassQABoard';
import {fetchBandThunk} from '../../../../../src/reducers/orm/band/thunks';
import BandApi from '../../../../../src/apis/BandApi';
import StoryDefault from '../../../../../components/story/branches/StoryDefault/detail';
import OnClassStoryMore from '../../../../../components/onClass/OnClassStoryMore';
import styled from 'styled-components';

const StyledDetailWrapperDiv = styled(DetailWrapperDiv)`
  ${DetailLayoutDiv} {
    margin-top: 0;
  }

  @media screen and (min-width: 680px) {
    padding-top: 20px;
  }
`;

const PAGE_SIZE = 50;
const PAGE_GROUP_SIZE = 5;

const OnClassDetail: React.FC = () => {
  const {query: {slug, q: _q, page: _page, id: storyId, timeline: timelineId}} = useRouter();
  const dispatch = useDispatch();
  const timelineApi = useCallAccessFunc(access => new TimelineApi(access));
  const bandApi = useCallAccessFunc(access => new BandApi(access));
  const [pending, setPending] = React.useState(true);
  const [timelineList, setTimelineList] = React.useState([]);
  const [q, setQ] = React.useState(_q);
  const [count, setCount] = React.useState(0);

  // Reducer
  const {
    access,
    user: {name, id: userId} = {name: '', id: ''},
    story,
    band
  } = useSelector(
    ({
      system: {
        session: {access, id: userId}
      },
      orm,
    }) => ({
      access,
      user: pickUserSelector(userId)(orm),
      story: pickStorySelector(storyId)(orm),
      band: pickBandSelector(slug)(orm)
    }),
    shallowEqual
  );

  const {
    user,
    comment_count,
    category,
    tags = {},
    user_expose_type
  } = story || {};

  const {
    timelines = [],
    band_member_grade,
  } = band || {};

  const timelineName = (timelines.filter(({id}) => id === timelineId)[0] || {}).name;
  const page = Number(_page) || 1;
  const {name: writerName, is_writer} = user || {} as any;

  const onChangeKeyword = React.useCallback(({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
    setQ(value);
  }, []);

  const onSearchKeyword = React.useCallback((keyword: string) => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return setURL('', page);
    }

    setURL(trimmedKeyword, page);
  }, []);

  // Effect
  React.useEffect(() => {
    dispatch(fetchStoryThunk(storyId));
    dispatch(fetchBandThunk(bandApi, slug));
    timelineApi.detail(timelineId, storyId)
      .then(({
        status,
        data: {result},
      }) => {
        if (Math.floor(status / 100) === 4) {
          dispatch(errorOccuredStoryThunk(storyId, {...result, status}));
        } else {
          dispatch(
            updateStory(
              storyId,
              ({...result, retrieved_at: new Date().getTime()}),
            )
          );
        }
      })
  }, [storyId, slug, timelineId]);

  React.useEffect(() => {
    timelineApi && timelineApi.list(timelineId, {
      page: 1,
      page_size: PAGE_SIZE,
      q
    }).then(({status, data: {count, results}}) => {
      setPending(true);
      if (status === 200) {
        setPending(false);
        setTimelineList(results);
        setCount(count);
      }
    });
  }, [slug, page, _q, comment_count]);

  const setURL = (q, page) => {
    Router.replace(
      {pathname: '/onclass/[slug]/timeline/[id]', query: {timeline: timelineId, q, page}},
      {pathname: `/onclass/${slug}/timeline/${storyId}`, query: {timeline: timelineId, q, page}},
    );
  };

  if (isEmpty(story)) return <Loading/>;

  const waterMarkProps = {
    options: waterMarkOptions,
    waterMarkText: `${name}_${userId}`
  };

  const isQnA = timelineName === "질문 및 답변";
  const isNotice = timelineName === "공지사항 및 학습자료실";

  return (
    <StyledDetailWrapperDiv>
      <DetailLayoutDiv>
        <section className="story-detail-wrapper">
          <StoryDefault
            {...story}
            waterMarkProps={waterMarkProps}
            labelArr={timelineId}
            shareUrl={`${PROD_CLIENT_URL}/onclass/${slug}/timeline/${storyId}?timeline=${timelineId}`}
            isWriter={is_writer}
            detail
            category={category}
            access={access}
            can_reaction={!!isQnA}
            isNotice={isNotice}
            storyType="community"
            can_comment={!(isQnA && band_member_grade === 'admin' && comment_count > 0)}
            isQnA={isQnA}
            band_member_grade={band_member_grade}
          />
        </section>
        <section>
          {!isEmpty(story) && (
            <>
              <OnClassStoryMore
                title={(
                  <h2>
                    <em>{timelineName || '비슷한'}</em> 글 더보기
                  </h2>
                )}
                data={timelineList}
                totalCount={count}
                isQnA={isQnA}
                children={
                  <>
                    {isQnA && (
                      <OnClassQASearch
                        placeholder="찾고 싶은 글이 있으신가요?"
                        value={q}
                        onChange={onChangeKeyword}
                        onSearch={onSearchKeyword}
                      />
                    )}
                  </>
                }
              />
            </>
          )}
        </section>
      </DetailLayoutDiv>
    </StyledDetailWrapperDiv>
  )
};

OnClassDetail.displayName = 'onClassDetail';

export default loginRequired(
  userTypeRequired(
    React.memo(OnClassDetail),
    MAIN_USER_TYPES
  )
);
