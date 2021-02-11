import * as React from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import ReactNotSSR from '@hanii/react-not-ssr';
import {fontStyleMixin, backgroundImgMixin, radiusMixin} from '../styles/mixins.styles';
import {$POINT_BLUE, $WHITE, $BORDER_COLOR, $FONT_COLOR} from '../styles/variables.types';
import OGMetaHead from '../components/OGMetaHead';
import SearchInput from '../components/UI/SearchInput';
import isEmpty from 'lodash/isEmpty';
import {BASE_URL, staticUrl} from '../src/constants/env';
import queryString from 'query-string';
import loginRequired from '../hocs/loginRequired';
import ModunawaMenu from '../components/modunawa/ModunawaMenu';
import {pushPopup} from '../src/reducers/popup';
import newModuItemPopup from '../components/layout/popup/NewModuItemPopup';
import Feed from '../components/Feed';
import Story from '../components/story/Story2';
import Loading from '../components/common/Loading';
import {numberWithCommas} from '../src/lib/numbers';
import {makeFeedKey} from '../src/lib/feed';
import SelectBox from '../components/inputs/SelectBox';
import {fetchNavsThunk} from '../src/reducers/nav';
import Link from 'next/link';
import {setLayout, clearLayout} from '../src/reducers/system/style/styleReducer';
import userTypeRequired from "../hocs/userTypeRequired";
import {RootState} from '../src/reducers';

const StoryTopTitle = styled.div`
  border-bottom: 1px solid ${$BORDER_COLOR};
  
  h2 {
    max-width: 680px;
    margin: auto;
    padding: 12px 0 11px;
    ${fontStyleMixin({
      weight: 'bold',
      color: $FONT_COLOR,
    })};

    img {
      display: inline-block;
      vertical-align: 6px;
      width: 22px;
      height: 11px;
      margin-left: 2px;
    }

    p {
      margin-top: 4px;
      ${fontStyleMixin({
        size: 14,
        color: '#999'
      })};
      opacity: 0.8;
    }
  }

  @media screen and (max-width: 680px) {
    padding: 0 15px;
  }
`;

const TagFeedDiv = styled.div`
  margin: auto;
  padding-bottom: 150px;

  .story-header {
    position: relative;
    overflow: hidden;

    > div:first-of-type {
      border-bottom: 1px solid #eee;
    }

    .modunawa-menu {
      padding: 11px 0;

      @media screen and (min-width: 680px) {
        padding: 12px 0;
      }
    }
    // 공동 구매
    .group-purchase {
      box-sizing: border-box;

      div {
        max-width: 680px;
        height: 82px;
        margin: auto;
        padding: 10px 0 0 15px;
        box-sizing: border-box;
        background-color: #499aff;
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/icon-group-purchase.png'),
          size: '82px',
          position: '100% 100%'
        })};

        p {
          max-width: 680px;
          line-height: 20px;
          margin: 0 auto 11px;
          ${fontStyleMixin({
            size: 13,
            color: 'rgba(255, 255, 255, 0.5)'
          })};
    
          span {
            ${fontStyleMixin({
              color: $WHITE
            })};
          }
        }
    
        button {
          line-height: 40px;
          ${radiusMixin('5px')};
          ${fontStyleMixin({
            size: 15,
            color: $WHITE,
            weight: 'bold'
          })};

          img {
            width: 16px;
            margin-left: 3px;
            margin-bottom: -2px;
          }
        }

        > img {
          width: 115px;
        }
      }
    }

    .request-write {
      padding: 16px 15px 12px;
      box-sizing: border-box;
      background-color: #f6f7f9;

      div {
        max-width: 680px;
        margin: auto;

        p {
          display: inline-block;
          max-width: 680px;
          margin: auto;
          ${fontStyleMixin({
            size: 13
          })};
    
          span {
            margin: auto;
            ${fontStyleMixin({
              color: $POINT_BLUE
            })};
          }
        }
    
        > span {
          display: block;
          width: 100%;
          height: 45px;
          line-height: 44px;
          margin-top: 8px;
          text-align: center;
          background-color: #499aff;
          ${radiusMixin('5px')};
          ${fontStyleMixin({
            size: 15,
            color: $WHITE,
            weight: 'bold'
          })};
        }
      }
    }

    .tabs {
      max-width: 680px;
      margin: auto;
    }
  }

  .tag-feed-title {
    position: relative;
    max-width: 680px;
    margin: auto;
    padding: 15px 0 0;
    background-color: ${$WHITE};

    .search-input{
      top: 2px;
      height: auto;
      padding-bottom: 0;
    }

    input[type="text"] {
      border-bottom: 1px solid ${$BORDER_COLOR};
    }

    img {
      top: 0;
    }

    @media screen and (max-width: 680px) {
      padding: 15px;
    }
  } 

  & .evaluation-count {
    max-width: 680px;
    margin: auto;
    position: relative;
    padding: 15px 0 0;
    
    h2 {
      padding-bottom: 10px;
      ${fontStyleMixin({
        size: 13,
        weight: 'bold',
      })};

      span {
        ${fontStyleMixin({
          color: $POINT_BLUE,
          weight: 'bold',
        })};
      }
    }

    @media screen and (max-width: 680px) {
      padding: 0 15px;
    }
  }

  .order-by-wrapper {
    position: relative;
    max-width: 680px;
    margin: auto;

    .select-box {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 150px;
      height: 42px;
      border-bottom: 0;
      z-index: 5;

      p{
        position: relative;
        padding: 0 14px;
        line-height: 45px;
        box-sizing: border-box;
        ${fontStyleMixin({
          size: 14,
        })};

        &::after {
          content: '';
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-49%);
          width: 11px;
          height: 6px;
            ${backgroundImgMixin({
              img: staticUrl('/static/images/icon/arrow/icon-story-select-arrow.png')
            })};
        }
        
        img {
          display: none;
        }
      }
      
      ul {
        margin-top: 0;

        li {
          margin-top: 0px;
          border-top-width: 0;
          box-sizing: border-box;

          &:first-child {
            border-top-width: 1;
            border-top: 1px solid ${$BORDER_COLOR};
          }
        }
      }

      &::-ms-expand {
        display: none;
      }
    }
  }

  .styled-feed-wrapper { 
    border-top: 10px solid #f2f3f7; 
  }
`;

const Ul = styled.ul`
  max-width: 680px;
  margin: auto;
  padding: 12px 15px;

  li {
    display: inline-block;
    box-sizing: border-box;
    width: 50%;
    height: 45px;
    line-height: 45px;
    padding: 0 14px;
    
    a, span {
      ${fontStyleMixin({
        size: 15,
        weight: 'bold',
        color: $WHITE
      })};
    }

    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      background-color: #55be90;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/banner/img-modunawa-add680.png'),
        size: 'auto 100%',
        position: 'right'
      })};
      
      img {
        width: 15px;
        margin: 0 0 -2px 4px;
      }
    }

    &:last-child {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      background-color: #001d34;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/banner/img-modunawa-req680.png'),
        size: 'auto 100%',
        position: 'right'
      })};

      a {
        display: block;
        margin: 0 -14px;
        padding: 0 14px;
      }
      
      img {
        width: 15px;
        margin: 0 0 -2px 4px;
      }
    }
  }
`;

export const StyledSelectBox = styled(SelectBox)`
  width: 150px;
  height: 42px;
  border-bottom: 0;
  display: inline-block;
  float: right;
  margin-top: 6px;

  p {
    position: relative;
    padding: 0 14px;
    line-height: 41px;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 14,
    })};

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-49%);
      width: 11px;
      height: 6px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/arrow/icon-story-select-arrow.png')
      })};
    }
    
    img {
      display: none;
    }
  }
  
  ul {
    margin-top: 0;

    li {
      margin-top: 0;
      border-top-width: 0;
      box-sizing: border-box;

      &:first-child {
        border-top-width: 1;
      }
    }
  }

  &::-ms-expand {
    display: none;
  }
`;

export const TAGS = {
  '소모품/의료기기': ['침', '부항컵', '추나베드', '소모품 기타'],
  '원외탕전': [],
  '원외탕전 약속상품': [],
  '한약재 회사': [],
  '한약제제': [],
  '인테리어': [],
  '한의학 도서': [],
  '세무기장': [],
  '기타': [],
};

export const TAG_LIST = Object.keys(TAGS)
  .filter(key => key !== '무엇이든 요청해보세요')
  .map(key => ({
    value: key,
    label: key,
    subTags: TAGS[key],
  }));

enum CurrentCategory {
  TagContent,
  RequestContent
}

const REQUEST_ORDER_BYS = [
  {
    label: '등록순',
    value: '-rated_at',
    selected: true
  },
  {
    label: '좋아요순',
    value: '-up_count'
  },
  {
    label: '댓글 많은순',
    value: '-comment_count'
  },
];


const TAG_ORDER_BYS = [
  {
    label: '쇼핑몰순',
    value: '-mall_count'
  },
  {
    label: '평점순',
    value: '-rating_sum'
  },
  {
    label: '참여자순',
    value: '-rating_count'
  },
  {
    label: '최신 참여순',
    value: '-rated_at',
  },
  {
    label: '최신 등록순',
    value: '-created_at'
  },
];

export const ORDER_BYS = [
  TAG_ORDER_BYS,
  REQUEST_ORDER_BYS
];

export const TAG_ON_MAP = Object.keys(TAGS).reduce((prev, curr) => {
  prev[curr] = curr;
  const subMenu = TAGS[curr];
  subMenu.forEach((menu) => {
    prev[menu] = curr;
  });
  return prev;
}, {});

const Professor = React.memo(() => {
  const router = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchNavsThunk());
  }, []);

  const {asPath, query} = router;
  const {tag: _tagQuery, q: _qQuery, order_by: _orderByQuery} = query;

  const {count, navs, tagId, _fetchURI} = useSelector(
    ({navs, system: {session: {id}}, feed}: RootState) => ({
      count: (feed[makeFeedKey(asPath)] || {}).count,
      navs,
      tagId: (navs.filter(({name}) => name === _tagQuery)[0]|| {}).id,
      _fetchURI : (navs && _tagQuery === '무엇이든 요청해보세요')
        ? `${BASE_URL}/tag/${(navs.filter(({name}) => name === _tagQuery)[0]|| {}).id}/story/`
        : `${BASE_URL}/price-comparison/`,
      myId: id
    }),
    shallowEqual,
  );
  const currentTab = _tagQuery === '무엇이든 요청해보세요'
    ? CurrentCategory.RequestContent
    : CurrentCategory.TagContent;

  const [q, setQ] = React.useState(_qQuery);
  const [fetchURI, setFetchURI] = React.useState(_fetchURI);

  React.useEffect(() => {
    setFetchURI(`${_fetchURI}?${queryString.stringify({
      tag: _tagQuery,
      q: _qQuery,
      order_by: _orderByQuery
    })}`);
  }, [_fetchURI, _tagQuery, _qQuery, _orderByQuery]);

  React.useEffect(() => {
    dispatch(setLayout({headerDetail: '모두나와'}));
    
    return () => {
      dispatch(clearLayout());
    }
  }, []);

  return (
    <>
      <StoryTopTitle>
        <h2>
          모두나와
          <img
            src={staticUrl('/static/images/icon/icon-story-beta.png')}
            alt="모두나와"
          />
          <p>
            한의학 제품, 리뷰, 가격 비교 한방에
          </p>
        </h2>
      </StoryTopTitle>
      <TagFeedDiv>
        <OGMetaHead
          title="모두나와"
          desc=""
        />
        <div className="story-header">
          <div className="modunawa-menu">
            <ModunawaMenu />
          </div>
          {currentTab === CurrentCategory.TagContent ? (
            <>
              <div className="group-purchase">
                <div>
                  <p>
                    <span>동방스프링 #1차공동구매 #종료</span><br/>
                    성원에 감사드립니다<br/>
                    더 좋은 제품! 좋은 가격!으로 준비하겠습니다.
                  </p>
                </div>
              </div>
              <Ul>
                <li>
                  <span
                    onClick={() => dispatch(pushPopup(newModuItemPopup))}
                  >
                    항목 등록
                    <img
                      src={staticUrl('/static/images/icon/icon-plus-white.png')}
                      alt="항목 등록하기"
                    />
                  </span>
                </li>
                <li>
                  <Link
                    as={`/modunawa?${queryString.stringify({
                      tag: "무엇이든 요청해보세요"
                    })}`}
                    href={`/modunawa?${queryString.stringify({
                      tag: "무엇이든 요청해보세요"
                    })}`}
                    passHref
                    replace
                  >
                    <a>
                      요청하기
                      <img
                        src={staticUrl('/static/images/icon/icon-link-white.png')}
                        alt="무엇이든 요청해보세요"
                      />
                    </a>
                  </Link>
                </li>
              </Ul>
            </>
          ) : (
            <div className="request-write">
              <div>
                <p>
                  모두나와 서비스 건의사항, 상품 추가, 한의원 관련 문의 등등!<br/>
                  <span>자유롭게 정보를 요청해보세요!</span>
                </p>
                {!isEmpty(tagId) && (
                  <span
                    className="pointer"
                    onClick={() => router.push(`/story/new?defaultTagId=${tagId}`)}
                  >
                  글 작성
                </span>
                )}
              </div>
            </div>
          )}
          <div className="tag-feed-title">
            <SearchInput
              value={q as string}
              onChange={({target: {value}}) => setQ(value)}
              onSearch={(value) => router.push({pathname: '/modunawa', query: {...query, q: value}})}
              placeholder={`${_tagQuery || '모두나와'} 내 상세 검색`}
            />
          </div>
          <div className="tabs">
            {!!count && (
              <>
                <div className="evaluation-count">
                  <h2>
                    <span>{numberWithCommas(count)}</span>개의 목록이 있습니다.
                  </h2>
                </div>
                <div className="order-by-wrapper">
                  <StyledSelectBox
                    value={_orderByQuery || ORDER_BYS[currentTab][0].value}
                    option={ORDER_BYS[currentTab]}
                    onChange={order_by => {
                      router.replace({
                        pathname: '/modunawa',
                        query: {q: q, order_by, tag: _tagQuery},
                      });
                    }}
                  />
                </div>
              </>
            )}
            {!isEmpty(navs) ? (
              <ReactNotSSR>
                <div className="styled-feed-wrapper">
                  <Feed
                    fetchURI={fetchURI}
                    component={Story}
                    highlightKeyword={q as string}
                    passProps={{themeType: 'title'}}
                  />
                </div>
              </ReactNotSSR>
            )
            : <Loading/>
            }
          </div>
        </div>
      </TagFeedDiv>
    </>
  );
});

Professor.displayName = 'Professor';

export default loginRequired(
  userTypeRequired(
    React.memo(Professor),
    ['doctor', 'student']
  )
);
