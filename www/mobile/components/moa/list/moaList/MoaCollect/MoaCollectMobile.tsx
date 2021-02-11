import * as React from 'react';
import * as cn from 'classnames';
import styled from 'styled-components';
import MoaCollectTabMobile from './MoaCollectTab/MoaCollectTabMobile';
import MoaGatheringMobile, {AvatarDiv, MoaGatheringDiv} from '../../MoaGatheringMobile';
import {$BORDER_COLOR, $POINT_BLUE} from '../../../../../styles/variables.types';
import {staticUrl} from '../../../../../src/constants/env';
import BandCard from '../../../../UI/Card/BandCard/BandCard';
import {fontStyleMixin, heightMixin} from '../../../../../styles/mixins.styles';
import usePrevious from '../../../../../src/hooks/usePrevious';
import BandApi from '../../../../../src/apis/BandApi';
import useSaveApiResult from '../../../../../src/hooks/useSaveApiResult';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import Loading from '../../../../common/Loading';

export const SelectUl = styled.ul`
  position: absolute;
  right: -6px;
  top: 22px;

  li {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    padding-left: 20px;
    ${fontStyleMixin({
      size: 12,
      weight: '600'
    })}

    &.on {
      color: ${$POINT_BLUE};
      text-decoration: underline;
    }

    &:first-child::after {
      content: '';
      position: absolute;
      right: -10px;
      top: 50%;
      width: 1px;
      height: 8px;
      margin-top: -4px;
      background-color: ${$BORDER_COLOR};
    }
  }
`;

const MoaCollectDiv = styled.div`
  border-top: 1px solid ${$BORDER_COLOR};

  @media screen and (max-width: 680px) {
    border-top: 8px solid #f2f3f7;
  }
`;

const StyledMoaCollectCard = styled(BandCard)`
  border: 0;
  max-width: 680px;
  margin: auto;
  padding: 22px 0 25px;
  
  & > h2 {
    padding-bottom: 30px;
    ${fontStyleMixin({
      size: 16,
      weight: 'bold'
    })}
  }

  @media screen and (max-width: 680px) {
    padding: 22px 15px 24px;

    ${SelectUl} {
      right: 14px;
    }

    ${MoaGatheringDiv} {
      padding: 13px 15px 16px 57px;
    }

    ${AvatarDiv} {
      left: 1px;
    }
  }
`;

const MoreLoadButton = styled.p`
  text-align: center;
  margin-top: 10px;
  ${heightMixin(45)};
  border: 1px solid ${$BORDER_COLOR};
  ${fontStyleMixin({
    size: 14,
    color: '#999'
  })}

  img {
    width: 5px;
    padding-bottom: 10px;
    display: inline-block;
    vertical-align: middle;
    margin-top: -5px;
    transform: rotate(90deg);
  }
`;

const MoaGatheringUl = styled.ul`
  margin-top: 10px;
  border-top: 1px solid ${$BORDER_COLOR};
`;

const PAGE_SIZE = 5;

const ORDER_TYPE = [
  {label: '최신순', value: '-created_at'},
  {label: '가나다 순', value: 'name'},
];

interface Props {
  band_type: 'moa' | 'consultant'
}

const MoaCollectMobile = React.memo<Props>(({band_type}) => {
  const [isLoadData, setIsLoadData] = React.useState(true);
  const [currentData, setCurrentData] = React.useState({
    currentTab: '',
    currentPage: 1,
    order: '-created_at',
  });
  // 쿼리 스트링, Band list API 호출시 사용
  const {currentTab, currentPage, order} = currentData;
  const prevTab = usePrevious(currentTab);
  const prevOrder = usePrevious(order);

  const [resData, save] = React.useState([]);
  const [resRest, saveRest] = React.useState({});
  const [pending, setPending] = React.useState(false);

  const bandApi: BandApi = useCallAccessFunc(access => access && new BandApi(access));
  const {resData: categoryList} = useSaveApiResult(() => (
    bandApi && bandApi.category({band_type: band_type})
      .then(res => {
        setPending(true);
        return res;
      })
  ));

  const isValidCurrentTab = React.useMemo(() => {
    return !!currentTab &&  !!order && !isNaN(Number(currentPage));
  }, [currentTab, order, currentPage]);

  // Life Cycle
  React.useEffect(() => {
    if (!!prevTab && (prevTab !== currentTab)) {
      save([]);
      saveRest({});
      setCurrentData(curr => ({...curr, currentPage: 1}));
      setIsLoadData(true);
    }
  }, [currentTab]);

  React.useEffect(() => {
    if (prevOrder !== order) {
      save([]);
      saveRest({});
    }
  }, [order]);

  React.useEffect(() => {
    if (isLoadData && isValidCurrentTab) {
      const form = {
        band_type: band_type,
        category: currentTab,
        order_by: order,
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      };

      bandApi && bandApi.list(form)
        .then(({data: {results, ...rest}}) => {
          save(curr => [...curr, ...results]);
          saveRest(rest);
        });
    }
  }, [isLoadData, isValidCurrentTab, band_type]);

  React.useEffect(() => {
    // 카테고리 리스트 API를 정상적으로 호출했다면, 초깃값 지정
    if (!!categoryList) {
      setCurrentData(curr => ({...curr, currentTab: categoryList[0].id}));
    }
  }, [categoryList]);

  if (!pending) {
    return <Loading />;
  } else if (!categoryList) {
    // 데이터를 불러왔음에도 카테고리 리스트가 비어있다면 아래 항목을 출력하지 않아도 됩니다.
    return null;
  }

  return (
    <MoaCollectDiv>
      <StyledMoaCollectCard title="MOA모아보기">
        <MoaCollectTabMobile
          currentTab={currentTab}
          categoryList={categoryList}
          onClick={currentTab => {
            setIsLoadData(false);
            setCurrentData(curr => ({...curr, currentTab}));
          }}
        />
        <SelectUl>
          {ORDER_TYPE.map(({label, value}) => (
            <li
              key={label + value}
              className={cn({on: order === value})}
              onClick={() => setCurrentData(curr => ({
                ...curr,
                order: value,
                currentPage: 1
              }))}
            >
              {label}
            </li>
          ))}
        </SelectUl>
        <div>
          <MoaGatheringUl className="clearfix">
            {resData.map(
              ({slug, name, created_at, story_count, member_count, body, avatar}) => (
                <MoaGatheringMobile
                  key={slug}
                  name={name}
                  slug={slug}
                  created_at={created_at}
                  story_count={story_count}
                  member_count={member_count}
                  body={body}
                  avatar={avatar}
                  bandType={band_type}
                />
              ),
            )}
          </MoaGatheringUl>
        </div>
        {resRest.next && (
          <MoreLoadButton
            onClick={() => {
              setCurrentData(curr => ({
                ...curr,
                currentPage: curr.currentPage + 1,
              }));
            }}
          >
            더보기
            <img
              src={staticUrl('/static/images/icon/arrow/icon-more-arrow.png')}
              alt="더보기"
            />
          </MoreLoadButton>
        )}
      </StyledMoaCollectCard>
    </MoaCollectDiv>
  );
});

MoaCollectMobile.displayName = 'MoaCollectMobile';
export default MoaCollectMobile;
