import * as React from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import cn from 'classnames';
import queryString from 'query-string';
import {useRouter} from 'next/router';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import {
  $BORDER_COLOR,
  $FLASH_WHITE,
  $FONT_COLOR,
  $GRAY,
  $POINT_BLUE,
  $TEXT_GRAY,
  $WHITE,
} from '../styles/variables.types';
import {backgroundImgMixin, fontStyleMixin} from '../styles/mixins.styles';
import {BASE_URL, staticUrl} from '../src/constants/env';
import {pushPopup} from '../src/reducers/popup';
import ModuApi from '../src/apis/ModuApi';
import loginRequired from '../hocs/loginRequired';
import OGMetaHead from '../components/OGMetaHead';
import {FeedContentDiv, LeftFeed} from '../components/search/styleCompPC';
import AdditionalContent from '../components/layout/AdditionalContent';
import SearchInput from '../components/UI/SearchInput';
import SelectBox from '../components/inputs/SelectBox';
import DetailPageBanner from '../components/UI/banner/DetailPageBanner';
import Input from '../components/inputs/Input/InputDynamic';
import Tabs from '../components/UI/tab/Tabs';
import ModunawaMenu from '../components/modunawa/ModunawaMenu';
import RasisterNewItemPopup from '../components/layout/popup/RegisterNewItemPopup';
import useCallAccessFunc from '../src/hooks/session/useCallAccessFunc';
import {numberWithCommas} from '../src/lib/numbers';
import {makeFeedKey} from '../src/lib/feed';
import UserApi from '../src/apis/UserApi';
import Feed from '../components/Feed';
import Story2 from '../components/story/Story2';
import Loading from '../components/common/Loading';
import ReactNotSSR from '@hanii/react-not-ssr';
import WaypointHeader from '../components/layout/header/WaypointHeader';
import {fetchNavsThunk} from "../src/reducers/nav";
import Link from 'next/link';
import {getOpenRangeOption} from "../src/lib/editor";
import useSetPageNavigation from '../src/hooks/useSetPageNavigation';
import useSetFooter from '../src/hooks/useSetFooter';
import userTypeRequired from "../hocs/userTypeRequired";
import {RootState} from '../src/reducers';

const StyledFeedContentDiv = styled(FeedContentDiv)`
  padding: 0 45px 100px;

  > section.additional-content {
    padding-top: 40px;
  
    > span {
      position: relative;
      display: block;
      width: 320px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      ${fontStyleMixin({
        size: 14,
        weight: 'bold',
        color: $WHITE,
      })};
  
      img {
        position: absolute;
        top: calc(50% - 2px);
        right: 13px;
        width: 11px;
      }
    }
  }

  .request {
    position: relative;
    width: 320px;
    height: 70px;
    border: 1px solid #eee;
    box-sizing: border-box;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/icon/icon-modunawa-qa.png'),
      size: '96px',
      position: 'right',
    })}

    a {
      display: block;
    }

    p {
      padding: 13px 17px 0;
      ${fontStyleMixin({
        size: 17,
        color: '#55be90'
      })}
    }

    span {
      display: block;
      padding: 0 18px 14px;
      font-size: 11px;
      text-decoration: underline;

      img {
        vertical-align: middle;
        width: 7px;
        margin: -2px 0 0 2px;
      }
    }
  }
`;

const TagFeedDiv = styled.div`
  position: relative;
  margin: auto;
  padding: 40px 0 88px;

  // 공동구매
  .group-purchase {
    padding: 11px 13px 11px 10px;
    border: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    > img {
      width: 76px;
      vertical-align: middle;
      margin-right: 8px;
    }

    p {
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 14
      })};

      span {
        ${fontStyleMixin({
          color: $POINT_BLUE
        })};
      }
    }

    button {
      margin-top: 4px;
      float: right;
      box-sizing: border-box;

      img {
        width: 16px;
        margin: 0 0 -3px 3px;
      }
    }
  }

  .request-write {
    padding: 16px 15px;
    margin-top: 14px;
    border: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    p {
      display: inline-block;
      ${fontStyleMixin({
        size: 14
      })};

      span {
        ${fontStyleMixin({
          color: $POINT_BLUE
        })};
      }
    }

    > span {
      display: block;
      width: 180px;
      height: 40px;
      line-height: 37px;
      text-align: center;
      float: right;
      background-color: #499aff;
      border-radius: 5px;
      box-sizing: border-box;
      ${fontStyleMixin({
        size: 15,
        color: $WHITE,
        weight: '400',
      })};
    }
  }

  .evaluation-count {
    display: inline-block;
    margin: auto;
    position: relative;
    padding-top: 17px;
    
    h2 {
      padding-bottom: 10px;
      line-height: normal;
      ${fontStyleMixin({
        size: 14,
        weight: 'bold',
      })}

      span {
        ${fontStyleMixin({
          color: $POINT_BLUE,
          weight: 'bold',
        })}
      }
    }
  }

  .styled-feed-wrapper {
    // position: relative;

    .feed-theme {
      display: none;
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

const AddNewList = styled.div`
  margin-bottom: 30px;

  & > p {
    margin-bottom: 8px;
    ${fontStyleMixin({
      size: 12,
      color: $GRAY
    })};
  }

  & > span {
    position: relative;
    display: block;
    width: 320px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/banner/img-modunawa-add.png'),
    })};
    ${fontStyleMixin({
      size: 14,
      weight: 'bold',
      color: $WHITE
    })};

    img {
      position: absolute;
      top: calc(50% - 2px);
      right: 13px;
      width: 11px;
    }

    &.toggle {
      img {
        transform: rotate(180deg);
      }
    }
  }

  .inner-toggle {
    width: 320px;
    border: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    > div {
      padding: 10px 15px 16px;

      > p {
        ${fontStyleMixin({
          color: '#999',
        })};
      }

      .select-box {
        width: auto;
        padding: 0;
        margin: 4px 0;

        p img {
          right: 0;
          opacity: 0.3;
        }
      }

      .input {
        width: 100%;
        height: 44px;
        border-bottom: 1px solid ${$BORDER_COLOR};
        margin-bottom: 4px;
        ${fontStyleMixin({
          size: 14
        })};

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    span {
      display: block;
      height: 44px;
      text-align: center;
      line-height: 45px;
      background-color: ${$FLASH_WHITE};
      border-top: 1px solid ${$BORDER_COLOR};
      ${fontStyleMixin({
        size: 14,
        color: $TEXT_GRAY
      })};

      &.on {
        color: ${$FONT_COLOR};
      }
    }
  }
`;

enum CurrentCategory {
  TagContent,
  RequestContent
}

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

const TAG_LIST = Object.keys(TAGS)
  .filter(key => key !== '무엇이든 요청해보세요')
  .map(key => ({
    value: key,
    label: key,
    subTags: TAGS[key],
  }));

export const TAG_ON_MAP = Object.keys(TAGS).reduce((prev, curr) => {
  prev[curr] = curr;
  const subMenu = TAGS[curr];
  subMenu.forEach((menu) => {
    prev[menu] = curr;
  });
  return prev;
}, {});

const selectTagIdx = (tagName: string | string[]) => findIndex(TAG_LIST, ['value', tagName]);

const Professor = React.memo(() => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {asPath, query} = router;
  const {tag: _tagQuery, q: _qQuery, order_by: _orderByQuery} = query;
  const {count, navs, defaultTag, _fetchURI, myId} = useSelector(
    ({navs, system: {session: {id}}, feed}: RootState) => ({
        count: (feed[makeFeedKey(asPath)] || {}).count,
        navs,
        defaultTag: (navs.filter(({name}) => name === _tagQuery)[0]|| {}),
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

  const [newModuItem, setNewModuItem] = React.useState({
    tag: TAG_LIST[0].value,
    subTag: '',
    name: '',
  });

  React.useEffect(() => {
    dispatch(fetchNavsThunk());
  }, []);

  // Custom Hooks
  useSetPageNavigation('/modunawa');
  useSetFooter(false);

  const [on, setOn] = React.useState(false);
  const [isSubChildExist, setIsSubChildExist] = React.useState(false);
  const [q, setQ] = React.useState(_qQuery);
  const [fetchURI, setFetchURI] = React.useState(_fetchURI);
  const [toggle, setToggle] = React.useState(true);

  const userApi: UserApi = useCallAccessFunc(access => access && new UserApi(access));
  const moduApi: ModuApi = useCallAccessFunc(access => access && new ModuApi(access));

  React.useEffect(() => {
    setFetchURI(`${_fetchURI}?${queryString.stringify({
      tag: _tagQuery,
      q: _qQuery,
      order_by: _orderByQuery,
    })}`);
  }, [_fetchURI, router.query]);

  React.useEffect(() => {
    if (!isEmpty(TAG_LIST[selectTagIdx(newModuItem.tag)].subTags)) {
      setNewModuItem(curr => ({
        ...curr,
        subTag: TAG_LIST[selectTagIdx(newModuItem.tag)].subTags[0],
      }));
    }
      setIsSubChildExist(!isEmpty(TAG_LIST[selectTagIdx(newModuItem.tag)].subTags));
  }, [newModuItem.tag]);

  const writeQuestionProps = React.useMemo<any>(() => ({
    defaultTag: defaultTag[0],
    writeStoryApi: formData => userApi.newStory(myId, formData),
    openRangeList: getOpenRangeOption(['human', 'user_all', 'only_me']),
  }), [defaultTag, myId]);

  React.useEffect(() => {
    setOn(newModuItem.name !== '' && (
      isSubChildExist
        ? newModuItem.subTag !== ''
        : true));
  }, [newModuItem, isSubChildExist]);

  return (
    <WaypointHeader
      themetype="white"
      headerComp={
        <DetailPageBanner
          bgImgSrc="/static/images/banner/img-bg-modunawa.jpg"
          isBeta
        >
          <div className="center">
            <h2>
              <span>모두나와</span>
              <p>한의원 제품, 리뷰, 가격 비교 한방에</p>
            </h2>
          </div>
        </DetailPageBanner>
      }
    >
      <div>
        <OGMetaHead title="모두나와"/>
        <StyledFeedContentDiv className="clearfix">
          <ModunawaMenu/>
          <LeftFeed>
            <TagFeedDiv className="clearfix">
              <Tabs currentTab={currentTab}>
                <div className="group-purchase">
                  <img
                    src={staticUrl('/static/images/icon/icon-group-purchase.png')}
                    alt="공동구매"
                  />
                  <p>
                    <span>동방스프링 #1차공동구매 #종료</span><br/>
                    성원에 감사드립니다<br/>
                    더 좋은 제품! 좋은 가격!으로 준비하겠습니다.
                  </p>
                </div>
                <div className="request-write">
                  <p>
                    모두나와 서비스 건의사항, 상품 추가, 한의원 관련 문의 등등!<br/>
                    <span>자유롭게 정보를 요청해보세요!</span>
                  </p>
                </div>
              </Tabs>
              {!!count && (
                <div className="evaluation-count">
                  <h2>
                    <span>{numberWithCommas(count)}</span>개의 목록이 있습니다.
                    </h2>
                </div>
              )}
              <StyledSelectBox
                value={_orderByQuery || ORDER_BYS[currentTab][0].value}
                option={ORDER_BYS[currentTab]}
                onChange={order_by => {
                  router.replace({
                    pathname: '/modunawa',
                    query: {q, order_by, tag: _tagQuery},
                  });
                }}
              />
              {!isEmpty(navs) ? (
                <ReactNotSSR>
                  <div className="styled-feed-wrapper">
                    <Feed
                      fetchURI={fetchURI}
                      component={Story2}
                      highlightKeyword={q as string}
                      passProps={{themeType: 'title'}}
                    />
                  </div>
                </ReactNotSSR>
              )
              : <Loading/>
              }
            </TagFeedDiv>
          </LeftFeed>
          <AdditionalContent>
            <div className="request">
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
                  <p>무엇이든 <strong>요청해보세요</strong></p>
                  <span>
                    바로가기
                    <img
                      src={staticUrl('/static/images/icon/arrow/icon-request-arrow.png')}
                      alt="무엇이든 요청해보세요"
                    />
                  </span>
                </a>
              </Link>
            </div>
            <SearchInput
              className="input-margin"
              value={q as string}
              onChange={({target: {value}}) => setQ(value)}
              onSearch={(value) => router.push({pathname: '/modunawa', query: {...query, q: value}})}
              placeholder={`${_tagQuery || '모두 나와'} 내 상세 검색`}
            />
            {currentTab === CurrentCategory.TagContent && (
              <AddNewList>
                <p>
                  아래 버튼으로 모두나와 항목을 직접 등록하실 수 있습니다.<br/>
                  추천 원외탕전, 추천 상품 등을 입력해보세요.
                </p>
                <span
                  onClick={() => setToggle(curr => !curr)}
                  className={cn('ellipsis', 'pointer', {toggle})}
                >
                항목 등록
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-unfold-white.png')}
                  alt="펼치기"
                />
              </span>
                {toggle && (
                  <div className="inner-toggle">
                    <div>
                      <p>
                        카테고리 선택 및 아래 내용을 입력해주세요.
                      </p>
                      <SelectBox
                        value={newModuItem.tag}
                        option={TAG_LIST}
                        onChange={(tag) => {
                          setNewModuItem(curr => ({
                            ...curr,
                            tag,
                          }));
                        }}
                      />
                      {!isEmpty(TAG_LIST[selectTagIdx(newModuItem.tag)].subTags) && (
                        <SelectBox
                          value={newModuItem.subTag}
                          option={TAG_LIST[selectTagIdx(newModuItem.tag)].subTags.map(value => ({value}))}
                          onChange={(subTag) => {
                            setNewModuItem(curr => ({...curr, subTag}));
                          }}
                        />
                      )}
                      <Input
                        name="name"
                        onChange={({target: {name, value}}) => {
                          setNewModuItem(curr => ({
                            ...curr,
                            [name]: value,
                          }));
                        }}
                        placeholder="명칭을 입력해주세요. (20자 이내)"
                        maxLength={20}
                      />
                    </div>
                    <span
                      className={cn('pointer', {on: on})}
                      onClick={() => {
                        on && dispatch(pushPopup(RasisterNewItemPopup, {
                          buttonGroupProps: {
                            rightButton: {
                              onClick: () => {
                                moduApi && moduApi.create({
                                  title: newModuItem.name,
                                  tags: [
                                    newModuItem.tag,
                                    ...(isSubChildExist ? [newModuItem.subTag] : []),
                                  ],
                                }).then(({status}) => {
                                  if (status === 201) {
                                    router.reload();
                                  }
                                });
                              },
                            },
                          },
                        }));
                      }}
                    >
                      등록
                    </span>
                  </div>
                )}
              </AddNewList>
            )}
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
