import * as React from 'react';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import OGMetaHead from '../../components/OGMetaHead';
import Loading from '../../components/common/Loading';
import Page404 from '../../components/errors/Page404';
import Page403 from '../../components/errors/Page403';
import Page401 from '../../components/errors/Page401';
import StoryMobile from '../../components/story/StoryMobile2';
import {RootState} from '../../src/reducers';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {fetchStoryThunk} from '../../src/reducers/orm/story/thunks';
import {pickStorySelector} from '../../src/reducers/orm/story/selector';
import {FeedTitle} from './common2';
import {$POINT_BLUE, $WHITE} from '../../styles/variables.types';

export const StyledStoryMobile = styled(StoryMobile)`
  max-width: 760px;
  padding: 0 15px 15px;
  margin: auto;
  cursor: default;
  border: 0;
  
  ${FeedTitle} {    
    & > h2 {
      padding-right: 0;
      max-height: 100% !important;
      line-height: 1.5;
      -webkit-line-clamp: unset;

      span {
        display: block;
        padding-bottom: 5px;
        ${fontStyleMixin({size: 12, weight: 'bold', color: $POINT_BLUE})};
      }
    }
  }

  @media screen and (max-width: 680px) {
    padding: 0;
    border: 0;
  }
`;

const Section = styled.section`
  padding: 10px 0 100px;
  background-color: #f6f7f9;

  &.meetup {
    padding: 0 0 50px;
    background-color: ${$WHITE};

    @media screen and (max-width: 680px) {
      padding: 0 0 100px;
      background-color: #f6f7f9;
    }

    ${StyledStoryMobile} {
      max-width: 100%;
      padding: 0;
    }
  }
`;

const StoryDetailPage = () => {
  const {query: {id}} = useRouter();

  const dispatch = useDispatch();
  const story = useSelector(
    ({orm}: RootState) => pickStorySelector(id)(orm),
    shallowEqual,
  );

  React.useEffect(() => {
    dispatch(fetchStoryThunk(id));
  }, [id]);

  if (!story) {
    return <Loading/>;
  }

  if (story && story.hasOwnProperty('error')) {
    const {error: {status}} = story;

    switch(status) {
      case 404:
        return <Page404/>;
      case 403:
        return <Page403/>;
      case 401:
        return <Page401/>;
      default:
        return <Loading/>;
    }
  }

  try {
    return (
      <Section className={cn({meetup: story.extend_to === 'meetup'})}>
        <OGMetaHead title={(story && story.title) || '스토리를 불러오는 중...'} />
        {story && !isEmpty(story) ? (
          <StyledStoryMobile
            {...story}
            detail
          />
        ) : (<Loading/>)}
      </Section>
    );
  } catch(e) {
    return (<p>에러가 발생했습니다.</p>);
  }
};

export default StoryDetailPage;
