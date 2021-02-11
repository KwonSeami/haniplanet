import * as React from 'react';
import styled from 'styled-components';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import SearchBaseInput from '../inputs/Input/SearchBaseInput';
import TitlePopup, {TitleDiv} from '../common/popup/base/TitlePopup';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {PopupProps} from '../common/popup/base/Popup';
import {$FONT_COLOR, $TEXT_GRAY, $BORDER_COLOR, $POINT_BLUE, $WHITE} from '../../styles/variables.types';
import Loading from '../common/Loading';
import {useApolloClient} from '@apollo/react-hooks';
import {UPLOAD_WIKIS} from '../../src/gqls/wiki';


const StyledTitlePopup = styled(TitlePopup)`
  .modal-body {
    width: 500px;

    ${TitleDiv} h2 {
      position: relative;
      padding: 8px 0 9px 37px;
      ${fontStyleMixin({
        size: 15,
        weight: 'bold',
      })}

      &::after {
        content: '';
        position: absolute;
        top: 15px;
        left: 20px;
        width: 11px;
        height: 5px;
        background-color: ${$FONT_COLOR};
      }
    }

    @media screen and (max-width: 680px) {
      width: 92%;
    }
  }
`;

const DictPopupDiv = styled.div`
  width: 100%;
  height: calc(100% - 65px);
  padding: 0 20px 40px;
  box-sizing: border-box;

  .dict-search {
    position: relative;
    padding: 10px 0;
  }
`;

const StyledSearchBaseInput = styled(SearchBaseInput)`
  position: relative;
  height: 40px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR};

  input {
    width: 100%;
    height: 39px;
    padding-right: 60px;
    font-size: 14px;
  }

  img {
    width: 36px;
    position: absolute;
    right: 0;
    top: 2px;
  }
`;

const NoContentText = styled.p`
  text-align: center;
  height: 430px;
  padding-top: 180px;
  box-sizing: border-box;
  ${fontStyleMixin({
    size: 14,
    color: $TEXT_GRAY,
  })}

  img {
    display: block;
    margin: auto;
    width: 25px;
    padding-bottom: 5px;
  }
`;

const StyledInfiniteScroll = styled(InfiniteScroll)`
  padding: 0;
  overflow-y: auto;
  height: 430px;

  li {
    position: relative;
    width: 100%;
    padding: 10px 10px 12px;
    background-color: ${$WHITE};
    border-bottom: 1px solid #e4e6ed;
    box-sizing: border-box;

    h3, p, & > span {
      width: 100%;
      padding-right: 35px;
      box-sizing: border-box;
      font-weight: bold;
    }

    h3 {
      font-size: 15px;
      line-height: 1.5;
    }

    & > span {
      display: block;
      padding: 3px 35px 3px 0;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY,
      })};
    }

    p {
      ${fontStyleMixin({
        size: 12,
        color: $POINT_BLUE,
      })};
    }
  }
`;

interface IDictListState {
  nodes: any[];
  total_count: number;
  pending: boolean;
  currentPage: number;
}

type TDictListAction =
  | {type: 'START_PENDING'}
  | {type: 'SAVE_LIST', payload: any}
  | {type: 'FETCH_LIST', payload: any};

const dictListReducer = (state: IDictListState, action: TDictListAction): IDictListState => {
  switch (action.type) {
    case 'START_PENDING':
      return {
        ...state,
        pending: true,
      };
    case 'SAVE_LIST':
      return {
        ...state,
        ...action.payload,
        pending: false,
        currentPage: 1,
      };
    case 'FETCH_LIST':
      const {nodes} = action.payload;
      return {
        ...state,
        nodes: [
          ...state.nodes,
          ...nodes,
        ],
        pending: false,
        currentPage: state.currentPage + 1,
      };
    default:
      return state;
  }
};

const INITIAL_DICT_LIST: IDictListState = {
  nodes: [],
  total_count: 0,
  pending: false,
  currentPage: 1,
};

interface Props extends PopupProps {
  setDictList: React.Dispatch<React.SetStateAction<any[]>>;
}

const DictPopup = React.memo<Props>(
  ({id: popupId, closePop, setDictList}) => {
    const [dictQuery, setDictQuery] = React.useState('');
    const [dictList, dispatchDictList] = React.useReducer(dictListReducer, INITIAL_DICT_LIST);
    const {nodes, total_count, currentPage} = dictList;
    const client = useApolloClient();

    const searchData = React.useCallback((q: string) => {
      dispatchDictList({type: 'START_PENDING'});

      client.query({
        query: UPLOAD_WIKIS,
        variables: {q, limit: 20, offset: 0},
      })
        .then(({data: {wikis}}) => {
          dispatchDictList({type: 'SAVE_LIST', payload: wikis});
        });
    }, [client]);
    const fetchData = React.useCallback((q: string, currentPage: number) => {
      dispatchDictList({type: 'START_PENDING'});

      client.query({
        query: UPLOAD_WIKIS,
        variables: {q, limit: 20, offset: currentPage},
      })
        .then(({data: {wikis}}) => {
          dispatchDictList({type: 'FETCH_LIST', payload: wikis});
        });
    }, [client]);

    return (
      <StyledTitlePopup
        id={popupId}
        closePop={closePop}
        title="처방사전 첨부"
      >
        <DictPopupDiv>
          <div className="dict-search">
            <form
              action=""
              onSubmit={e => {
                e.preventDefault();

                if (dictQuery.length < 2) {
                  alert('검색어를 두 글자 이상 입력해주세요.');
                  return null;
                }

                searchData(dictQuery);
              }}
            >
              <StyledSearchBaseInput
                value={dictQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const dictQuery = (e.target ? e.target.value : e) as string;

                  setDictQuery(dictQuery);
                }}
                searchBtn={
                  <img
                    src={staticUrl('/static/images/icon/icon-search.png')}
                    alt="처방사전 검색"
                    onClick={() => {
                      if (dictQuery.length < 2) {
                        alert('검색어를 두 글자 이상 입력해주세요.');
                        return null;
                      }

                      searchData(dictQuery);
                    }}
                  />
                }
                onReset={() => setDictQuery('')}
                placeholder="검색어를 입력해 주세요."
              />
            </form>
          </div>

          {!nodes.length ? (
            <NoContentText>
              <img
                src={staticUrl('/static/images/icon/icon-no-content.png')}
                alt="비어있음"
              />
              검색어를 입력해주세요
            </NoContentText>
          ) : (
            <StyledInfiniteScroll
              loader={<Loading/>}
              hasMore={total_count > nodes.length}
              loadMore={() => fetchData(dictQuery, currentPage)}
            >
              <ul>
                {nodes.map(item => {
                  const {code, name, chn_name, other_name, dependencies} = item;

                  return (
                    <li
                      key={`dict-popup-${code}`}
                      className="pointer"
                      onClick={() => {
                        setDictList({...item});
                        closePop(popupId);
                      }}
                    >
                      <h3 className="ellipsis">
                        {name}
                        <span>{chn_name}</span>
                      </h3>
                      {dependencies && (
                        <span className="ellipsis">
                          {dependencies.map(({child: {name}}) => name).join(', ')}
                        </span>
                      )}
                      {other_name && (
                        <span className="ellipsis">{other_name}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </StyledInfiniteScroll>
          )}
        </DictPopupDiv>
      </StyledTitlePopup>
    );
  },
);

export default DictPopup;
