import * as React from 'react';
import {SOBS} from '../../src/gqls/shopping';
import {useQuery} from '@apollo/react-hooks';
import {useRouter} from 'next/router';
import useSetQueryParam from '../../src/hooks/useSetQueryParam';
import loginRequired from '../../hocs/loginRequired';
import WaypointHeader from '../../components/layout/header/WaypointHeader';
import AdditionalContent from '../../components/layout/AdditionalContent';
import GoodsCategory from '../../components/shopping/GoodsCategory';
import ShopItem, {IGoodsItemProps} from "../../components/shopping/ShopItem";
import HashReload from '../../components/HashReload';
import Button from '../../components/inputs/Button';
import {$BORDER_COLOR, $POINT_BLUE, $WHITE } from '../../styles/variables.types';
import {checkValidImage} from '../../src/lib/file';
import UserApi from '../../src/apis/UserApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {useSelector, shallowEqual} from 'react-redux';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {RootState} from '../../src/reducers/index';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/UI/Pagination';
import Page500 from '../../components/errors/Page500';
import SelectBox from '../../components/inputs/SelectBox';
import A from '../../components/UI/A';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import {MainWrapper, MainLayout, LeftFeed, ShoppingBanner, SearchInput, ShoppingListUl, CheckRegisterBusiness, StyledNoContent, WishButton} from '../../components/shopping/style/goods';
import {StyeldListCount} from '../../components/meetup/pcStyledComp';
import {HashId} from '@hanii/planet-types';
import {staticUrl} from '../../src/constants/env';
import {numberWithCommas} from '../../src/lib/numbers';

type TShoppingQueryOrderBy = 'recommend' | 'price_desc' | 'price_asc' | 'sale_perc_desc' | 'purchase_count_desc';
type TShoppingQueryType = 'follow' | 'purchase' | 'cart';

interface IShoppingQueryParams {
  page?: string | number;
  q?: string;
  tag_name?: string;
  order_by?: TShoppingQueryOrderBy;
  query?: TShoppingQueryType;
}

const getPureObject = (obj) => {
  let o = {};

  Object.keys(obj).forEach(key => {
    if(!isEmpty(key) && !isUndefined(key) && !isUndefined(obj[key])) {
      o[key] = obj[key];
    }
  });

  return o;
};

const PAGE_SIZE = 18;
const PAGE_GROUP_SIZE = 10;
const ORDER_BY_ARR = [
  {value: 'recommend', label: '추천순'},
  {value: 'price_desc', label: '높은 가격 순'},
  {value: 'price_asc', label: '낮은 가격 순'},
  {value: 'sale_perc_desc', label: '할인률 순'},
  {value: 'purchase_count_desc', label: '구매순'}
];

const Shopping: React.FC = () => {
  // Hooks
  const {query} = useRouter();
  const {
    q,
    page = 1,
    order_by = '',
    type: _type = '',
    tag_name
  } = query;

  const {user: me} = useSelector(
    ({system, orm}: RootState) => ({
      user: pickUserSelector(system.session.id)(orm) || {} as any
    }),
    shallowEqual
  );

  const {has_business_registration} = me;

  const userApi: UserApi = useCallAccessFunc(access => new UserApi(access));
  const {pushQueryParam, replaceQueryParam} = useSetQueryParam<IShoppingQueryParams>();

  // State
  const [value, setValue] = React.useState(q || '' as string);
  const [type, setType] = React.useState(_type);
  const [orderBy, setOrderBy] = React.useState(order_by || ORDER_BY_ARR[0].value as string);
  const [registrationName, setRegistrationName] = React.useState('파일을 첨부해주세요');
  const [nullText, setNullText] = React.useState('상품이 없습니다.');

  const fileRef = React.useRef(null);
  const variables = {
    q,
    offset: (Number(page)-1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    tag_name,
    order_by: orderBy,
    [type ? 'query' : '']: type
  } as IShoppingQueryParams;

  // Query
  const {
    error,
    loading,
    updateQuery,
    client,
    data: {
      goods_categories = [],
      sobs = {
        node: [],
        total_count: 0
      }
    } = {sobs}
  } = useQuery(SOBS, {
    variables: getPureObject(variables),
  });

  React.useEffect(() => {
    (goods_categories || []).map(({tag: {name}, children, null_text}) =>
      (name === tag_name || children.some(({tag: {name}}) => tag_name === name)) && setNullText(null_text)
    );
  }, [goods_categories, tag_name]);

  if(Number.isNaN(Number(page))) {
    replaceQueryParam(curr => ({
      ...curr,
      page: 1
    }))
  }

  const {
    nodes,
    total_count,
    ...rest
  } = sobs;

  const updateGoods = (storyPk: HashId, updatedData:IGoodsItemProps) => {
    updateQuery(({
      sobs: {nodes, ...rest}
    }) => {

      return {
        sobs: {
          ...rest,
          nodes: nodes.map(data => {
            return data.id === storyPk
              ? {
                  ...data,
                  ...updatedData
                }
              : data
          })
        }
      }
    })
  };

  const deleteGoods = (storyPk: HashId) => {
    updateQuery(({
      sobs: {nodes, ...rest}
    }) => {

      return {
        sobs: {
          ...rest,
          nodes: nodes.filter(data => data.id !== storyPk)
        }
      }
    })
  };

  const readQuery = (variables: IShoppingQueryParams) => {
    return client.readQuery({
      query: SOBS,
      variables: getPureObject(variables)
    })
  };

  const writeQuery = (variables: IShoppingQueryParams, data: IGoodsItemProps[]) => {
    client.writeQuery({
      query: SOBS,
      variables: getPureObject(variables),
      data: {
        sobs: data
      }
    });
  };


  if(error) return <Page500/>;

  return (
    <WaypointHeader
      themetype="white"
      headerComp={
        <ShoppingBanner>
          <MainLayout id="page-header">
            <h2>플래닛마켓</h2>
            <div className="content">
              <p>한의플래닛 카드 5% 할인과 무료배송의 세계. 핫딜은 덤.</p>
              <Link
                href="/payment"
                as="/payment"
              >
                <a>
                  <img
                    src={staticUrl('/static/images/icon/icon-won-blue.png')}
                    title="원"
                  />
                  마켓 결제내역
                </a>
              </Link>
            </div>
          </MainLayout>
        </ShoppingBanner>
      }
    >
      <MainWrapper>
        <MainLayout>
          <LeftFeed>
            {tag_name === '한약재' && (
              <CheckRegisterBusiness>
                {!has_business_registration && (
                  <>
                    <p>
                      한약재 구입은, 근무중인 의료기관의 사업자등록증 확인이 필수입니다!
                    </p>
                    <div>
                      <b>
                        사업자 등록증 첨부
                      </b>
                      <p className="ellipsis">
                        {registrationName}
                      </p>
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        ref={fileRef}
                        onChange={e => {
                          checkValidImage(e, file => {
                            const formData = new FormData();
                            formData.append('image', file);

                            userApi.businessRegistration(formData)
                              .then(() => {
                                setRegistrationName(file.name);
                                alert('등록 완료되었습니다.');
                              });
                          })
                        }}
                      />
                      <Button
                        size={{
                          width: '113px',
                          height: '44px'
                        }}
                        border={{
                          radius: '4px',
                          width: '1px',
                          color: $BORDER_COLOR
                        }}
                        font={{
                          size: '13px',
                          weight: '600',
                          color: $POINT_BLUE
                        }}
                        backgroundColor={$WHITE}
                        onClick={() => fileRef.current.click()}
                      >
                        <img
                          src={staticUrl('/static/images/icon/file-blue.png')}
                          alt=""
                        />
                        파일 첨부
                      </Button>
                    </div>
                  </>
                )}
                <p>
                  플래닛마켓 한약재는 <span>5%</span> 할인되는 <span>[신한카드X한의플래닛 카드]</span>로만 구입이 가능합니다.<br />
                  빠른 시일내에 카드사 연동을 통해 다양한 결제수단을 제공하겠습니다.
                </p>
              </CheckRegisterBusiness>
            )}
            <nav className="top-wrapper">
              <StyeldListCount>
                <span>{numberWithCommas(total_count)}</span>
                개의 상품이 있습니다.
              </StyeldListCount>
              <div>
                <SelectBox
                  option={ORDER_BY_ARR}
                  value={orderBy as TShoppingQueryOrderBy}
                  onChange={value => {
                    setOrderBy(value);
                  }}
                />
                <WishButton
                  onClick={() => {
                    setType(curr => curr ? '' : 'follow')
                  }}
                  isActive={type === 'follow'}
                >
                  <img
                    src={staticUrl(`/static/images/icon/${type === 'follow' ? 'icon-heart-on' : 'icon-heart-black'}.png`)}
                  />
                  저장한 상품
                </WishButton>
              </div>
            </nav>
            {loading ? (
              <Loading/>
            ) : (total_count && !isEmpty(nodes) ? (
              <>
                <ShoppingListUl>
                  {(nodes || []).map(({id, ...props}) => (
                    <ShopItem
                      id={id}
                      key={id}
                      {...props}
                      onWish={(isFollow, updatedData) => {
                        if(type === 'follow') {
                          updateGoods(id, updatedData);
                          deleteGoods(id);
                        } else {
                          try {
                            const followVariables: IShoppingQueryParams = {
                              ...variables,
                              query: 'follow'
                            };
                            const cacheData = readQuery(followVariables as IShoppingQueryParams);
                            const {
                              sobs: {nodes, total_count}
                            } = cacheData;

                            writeQuery(followVariables as IShoppingQueryParams, isFollow
                              ? {
                                nodes: [
                                  ...nodes,
                                  {id, ...props}
                                ],
                                total_count: total_count + 1,
                                ...rest
                              } : {
                                nodes: nodes.map(({id: _id}) => id !== _id),
                                total_count: total_count - 1,
                                ...rest
                              }
                            );
                          } catch {
                            console.error('캐싱 된 데이터가 없습니다.');
                          }
                          updateGoods(id, updatedData);
                        }
                      }}
                    />
                  ))}
                </ShoppingListUl>
                <Pagination
                  className="pagination"
                  currentPage={Number(page) || 1}
                  totalCount={total_count}
                  pageSize={PAGE_SIZE}
                  pageGroupSize={PAGE_GROUP_SIZE}
                  onClick={page => {
                    pushQueryParam(curr => ({
                      ...curr,
                      page,
                      order_by: orderBy,
                      type
                    } as IShoppingQueryParams), {shallow: true}, 'page-header');
                  }}
                />
                <HashReload/>
              </>
            ) : (
              <StyledNoContent>
                {nullText}
              </StyledNoContent>
            ))}
          </LeftFeed>
          <AdditionalContent hideFooter>
            <SearchInput>
              <input
                placeholder="플래닛마켓 내 상세검색"
                value={value}
                onChange={({target: {value}}) => setValue(value)}
                onKeyPress={({key}) => {
                  if (key === 'Enter') {
                    pushQueryParam(curr => ({
                      ...curr,
                      q: value,
                      page: 1,
                      tag_name: '',
                      order_by: orderBy,
                      type
                    } as IShoppingQueryParams), {shallow: true});
                  }
                }}
              />
              <img
                src={staticUrl('/static/images/icon/icon-search.png')}
                alt="검색"
                onClick={() => {
                  pushQueryParam(curr => ({
                    ...curr,
                    q: value,
                    page: 1,
                    tag_name: '',
                    type
                  } as IShoppingQueryParams), {shallow: true});
                }}
              />
            </SearchInput>
            <GoodsCategory
              tagName={tag_name as string}
              onClick={(tag_name) => {
                pushQueryParam(curr => ({
                  ...curr,
                  tag_name,
                  page: 1,
                  order_by: orderBy,
                  type
                } as IShoppingQueryParams), {shallow: true});
              }}
            />
            <div className="banner">
              <A
                to="https://www.shinhancard.com/pconts/html/card/apply/credit/1196411_2207.html?EntryLoc1=TM5678&EntryLoc2=2988&empSeq=501[](url)"
                newTab={true}
              >
                <img
                  src={staticUrl('/static/images/banner/banner-haniplanet-card.png')}
                  title="한의플래닛, 신한카드 콜라보 이벤트 페이지로 연결"
                  alt="플래닛 마켓을 이용하는 가장 스마트한 방법. 한의플래닛, 신한카드 콜라보 이벤트 페이지로 연결"
                />
              </A>
            </div>
          </AdditionalContent>
        </MainLayout>
      </MainWrapper>
    </WaypointHeader>
  )
};

Shopping.displayName = 'Shopping';
export default loginRequired(React.memo(Shopping));
