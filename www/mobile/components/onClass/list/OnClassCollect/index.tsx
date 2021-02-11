import * as React from 'react';
import * as cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {$POINT_BLUE, $BORDER_COLOR, $TEXT_GRAY, $WHITE} from '../../../../styles/variables.types';
import {staticUrl} from '../../../../src/constants/env';
import BandApi from '../../../../src/apis/BandApi';
import useSaveApiResult from '../../../../src/hooks/useSaveApiResult';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import MoaCollectTabMobile from '../../../moa/list/moaList/MoaCollect/MoaCollectTab/MoaCollectTabMobile';
import OnClassGatheringItem from './OnClassGatheringItem';
import Pagination from '../../../UI/Pagination';
import OnClassApi from '../../../../src/apis/OnClassApi';
import Loading from '../../../common/Loading';
import {HEADER_HEIGHT} from '../../../../styles/base.types';

const OnClassCollectDiv = styled.div`
  border-top: 8px solid #f2f3f7;

  .collect-list {
    background-color: #f2f3f7;
    padding-bottom: 8px;

    > ul {
      max-width: 680px;
      margin: auto;
    }

    .pagination {
      margin-top: 0;
      border-bottom: 1px solid ${$BORDER_COLOR};
    }
    
    .no-content {
      max-width: 680px;
      margin: auto;
      padding: 70px 0;
      text-align: center;
      background-color: ${$WHITE};
      ${fontStyleMixin({
        size: 14,
        color: $TEXT_GRAY,
      })};

      img {
        display: block;
        width: 25px;
        margin: 0 auto 8px;
      }
    }
  }

  @media screen and (min-width: 680px) {
    border-top: 1px solid ${$BORDER_COLOR};

    .collect-list {
      padding: 10px 0;

      .pagination {
        margin: 10px auto 0;
        border-bottom: 0;
      }
    }
  }
`;

const CollectTopDiv = styled.div`
  border-bottom: 1px solid ${$BORDER_COLOR};

  > div {
    position: relative;
    max-width: 680px;
    margin: auto;
    padding: 15px;
  }
  
  h2 {
    margin-bottom: 16px;
    ${fontStyleMixin({
      size: 16,
      weight: 'bold'
    })};
  }

  @media screen and (min-width: 680px) {
    border-bottom: 0;
    
    > div {
      padding-bottom: 25px;
    }
  }
`;

const SelectUl = styled.ul`
  position: absolute;
  right: 14px;
  top: 16px;

  li {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    ${fontStyleMixin({
      size: 12,
      weight: '600'
    })};

    &.on {
      color: ${$POINT_BLUE};
      text-decoration: underline;
    }

    & ~ li {
      padding-left: 13px;
      margin-left: 10px;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 1px;
        height: 8px;
        margin-top: -4px;
        background-color: ${$BORDER_COLOR};
      }
    }
  }

  @media screen and (min-width: 680px) {
    right: 16px;
  }
`;

const PAGE_SIZE = 6;
const PAGE_GROUP_SIZE = 5;

const ORDER_TYPE = [
  {label: '최신순', value: '-created_at'},
  {label: '마감임박순', value: 'deadline'},
];

interface Props {
  title: string;
}

const TOTAL_CATEGORY = {
  id: '',
  name: '전체',
};

const OnClassCollect = React.memo<Props>(({title}) => {
  const [currentData, setCurrentData] = React.useState({
    currentTab: '',
    currentPage: 1,
    order: '-created_at',
  });
  // 쿼리 스트링, Band list API 호출시 사용
  const {currentTab, currentPage, order} = currentData;
  //resData안에 담기는 값 현재 노출되는 리스트 정보
  const [resData, save] = React.useState([]);
  const [pending, setPending] = React.useState(true);

  const [totalCount, setTotalCount] = React.useState(0);
  const ref = React.useRef(null);

  const resetList = React.useCallback(() => {
    save([]);
  }, []);
  const bandApi: BandApi = useCallAccessFunc(access => access && new BandApi(access));
  const onClassApi: OnClassApi = useCallAccessFunc(access => access && new OnClassApi(access));
  const {resData: categoryList = []} = useSaveApiResult(() => bandApi && bandApi.category({band_type: 'onclass'}));

  React.useEffect(() => {
    const form = {
      category: currentTab,
      order_by: order,
      offset: (currentPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    };

    setPending(true);
    if (onClassApi) {
      onClassApi.list(form)
        .then(({status, data: {count, results}}) => {
          if ( status === 200 ) {
            setPending(false);
            setTotalCount(count);
            save(results);
          }
        })
    }
  }, [currentData]);

  React.useEffect(() => {
    if (!isEmpty(categoryList)) {
      setCurrentData(curr => ({...curr, currentTab: ''}));
    }
  }, [categoryList]);


  return (
    <OnClassCollectDiv ref={ref}>
      <CollectTopDiv>
        <div>
          <h2>{title}</h2>
          <SelectUl>
            {ORDER_TYPE.map(({label, value}) => (
              <li
                key={label + value}
                className={cn({on: order === value})}
                onClick={() => {
                  if (order !== value) {
                    resetList();
                    setCurrentData(curr => ({
                      ...curr,
                      order: value,
                      currentPage: 1
                    }));
                  }
                }}
              >
                {label}
              </li>
            ))}
          </SelectUl>
          <MoaCollectTabMobile
            currentTab={currentTab}
            categoryList={[TOTAL_CATEGORY, ...categoryList]}
            onClick={currentTab => {
              if (currentTab !== currentData.currentTab) {
                resetList();
                setCurrentData({
                  currentTab,
                  currentPage: 1,
                  order: '-created_at'
                });
              }
            }}
          />
        </div>
      </CollectTopDiv>
      <div className="collect-list">
        {pending
          ? <Loading/>
          : (!isEmpty(resData) ? ( // 강의 모아보기에 리스트가 있는 경우
            <>
              <ul className="clearfix">
                {(resData || []).map(({
                  extension: {
                    story,
                    products,
                    contents_length,
                    course_period
                  },
                  introduction,
                  oncoming_month,
                  slug,
                  thumbnail = ''
                }) => (
                  <OnClassGatheringItem
                    introduction={introduction}
                    story={story}
                    products={products}
                    contents_length={contents_length}
                    course_period={course_period}
                    slug={slug}
                    thumbnail={thumbnail}
                    oncoming_month={oncoming_month}
                  />
                ))}
              </ul>
              <Pagination
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={PAGE_SIZE}
                pageGroupSize={PAGE_GROUP_SIZE}
                onClick={changePage => {
                  window.scrollTo(0, ref.current.offsetTop - (HEADER_HEIGHT * 2));
                  (changePage !== currentPage) && setCurrentData(curr => ({ ...curr, currentPage: changePage}))
                }}
              />
            </>
          ) : ( // 없는 경우
            <p className="no-content">
              <img
                src={staticUrl('/static/images/icon/icon-no-content.png')}
                alt="목록이 비었습니다."
              />
              현재 카테고리 내에<br />
              개설 된 온라인강의가 없습니다.
            </p>
          )
        )}
      </div>
    </OnClassCollectDiv>
  );
});

OnClassCollect.displayName = 'OnClassCollect';
export default OnClassCollect;
