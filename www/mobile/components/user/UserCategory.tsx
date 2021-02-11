import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import BandApi from '../../src/apis/BandApi';
import useSaveApiResult from '../../src/hooks/useSaveApiResult';
import useMultipleRef from '../../src/hooks/element/useMultipleRef';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$FONT_COLOR, $LIGHT_BLUE} from '../../styles/variables.types';

const UserCategoryDiv = styled.div`
  position: relative;
  max-width: 680px;
  height: 48px;
  margin: 0 auto;
  overflow-x: auto;
  white-space: nowrap;
  
  span {
    position: relative;
    margin-right: 16px;
    line-height: 48px;
    ${fontStyleMixin({
      size: 15,
      color: '#999'
    })};
    
    &.on {
      ${fontStyleMixin({
        color: $FONT_COLOR,
        weight: 'bold'
      })};
  
      &::after {
        content:'';
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: -1;
        width: 100%;
        height: 50%;
        background-color: ${$LIGHT_BLUE};
      }
    }
  }

  @media screen and (max-width: 680px) {
    padding-left: 15px;
  }
`;

const CATEGORY_ALL = 'all';
const CATEGORY_MOA = 'moa';
const CATEGORY_MEETUP = 'meetup';
const CATEGORY_FOLLOW = 'follow';
const CATEGORY_WIKI = 'wiki';

const CATEGORY_LIST = [CATEGORY_ALL, CATEGORY_MOA, CATEGORY_MEETUP, CATEGORY_FOLLOW, CATEGORY_WIKI];

const UserCategoryTest = React.memo(() => {
  // Router
  const {query: {story, extend_to}} = useRouter();

  // State
  const [isTimelineOpened, setIsTimelineOpened] = React.useState(false);

  // Api
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));
  const {resData: myMoaTimelineList} = useSaveApiResult(() => (
    bandApi && bandApi.myBand({band_type: '["moa", "consultant"]'})
  ));

  const myMoaSlugList = React.useMemo(() => (myMoaTimelineList || []).map(({slug}) => slug), [myMoaTimelineList]);

  // Ref
  const categoryItemRef = useMultipleRef(CATEGORY_LIST);
  const myMoaItemRef = useMultipleRef(myMoaSlugList);

  const isAllPost = !story && !extend_to && !isTimelineOpened;

  return (
    <UserCategoryDiv
      className="category"
    >
      <Link 
        href="/user/[id]" 
        as="?" 
        replace
      >
        <a ref={categoryItemRef[CATEGORY_ALL]}>
          <span className={cn({on: isAllPost})}>
            전체 글
          </span>
        </a>
      </Link>
      <span
        ref={categoryItemRef[CATEGORY_MOA]}
        className={cn('pointer', {on: isTimelineOpened})}
        onClick={() => setIsTimelineOpened(curr => !curr)}
      >
        나의 MOA
        </span>
      {(isTimelineOpened && !isEmpty(myMoaTimelineList)) && (
        myMoaTimelineList.map(({slug, name}) => (
          <Link
            key={slug}
            href="/band/[slug]"
            as={`/band/${slug}`}
          >
            <a ref={myMoaItemRef[slug]}>
              <span>{name}</span>
            </a>
          </Link>
        ))
      )}
      <Link
        href={`/user/[id]?extend_to=${CATEGORY_MEETUP}`}
        as={`?extend_to=${CATEGORY_MEETUP}`}
        passHref
        replace
      >
        <a ref={categoryItemRef[CATEGORY_MEETUP]}>
          <span className={cn({on: (extend_to === CATEGORY_MEETUP) && !isTimelineOpened})}>
            세미나/모임
          </span>
        </a>
      </Link>
      <Link
        href={`/user/[id]?story=${CATEGORY_FOLLOW}`}
        as={`?story=${CATEGORY_FOLLOW}`}
        replace
      >
        <a ref={categoryItemRef[CATEGORY_FOLLOW]}>
          <span className={cn({on: (story === CATEGORY_FOLLOW) && !isTimelineOpened})}>
            저장한 글
          </span>
        </a>
      </Link>
      <Link
        href="/wiki?_only=bookmarked_wiki"
        as="/wiki?_only=bookmarked_wiki"
      >
        <a ref={categoryItemRef[CATEGORY_WIKI]}>
          <span>저장한 처방사전</span>
        </a>
      </Link>
    </UserCategoryDiv>
  );
});

export default UserCategoryTest;