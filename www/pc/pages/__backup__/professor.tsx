import * as React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import {$POINT_BLUE, $BORDER_COLOR, $FONT_COLOR, $GRAY, $TEXT_GRAY, $WHITE} from '../../styles/variables.types';
import {fontStyleMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import {BASE_URL, staticUrl} from '../../src/constants/env';
import Feed from '../../components/Feed/index';
import {shallowEqual, useSelector} from 'react-redux';
import Story2 from '../../components/story/Story2';
import {makeFeedKey} from '../../src/lib/feed';
import {useRouter} from 'next/router';
import OGMetaHead from "../../components/OGMetaHead";
import {FeedContentDiv, LeftFeed} from "../../components/search/styleCompPC";
import AdditionalContent from "../../components/layout/AdditionalContent";
import {MenuLi, MenuUl} from "../../components/common/Menu";
import SearchInput from "../../components/UI/SearchInput";
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import queryString from "query-string";
import classNames from "classnames";
import loginRequired from "../../hocs/loginRequired";
import {numberWithCommas} from '../../src/lib/numbers';
import SelectBox from '../../components/inputs/SelectBox';
import useSaveApiResult from '../../src/hooks/useSaveApiResult';
import Loading from '../../components/common/Loading';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import ProfessorApi from '../../src/apis/ProfessorApi';
import DetailPageBanner from '../../components/UI/banner/DetailPageBanner';
import ProfessorItemAdd from '../../components/ProfessorItemAdd';
import WaypointHeader from '../../components/layout/header/WaypointHeader';
import useSetPageNavigation from '../../src/hooks/useSetPageNavigation';
import useSetFooter from '../../src/hooks/useSetFooter';
import userTypeRequired from "../../hocs/userTypeRequired";
import {RootState}  from '../../src/reducers';

const LAYOUT_WIDTH = '680px';

const StyledFeedContentDiv = styled(FeedContentDiv)`
  padding: 40px 45px 100px;

  > section.additional-content {
    ${MenuUl} {
      margin-bottom: 30px;

      ${MenuLi} {
        p {
          display:inline-block;
          float: right;
          ${fontStyleMixin({
            size: 13,
            color: '#999'
          })}
        }
    
        &.on {
          p {
            ${fontStyleMixin({
              weight: 'bold',
              color: $FONT_COLOR
            })};
          }
        }
      }
    }
  }
`;

const TagFeedDiv = styled.div`
  position: relative;
  margin: 15px auto 0;
  padding-bottom: 88px;

  & > .evaluation-count {
    width: ${LAYOUT_WIDTH};
    margin: auto;
    position: relative;
    
    h2 {
      padding-bottom: 10px;
      line-height: normal;
      ${fontStyleMixin({
        size: 14,
        weight: 'bold',
      })};

      span {
        ${fontStyleMixin({
          color: $POINT_BLUE,
          weight: 'bold',
        })};
      }
    }
  }
`;

const StyledSelectBox = styled(SelectBox)`
  position: absolute;
  right: 0;
  top: -10px;
  width: 150px;
  height: 42px;
  border-bottom: 0;

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
      margin-top: 0px;
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

const TopNoticeUpper = styled.p`
  position: relative;
  padding: 0 14px;
  margin-bottom: 5px;
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
`

const TopNotice = styled.div`
  width: 100%;
  padding: 16px 20px 15px;
  border: solid 1px ${$BORDER_COLOR};
  box-sizing: border-box;

  p {
    font-size: 14px;
    line-height: 23px;

    span {
      margin-left: 4px;
      color: ${$POINT_BLUE};
    }

    em {
      font-style: normal;
      color: ${$POINT_BLUE};
    }

    small {
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })};
    }
  }
`;


const FETCH_URL = `${BASE_URL}/professor/`;

const Professor = React.memo(() => {
  const router = useRouter();
  const {asPath, query} = router;
  const {tag: _tagQuery, q: _qQuery, order_by: _orderByQuery} = query;

  // Custom Hooks
  useSetPageNavigation('/professor');

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

  const {count} = useSelector(
    ({feed, orm, system: {session: {access, id: userId}}}: RootState) => ({
      userId,
      access,
      count: (feed[makeFeedKey(asPath)] || {}).count,
      user: pickUserSelector(userId)(orm),
    }),
    shallowEqual
  );

  const professorApi: ProfessorApi = useCallAccessFunc(access => access && new ProfessorApi(access));
  const {resData: professorCountList = []} = useSaveApiResult(() =>
      professorApi && professorApi.retrieve('count')
  );

  const [q, setQ] = React.useState(_qQuery);
  const [fetchURI, setFetchURI] = React.useState(_fetchURI);

  // Custom Hook
  useSetFooter(false);

  return (
    <WaypointHeader
      themetype="white"
      headerComp={
        <DetailPageBanner
          bgImgSrc = "/static/images/banner/img-bg-professor.jpg"
        >
          <div className="center">
            <h2>
              <span>김원장넷</span>
              <p>
                한의학의 세상은 넓고 교수는 많다
              </p>
            </h2>
          </div>
        </DetailPageBanner>
      }
    >
      <div>
        <OGMetaHead
          title="김원장넷"
          desc="12개 한의대 교수 익명 평가 시스템. 참여해보세요 함께 만드는 한의학"
        />
        <StyledFeedContentDiv className="clearfix">
          <LeftFeed>
            <TopNoticeUpper>
              알려드립니다! <span>(2020.05.21기준)</span>
            </TopNoticeUpper>
            <TopNotice>
              <p>
                <em>Best 학교 : </em><strong>원광대학교</strong> / 세명대학교 / 부산대학교 / 가천대학교 / 상지대학교
              </p>
              <p>
                <em>Best 교수 : </em><strong>김동일(동국대)</strong> / 서형식(부산대) / 성현경(세명대) / 서일복(세명대) / 고흥(세명대)
              </p>
            </TopNotice>
            <TagFeedDiv>
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
              <Feed
                fetchURI={fetchURI}
                component={Story2}
              />
            </TagFeedDiv>
          </LeftFeed>
          <AdditionalContent>
            <SearchInput
              className="input-margin"
              value={q as string}
              onChange={({target: {value}}) => setQ(value)}
              onSearch={(value) => router.push({pathname: '/professor', query: {...query, q: value}})}
              placeholder={`${_tagQuery || '김원장넷'} 내 상세 검색`}
            />
            <MenuUl>
              {!isEmpty(professorCountList) ? (
                professorCountList.map(({name, stories_count}) => {
                  /* query가 name을 기반으로 만들어지기때문에 전체의 query는 'tag=전체'로 생성이 됩니다.
                  하지만 ‘?tag=전체’에 대한 API는 존재하지않으므로 '전체'에 대한 분기가 추가되었습니다. */
                  const on = (name === (_tagQuery || '전체'));
                  const queryList = {
                    tag: name === "전체" ? '' : name,
                    order_by: _orderByQuery
                  }

                  return (
                    <MenuLi
                      key={name}
                      on={on}
                      className={classNames({on})}
                    >
                      <Link
                        href={{pathname: '/professor', query: queryList}}
                        passHref
                        replace
                      >
                        <a>
                          <span>{name}</span>
                          <p>{stories_count}</p>
                        </a>
                      </Link>
                    </MenuLi>
                  );
                })) : <Loading/>
              }
            </MenuUl>
            <ProfessorItemAdd/>
          </AdditionalContent>
        </StyledFeedContentDiv>
      </div>
    </WaypointHeader>
  );
});

Professor.displayName = 'Professor';

export default loginRequired(
  userTypeRequired(
    Professor,
    ['doctor', 'student']
  )
);
