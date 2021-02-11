import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import BandApi from '../../src/apis/BandApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import useSaveApiResult from '../../src/hooks/useSaveApiResult';
import BandCard from '../../components/UI/Card/BandCard/BandCard';
import {staticUrl} from '../../src/constants/env';
import {$BORDER_COLOR, $TEXT_GRAY} from '../../styles/variables.types';
import {fontStyleMixin} from '../../styles/mixins.styles';
import SelectBox from '../../components/inputs/SelectBox';
import OnClassGatheringItem from './OnClassGatheringItem';
import OnClassApi from '../../src/apis/OnClassApi';
import dynamic from 'next/dynamic';
import PaginationDynamic from '../../components/UI/PaginationDynamic';
import Loading from '../common/Loading';
import {HEADER_HEIGHT} from '../../styles/base.types';

const BandCollectTab = dynamic({
  ssr: false,
  loader: () => import('../../components/band/common/collectTab/BandCollectTab'),
});

const OnClassGatheringDiv = styled.div`
  border-top: 1px solid ${$BORDER_COLOR};
  padding-top: 1px;

  .onclass-collect-card {
    width: 1090px;
    padding-bottom: 38px;
    margin: auto;
    border: 0;

    h2 {
      padding-bottom: 0;
    }
  }

  .collect-list {
    > p {
      padding: 127px 0 150px;
      text-align: center;
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
`;

const StyledSelectBox = styled(SelectBox)`
  position: absolute;
  top: 78px;
  right: 0;
  width: 83px;
  height: 42px;
  border-bottom: 0;
  text-align: left;

  &::-ms-expand {
    display: none;
  }

  ul {
    left: auto;
    right: 0;
    width: auto;
    white-space: nowrap;
    border-top: 1px solid ${$BORDER_COLOR};
  }
`;

const StyledPagination = styled(PaginationDynamic)`
  padding: 10px 0 0;
`;

const PAGE_SIZE = 6;
const PAGE_GROUP_SIZE = 6;

interface Props {
  title: string;
}

const TOTAL_CATEGORY = {
  id: '',
  name: '전체',
  avatar_on: staticUrl('/static/images/icon/onclass-total-on.png'),
  avatar_off: staticUrl('/static/images/icon/onclass-total-off.png')
};

const OnClassGathering: React.FC<Props> = ({title}) => {
  // 카테고리, 페이지, 정렬 정보
  const [currentData, setCurrentData] = React.useState({
    currentTab: '',
    currentPage: 1,
    order: '-created_at'
  });
  const {currentTab, currentPage, order} = currentData;
  const [pending, setPending] = React.useState(true);

  // API 결과를 담을 State
  const [{ resData, totalCount }, save] = React.useState({
    resData: [],
    totalCount: 0
  });

  const ref = React.useRef(null);
  // Api Call
  const bandApi: BandApi = useCallAccessFunc(access => access && new BandApi(access));
  const onClassApi: OnClassApi = useCallAccessFunc(access => access && new OnClassApi(access));
  const {resData: categoryList = []} = useSaveApiResult(() => bandApi && bandApi.category({band_type: 'onclass'}));

  // Life Cycle
  React.useEffect(() => {
    const form = {
      category: currentTab,
      order_by: order,
      offset: (currentPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    };

    setPending(true);
    // 현재 MOA 모아보기 데이터를 새로 렌더링 해야 하는 상황일 때 API를 다시 호출합니다.
    // 후에 이 부분을 개선하도록 하겠습니다.
    // ex_ 탭 변경, StyledSelectBox 변경, 페이지 변경
    if (onClassApi) {
      onClassApi.list(form)
        .then(({status, data: {count, results}}) => {
          if (status === 200) {
            setPending(false);
            save({ resData: results, totalCount: count });
          }
        });
    }
  }, [currentData]);

  React.useEffect(() => {
    // 카테고리 리스트 API를 정상적으로 호출했다면, 초깃값 지정
    if (!isEmpty(categoryList)) {
      setCurrentData(curr => ({...curr, currentTab: ''}));
    }
  }, [categoryList]);

  return (
    <OnClassGatheringDiv ref={ref}>
      <BandCard
        className="onclass-collect-card"
        title={title}
      >
        <BandCollectTab
          currentTab={currentTab}
          categoryList={[
            TOTAL_CATEGORY, ...categoryList
          ]}
          onClick={currentTab => setCurrentData(curr => ({
            ...curr,
            currentTab,
            currentPage: currentTab !== curr.currentTab ? 1 : curr.currentPage
          }))}
        />
        <StyledSelectBox
          value={order}
          option={[
            {label: '최신순', value: '-created_at'},
            {label: '마감임박순', value: 'deadline'}
          ]}
          onChange={order => setCurrentData(curr => ({ ...curr, order}))}
        />
        <div className="collect-list">
          {pending
            ? <Loading/>
            : (
              !isEmpty(resData) ? ( // 강의 모아보기에 리스트가 있는 경우
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
                  <StyledPagination
                    className="pagination"
                    currentPage={currentPage}
                    pageSize={PAGE_SIZE}
                    totalCount={totalCount}
                    pageGroupSize={PAGE_GROUP_SIZE}
                    onClick={changePage => {
                      window.scrollTo(0, ref.current.offsetTop - (HEADER_HEIGHT * 2));
                      (changePage !== currentPage) && setCurrentData(curr => ({ ...curr, currentPage: changePage}))
                    }}
                  />
                </>
              ) : ( // 없는 경우
                <p>
                  <img
                    src={staticUrl('/static/images/icon/icon-no-content.png')}
                    alt="목록이 비었습니다."
                  />
                  현재 카테고리 내에<br />
                  개설 된 온라인강의가 없습니다.
                </p>
              )
            )
          }
        </div>
      </BandCard>
    </OnClassGatheringDiv>
  );
};

export default React.memo(OnClassGathering);
