import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';
import styled from 'styled-components';
import Link from 'next/link';
import BandApi from '../../src/apis/BandApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import useLocation from '../../src/hooks/router/useLocation';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $LIGHT_BLUE, $THIN_GRAY} from '../../styles/variables.types';
import Loading from '../common/Loading';

const MoaCategoryUl = styled.ul`
  margin: 17px 0 40px;
  border-top: 2px solid ${$FONT_COLOR};
`;

const MoaCategoryLi = styled.li<{on?: boolean;}>`
  width: 100%;
  position: relative;

  &.save-category {
    a {
      margin-top: -1px;
      border-top: 1px solid ${$FONT_COLOR};
    }
    img {
      width: 24px;
      position: absolute;
      right: 5px;
      top: 9px;

      &.on {
        display: none;
      }
    }
  }

  a, div {
    display: block;
    width: 100%;
    position: relative;
    padding: 0 20px;
    box-sizing: border-box;
    ${heightMixin(45)};
    cursor: pointer;
    border-bottom: 1px solid ${$BORDER_COLOR};
  }
  
  span {
    position: relative;
    z-index: 1;
    ${fontStyleMixin({
      size: 14,
      color: '#999'
    })}
  }

  ${({on}) => on && `
    // 동균: 추후에 사용될 수 있음에 주석 처리함
    // &.save-category img {
    //   display: none;

    //   &.on {
    //     display: block !important;
    //   }
    // }

    .category-title {
      ${fontStyleMixin({
        weight: 'bold',
        color: `${$FONT_COLOR} !important`
      })}

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

    li {
      background-color: #f9f9f9;

      span {
        ${fontStyleMixin({
          weight: 'normal',
          color: '#999'
        })}
      }
    }
  `}
`;

interface Props {
  id: HashId;
}

const NoContentLi = styled.li`
  text-align: center;
  ${heightMixin(45)};
  ${fontStyleMixin({size: 14, color: $THIN_GRAY})}
  border-bottom: 1px solid ${$BORDER_COLOR};
`;

const MoaCategoryPC = React.memo<Props>(() => {
  // State
  const [isTimelineOpened, setIsTimelineOpened] = React.useState(false);
  const [myMoaTimelineList, saveTimelineList] = React.useState([]);

  // Params
  const {location: {search}} = useLocation();
  const parsedParmas = React.useMemo(() => queryString.parse(search), [search]);
  const {story, extend_to} = parsedParmas;

  // Api
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const getMyMoaTimelineList = React.useCallback(() => {
    if (!bandApi) {
      return <Loading/>;
    }

    bandApi.myBand({band_type: '["moa", "consultant"]'})
      .then(({data: {results}}) => !!results && saveTimelineList(results));
  }, []);

  // Life Cycle
  React.useEffect(() => {
    getMyMoaTimelineList();
  }, [getMyMoaTimelineList]);

  return (
    <MoaCategoryUl>
      <MoaCategoryLi on={isEmpty(parsedParmas) && !isTimelineOpened}>
        <Link
          href="/user/[id]"
          as="?"
          replace
        >
          <a>
            <span className="category-title">전체 글</span>
          </a>
        </Link>
      </MoaCategoryLi>
      <MoaCategoryLi
        on={isTimelineOpened}
        onClick={() => setIsTimelineOpened(!isTimelineOpened)}
      >
        <div>
          <span className="category-title">나의 MOA</span>
        </div>
        <ul>
          {isTimelineOpened && (
            !isEmpty(myMoaTimelineList) ? (
              myMoaTimelineList.map(({slug, name}) => (
                <MoaCategoryLi 
                  key={slug} 
                  onClick={e => e.stopPropagation()}
                >
                  <Link 
                    href="/band/[slug]" 
                    as={`/band/${slug}`}
                  >
                    <a>
                      <span>{name}</span>
                    </a>
                  </Link>
                </MoaCategoryLi>
              ))
            ) : (
              <NoContentLi>
                아직 가입한 MOA가 없습니다.
              </NoContentLi>
            )
          )}
        </ul>
      </MoaCategoryLi>
      <MoaCategoryLi on={(extend_to === 'meetup') && !isTimelineOpened}>
        <Link
          href="/user/[id]?extend_to=meetup"
          as="?extend_to=meetup"
          replace
          passHref
        >
          <a>
            <span className="category-title">세미나/모임</span>
          </a>
        </Link>
      </MoaCategoryLi>
      <MoaCategoryLi
        className="save-category"
        on={(story === 'follow') && !isTimelineOpened}
      >
        <Link
          href="/user/[id]?story=follow"
          as="?story=follow"
          replace
          passHref
        >
          <a>
            <span className="category-title">저장한 글</span>
            <img
              src={staticUrl('/static/images/icon/icon-heart-fill.png')}
              alt="저장"
            />
          </a>
        </Link>
      </MoaCategoryLi>
      <MoaCategoryLi className="save-category">
        <Link href="/wiki?_only=bookmarked_wiki">
          <a>
            <span className="category-title">저장한 처방사전</span>
            <img
              src={staticUrl('/static/images/icon/icon-dict-save.png')}
              alt="저장"
            />
            {/* <img
              src={staticUrl('/static/images/icon/icon-dict-save-on.png')}
              alt="저장on"
              className="on"
            /> */}
          </a>
        </Link>
      </MoaCategoryLi>
    </MoaCategoryUl>
  );
});

MoaCategoryPC.displayName = 'MoaCategoryPC';
export default MoaCategoryPC;
