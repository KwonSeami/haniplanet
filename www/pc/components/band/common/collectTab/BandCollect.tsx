import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import MoaGathering from '../../../moa/list/MoaGathering';
import SelectBox from '../../../inputs/SelectBox';
import BandApi from '../../../../src/apis/BandApi';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import useSaveApiResult from '../../../../src/hooks/useSaveApiResult';
import {$BORDER_COLOR, $TEXT_GRAY} from '../../../../styles/variables.types';
import Pagination from '../../../UI/Pagination';
import BandCollectTab from './BandCollectTab';
import BandCard from '../../../UI/Card/BandCard/BandCard';
import {staticUrl} from '../../../../src/constants/env';
import {fontStyleMixin} from '../../../../styles/mixins.styles';

const BandCollectDiv = styled.div`
  border-top: 1px solid ${$BORDER_COLOR};
  padding-top: 1px;

  .moa-collect-card {
    width: 1090px;
    margin: auto;
    border: 0;
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
  right: 0;
  top: 100px;
  width: 150px;
  height: 42px;

  &::-ms-expand {
    display: none;
  }
`;

const StyledPagination = styled(Pagination)`
  padding: 30px 0 36px;
`;

const PAGE_SIZE = 10;
const PAGE_GROUP_SIZE = 10;

interface Props {
  band_type: 'moa' | 'onclass' | 'consultant';
  title: string;
}

const BandCollect = React.memo<Props>(({band_type, title}) => {
  // 카테고리, 페이지, 정렬 정보
  const [currentData, setCurrentData] = React.useState({
    currentTab: '',
    currentPage: 1,
    order: '-created_at'
  });
  const {currentTab, currentPage, order} = currentData;

  // API 결과를 담을 State
  const [{ resData, totalCount }, save] = React.useState({
    resData: [],
    totalCount: 0
  });

  // Api Call
  const bandApi: BandApi = useCallAccessFunc(access => access && new BandApi(access));
  const {resData: categoryList} = useSaveApiResult(() => bandApi && bandApi.category({band_type: band_type}));

  // Life Cycle
  React.useEffect(() => {
    const form = {
      band_type,
      category: currentTab,
      order_by: order,
      offset: (currentPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    };

    // 현재 MOA 모아보기 데이터를 새로 렌더링 해야 하는 상황일 때 API를 다시 호출합니다.
    // 후에 이 부분을 개선하도록 하겠습니다.
    // ex_ 탭 변경, StyledSelectBox 변경, 페이지 변경
    if (bandApi && currentData.currentTab) {
      bandApi.list(form)
        .then(({data: {count, results}}) => {
          // if (count !== 0 && PAGE_SIZE * currentPage > count) {
          //   return null;
          // }
          save({ resData: results, totalCount: count });
        });
    }
  }, [currentData]);

  React.useEffect(() => {
    // 카테고리 리스트 API를 정상적으로 호출했다면, 초깃값 지정
    if (!isEmpty(categoryList)) {
      setCurrentData(curr => ({...curr, currentTab: categoryList[0].id}));
    }
  }, [categoryList]);

  // 출력할 데이터가 없다면, 렌더링하지 않음
  if (!categoryList) { return null; }

  const bandCategory = band_type === 'onclass' ? '온라인강의' : 'MOA';
  
  return (
    <BandCollectDiv>
      <BandCard
        className="moa-collect-card"
        title={title}
      >
        <BandCollectTab
          currentTab={currentTab}
          categoryList={categoryList}
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
            {label: '가나다 순', value: 'name'}
          ]}
          onChange={order => setCurrentData(curr => ({ ...curr, order }))}
        />
        <div className="collect-list">
          {!isEmpty(resData) ? ( // 강의 모아보기에 리스트가 있는 경우
            <>
              <ul className="clearfix">
                {(resData || []).map(
                  ({slug, name, created_at, story_count, member_count, body, avatar, extension}) => (
                    <MoaGathering
                      key={slug}
                      name={name}
                      slug={slug}
                      created_at={created_at}
                      story_count={story_count}
                      member_count={member_count}
                      body={body}
                      avatar={avatar}
                      bandType={band_type}
                      onclassStatus={band_type === 'onclass' ? extension.onclass_status : null}
                    />
                  )
                )}
              </ul>
              <StyledPagination
                className="pagination"
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                totalCount={totalCount}
                pageGroupSize={PAGE_GROUP_SIZE}
                onClick={currentPage => setCurrentData(curr => ({ ...curr, currentPage }))}
              />
            </>
          ) : ( // 없는 경우
              <p>
                <img
                  src={staticUrl('/static/images/icon/icon-no-content.png')}
                  alt="목록이 비었습니다."
                />
                현재 카테고리 내에<br />
                개설 된 {bandCategory}가 없습니다.
              </p>
            )}
        </div>
      </BandCard>
    </BandCollectDiv>
  );
});

BandCollect.displayName = 'BandCollect';
export default BandCollect;
