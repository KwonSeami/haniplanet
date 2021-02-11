import * as React from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Feed from '../components/Feed/index';
import StoryMobile from '../components/story/StoryMobile2';
import {makeFeedKey} from '../src/lib/feed';
import {fontStyleMixin, backgroundImgMixin} from '../styles/mixins.styles';
import {pickTagSelector} from '../src/reducers/orm/tag/selector';
import {$POINT_BLUE, $WHITE, $BORDER_COLOR, $FONT_COLOR, $GRAY, $TEXT_GRAY} from '../styles/variables.types';
import OGMetaHead from "../components/OGMetaHead";
import {pickUserSelector} from '../src/reducers/orm/user/selector';
import SearchInput from '../components/UI/SearchInput';
import throttle from 'lodash/throttle';
import {BASE_URL, staticUrl} from '../src/constants/env';
import queryString from 'query-string';
import loginRequired from "../hocs/loginRequired";
import {numberWithCommas} from '../src/lib/numbers';
import SelectBox from '../components/inputs/SelectBox';
import {pushPopup} from '../src/reducers/popup';
import newRatingItem from '../components/layout/popup/NewRatingItem';
import {setLayout, clearLayout} from '../src/reducers/system/style/styleReducer';
import userTypeRequired from "../hocs/userTypeRequired";


const StoryTopTitle = styled.div`
  h2 {
    max-width: 680px;
    margin: auto;
    padding: 9px 0 11px;
    ${fontStyleMixin({
      weight: 'bold',
      color: $FONT_COLOR
    })}

    p {
      margin-top: 6px;
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

const TopNoticeUpper = styled.div`
  padding: 10px 15px;
  background-color: #eff1f4;
  p {
    position: relative;
    max-width: 680px;
    margin: 0 auto;
    padding-left: 15px;
    line-height: 1;
    ${fontStyleMixin({
      size: 11,
      color: $GRAY,
    })};

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 11px;
      height: 11px;
      background-color: ${$GRAY};
      border-radius: 50%;
      text-align: center;
      line-height: 11px;
      content: '!';
      ${fontStyleMixin({
        size: 10,
        color: $WHITE,
        weight: '100'
      })};
    }

    span {
      color: ${$TEXT_GRAY};
    }
  }
`;

const TopNotice = styled.div`
  padding: 8px 15px;
  background-color: #f6f7f9;
  box-sizing: border-box;
  line-height: 19px;
  ${fontStyleMixin({
    size: 13,
    color: $FONT_COLOR
  })};

  @media screen and (min-width: 680px) {
    padding: 8px 0;
  }

  dl {
    display: table;
    table-layout: fixed;
    width: 100%;
  }
  dt, dd {
    display: table-cell;
    vertical-align: top;
  }

  dt {
    width: 60px;
    color: ${$POINT_BLUE};
  }
  dd {
    span {
      color: ${$TEXT_GRAY};
    }
  }
  dl, p {
    max-width: 680px;
    margin: 0 auto;
  }
  dl + p {
    margin-top: 5px;
  }
  p {
    small {
      line-height: 16px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })}
    }

    span {
      margin-left: 4px;
      color: ${$POINT_BLUE};
    }

    em {
      margin-left: 4px;
      font-style: normal;
      text-decoration: underline;
    }
  }
`;

const TagFeedDiv = styled.div`
  max-width: 680px;
  margin: auto;
  padding-bottom: 150px;

  .story-header {
    position: relative;

    .professor-add {
      margin-top: 12px;

      & > span {
        position: relative;
        display: block;
        height: 45px;
        line-height: 45px;
        text-align: center;
        border-radius: 6px;
        ${backgroundImgMixin({
          img: staticUrl('/static/images/banner/img-professor-add680.png'),
        })};
        ${fontStyleMixin({
          size: 15,
          weight: 'bold',
          color: $WHITE
        })};
    
        img {
          width: 15px;
          margin: 0 0 -2px 4px;
        }
      }

      @media screen and (max-width: 680px) {
        padding: 0 15px;

        & > span {
          ${backgroundImgMixin({
            img: staticUrl('/static/images/banner/img-professor-add.png'),
          })};
        }
      }
    }

    .tag-feed-title {
      position: relative;
      padding: 15px 0;
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
      margin: auto;
      position: relative;
      padding: 0;
      
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
  }
`;

const StyledFeed = styled(Feed)`
  border-top: 10px solid #f2f3f7;
  margin-top: -1px;
  
  & > div {
    padding: 0;
  }
`;

const StyledSelectBox = styled(SelectBox)`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 150px;
  height: 42px;
  border-bottom: 0;

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
`;

const ORDER_BYS = [
  {
    label: '최신 참여순',
    value: '-rated_at',
    selected: true
  },
  {
    label: '참여자순',
    value: '-rating_count',
  },
  {
    label: '베스트순',
    value: '-best_sum'
  },
  {
    label: '총점순',
    value: '-rating_sum'
  },
  {
    label: '최신 등록순',
    value: '-created_at'
  },
  {
    label: '댓글순',
    value: '-comment_count'
  }
];

const FETCH_URL = `${BASE_URL}/professor/`;

const Professor = React.memo(() => {
  const router = useRouter();
  const {asPath} = router;
  const {id, tag: _tagQuery, q: _qQuery, order_by: _orderByQuery} = router.query;
  const dispatch = useDispatch()

  let _fetchURI = FETCH_URL;
  if (_tagQuery) {
    _fetchURI += `?${queryString.stringify({tag: _tagQuery})}`;
  }
  if (_qQuery) {
    _fetchURI += `?${queryString.stringify({q: _qQuery})}`;

  }

  React.useEffect(() => {
    setFetchURI(`${FETCH_URL}?${queryString.stringify({
      tag: _tagQuery,
      q: _qQuery,
      order_by: _orderByQuery
    })}`);
  }, [_tagQuery, _qQuery, _orderByQuery]);

  const {count, access, tag} = useSelector(
    ({feed, orm, system: {session: {access, id: userId}}}) => ({
      access,
      userId,
      tag: pickTagSelector(id)(orm) || {},
      count: (feed[makeFeedKey(asPath)] || {}).count,
      user: pickUserSelector(userId)(orm)
    }),
    shallowEqual,
  );

  const [q, setQ] = React.useState(_qQuery);
  const [fetchURI, setFetchURI] = React.useState(_fetchURI);
  const throttledSetFetchURI = React.useCallback(throttle(setFetchURI, 700), []);

  React.useEffect(() => {
    dispatch(setLayout({
      headerDetail: '김원장넷'
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, []);

  return (
    <>
      <StoryTopTitle>
        <h2>
          김원장넷
          <p>
            한의학의 세상은 넓고 교수는 많다
          </p>
        </h2>
      </StoryTopTitle>
      <TopNoticeUpper>
        <p>알려드립니다! <span>(2020.05.21기준)</span></p>
      </TopNoticeUpper>
      <TopNotice>
        <dl>
          <dt>Best 학교</dt>
          <dd>
            <strong>원광대</strong>
            <span>/</span>세명대
            <span>/</span>부산대
            <span>/</span>가천대
            <span>/</span>상지대
          </dd>
        </dl>
        <dl>
          <dt>Best 교수</dt>
          <dd>
            <strong>김동일(동국대)</strong>
            <span>/</span>서형식(부산대)
            <span>/</span>성현경(세명대)
            <span>/</span>서일복(세명대)
            <span>/</span>고흥(세명대)
          </dd>
        </dl>
      </TopNotice>
      <TagFeedDiv>
        <OGMetaHead
          title="김원장넷"
          desc="12개 한의대 교수 익명 평가 시스템. 참여해보세요 함께 만드는 한의학"
        />
        <div className="story-header">
          <div className="professor-add">
            <span
              onClick={() => dispatch(pushPopup(newRatingItem))}
              className="pointer"
            >
              항목 등록
              <img
                src={staticUrl('/static/images/icon/icon-professor-add.png')}
                alt="항목 등록하기"
              />
            </span>
          </div>
          <div className="tag-feed-title">
            <SearchInput
              value={q as string}
              onChange={({target: {value}}) => {
                setQ(value);
                throttledSetFetchURI(`${_fetchURI}?q=${value}`);
              }}
              placeholder={`${_tagQuery || '김원장넷'} 내 상세 검색`}
            />
          </div>
          <div className="evaluation-count">
            {!!count && (
              <h2>
                <span>{`${numberWithCommas(count)}건`}</span>의 평가 목록이 있습니다.
              </h2>
            )}
          </div>
          <StyledSelectBox
            value={_orderByQuery as string || '-rated_at'}
            option={ORDER_BYS}
            onChange={order_by => {
              router.replace(`/professor?${queryString.stringify({
                q,
                tag: _tagQuery,
                order_by
              })}`);
            }}
          />
        </div>
        <StyledFeed
          fetchURI={fetchURI}
          component={StoryMobile}
        />
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
