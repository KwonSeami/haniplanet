import * as React from 'react';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Story2 from '../story/Story2';
import OGMetaHead from '../OGMetaHead';
import Loading from '../common/Loading';
import Page404 from '../errors/Page404';
import Page403 from '../errors/Page403';
import Page401 from '../errors/Page401';
import useSetPageNavigation from '../../src/hooks/useSetPageNavigation';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {fetchStoryThunk} from '../../src/reducers/orm/story/thunks';
import {pickStorySelector} from '../../src/reducers/orm/story/selector';
import {RootState} from '../../src/reducers';
import {BlindDiv} from './StoryBlind';
import {FeedTitle, LayerPopUpUl, MoreBtn} from './common2';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $WHITE} from '../../styles/variables.types';

const Section = styled.section`
  padding: 50px 0 100px;
  position: relative;
  width: 100%;
  background-color: #f6f7f9;
  box-sizing: border-box;
`;

const StyledLink = styled.a`
  display: block;
  position: fixed;
  left: 40px;
  top: 50vh;
  ${fontStyleMixin({size: 15, color: $GRAY})};
  
  img {
    width: 30px;
    display: inline-block;
    vertical-align: middle;
    margin: -5px 11px 0 0;
  }
`;

const StyledStory = styled(Story2)`
  width: 760px;
  margin: auto;
  box-sizing: border-box;
  padding: 22px 40px 40px;
  background-color: ${$WHITE};
  border: 0;
  cursor: default;

  ${FeedTitle} {
    padding: 19px 0 20px;
    border-bottom: 1px solid ${$BORDER_COLOR};

    
    & > h2 {
      padding-right: 64px;

      @media all and (-ms-high-contrast: none),
      (-ms-high-contrast: active) {
        max-height: 60px;
      }

      &, & > a {
        line-height: 31px;
        ${fontStyleMixin({size: 22, weight: '300'})};
      }

      span {
        display: block;
        padding-bottom: 10px;
        ${fontStyleMixin({size: 12, weight: 'bold', color: $POINT_BLUE})};
      }
    }

    & > ul {
      margin-top: 21px;

      &.user-label {
        top: auto;
        padding-top: 0 !important;
        bottom: 18px;
        right: 2px;
      }
    }

    ${LayerPopUpUl} {
      right: 42px;
      top: 52px;
    }
  }

  ${BlindDiv} {
    padding: 80px 0;
  }

  ${MoreBtn} {
    right: 42px;
    top: 43px;
  }
`;

const StoryDetailPage = () => {
  const router = useRouter();
  const {id} = router.query;

  const dispatch = useDispatch();
  const story = useSelector(
    ({orm}: RootState) => pickStorySelector(id as string)(orm),
    shallowEqual,
  );

  const {band_type, extend_to, is_band_story} = story || {} as any;
  const mainLink = extend_to === 'meetup' ? '/meetup' : '/';
  const bandLink = band_type === 'onclass' ? '/onclass' : '/band';

  // Custom Hooks
  useSetPageNavigation(
    is_band_story
      ? bandLink
      : extend_to === 'normal'
      ? '/community'
      : `/${extend_to}`
  );

  React.useEffect(() => {
    dispatch(fetchStoryThunk(id));
  }, [id]);

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
      <Section>
        <OGMetaHead title={(story && story.title) || '스토리를 불러오는 중...'} />
        <Link
          href={mainLink}
          as={mainLink}
          shallow
        >
          <StyledLink>
            <img
              src={staticUrl('/static/images/icon/arrow/icon-big-shortcuts.png')}
              alt="Main"
            />
            Main
          </StyledLink>
        </Link>
        {story && !isEmpty(story) ? (
          <StyledStory
            {...story}
            detail
          />
        ) : <Loading />}
      </Section>
    );
  } catch(e) {
    return (<p>에러가 발생했습니다.</p>);
  }
};

export default StoryDetailPage;
