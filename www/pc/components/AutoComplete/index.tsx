import * as React from 'react';
import cn from 'classnames';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import AutoCompleteList from '../AutocompleteList/';
import Button from '../inputs/Button';
import UserApi from '../../src/apis/UserApi';
import SearchApi from '../../src/apis/SearchApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {getAutoComplete, setAutoComplete} from '../../src/lib/autoComplete';
import {staticUrl} from '../../src/constants/env';
import {updateUser} from '../../src/reducers/orm/user/userReducer';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {IAcCompProps} from '../inputs/Input/SearchBaseInput';
import {$TEXT_GRAY, $BORDER_COLOR, $FONT_COLOR, $WHITE, $POINT_BLUE, $GRAY} from '../../styles/variables.types';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";

const AutocompleteDiv = styled.div`
  position: relative;
  width: 480px;
  z-index: 10;
  box-sizing: border-box;
  border: 1px solid ${$BORDER_COLOR};
  border-top-color: ${$FONT_COLOR};
  background-color: ${$WHITE};

  h2 {
    padding: 15px 14px 17px;
    ${fontStyleMixin({
      size: 13,
      color: $TEXT_GRAY
    })}
  }
`;

const StyledButton = styled(Button)`
  position: absolute;
  right: 12px;
  top: 11px;
`;

const StyledAutoCompleteList = styled(AutoCompleteList)`
  border: 0;

  li:last-child {
    margin-bottom: 9px;
  }
`;

export const SwitchBtnUl = styled.ul`
  text-align: right;
  padding: 10px 14px 10px 10px;
  border-top: 1px solid ${$BORDER_COLOR};

  li {
    display: inline-block;
    vertical-align: middle;
    padding-left: 11px;
    
    ${fontStyleMixin({
      size: 13,
      color: $GRAY
    })}

    div {
      display: inline-block;
      vertical-align: middle;
      margin: -5px 0 0px 9px;
    }
  }
`;

const ToggleBtnDiv = styled.div`
  position: relative;
  width: 50px;
  height: 17px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid ${$BORDER_COLOR};
  transition: background-color .5s, border-color .5s;

  .dot {
    position: absolute;
    right: -1px;
    display: block;
    background-color: ${$BORDER_COLOR};
    width: 36px;
    ${heightMixin(16)}
    box-sizing: border-box;
    border-radius: 10px;
    text-align: center;
    letter-spacing: 0;
    ${fontStyleMixin({
      size: 10,
      weight: 'bold',
      color: $WHITE
    })}
  }

  &.on .dot {
    background-color: ${$POINT_BLUE};
    right: auto;
    left: -1px;
    text-indent: -3px;
  }
`;

const RightContentSpan = styled.span`
  letter-spacing: 0;
  
  img {
    position: static;
    display: inline-block;
    vertical-align: middle;
    margin-top: -3px;
    width: 26px;
  }
`;

export interface IRightContentProps {
  last_searched_at: string;
}

const RightContent = React.memo<IRightContentProps>(
  ({last_searched_at}) => (
    <RightContentSpan>
      {moment(last_searched_at).format('YY.MM.DD')}
      <img
        className="pointer"
        src={staticUrl("/static/images/icon/search-delete.png")}
        alt="삭제"
      />
    </RightContentSpan>
  )
);

interface Props extends IAcCompProps {
  on?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const AutoComplete = React.memo(
  React.forwardRef<HTMLDivElement, Props>(
    ({acList, keyword, children, focusedRow, className, rightContent}, ref) => {
      const dispatch = useDispatch();
      const user = useSelector(
        ({orm, system: {session: {id}}}) => pickUserSelector(id)(orm) || {},
        (prev, next) => isEqual(prev, next)
      );
      const {id, is_save_search, searched = []} = user;

      const userApi: UserApi = useCallAccessFunc(access => new UserApi(access));
      const searchApi: SearchApi = useCallAccessFunc(access => new SearchApi(access));
      const router = useRouter();

      const [{isAbleAutoComplete}, setAutoCompleteState] = React.useState(id
        ? (getAutoComplete(id) || {isAbleAutoComplete: false}) // null 방지
        : {isAbleAutoComplete: false}
      );

      const deleteAllHistory = React.useCallback(() => {
        if (!isEmpty(searched)) {
          searchApi.deleteSearchHistory()
            .then(({status}) => {
              if (status === 200) {
                dispatch(updateUser(
                  id,
                  ({searched: _, ...curr}) => ({
                    ...curr,
                    searched: []
                  })
                ));
              }
            });
        }
      }, [id, searched]);

      const deleteHistory = React.useCallback((value: string) => {
        searchApi.deleteSearchHistory(value)
          .then(({status}) => {
            if (status === 200) {
              dispatch(updateUser(
                id,
                ({searched, ...curr}) => ({
                  ...curr,
                  searched: searched.filter(({keyword}) => keyword !== value)
                })
              ));
            }
          });
      }, [id]);

      const saveSearch = React.useCallback(() => {
        userApi.patchMe({is_save_search: !is_save_search})
          .then(({data: {result}}) =>
            !!result && dispatch(updateUser(
              id,
              curr => ({...curr, ...result})
            )));
      }, [id, is_save_search]);

      return (
        <AutocompleteDiv
          ref={ref}
          className={className}
        >
          {!keyword && (
            <div>
              <h2>최근 검색어</h2>
              <StyledButton
                size={{width: '64px', height: '24px'}}
                font={{size: '11px', color: $TEXT_GRAY, weight: 'bold'}}
                border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
                onClick={deleteAllHistory}
              >
                전체삭제
              </StyledButton>
            </div>
          )}
          <StyledAutoCompleteList
            acList={keyword
              ? isAbleAutoComplete
                ? acList || []
                : []
              : searched
            }
            keyword={keyword}
            rightContent={(isEmpty(acList) && (rightContent || RightContent)) as React.ComponentType}
            onSelectAutoList={value => {
              router.push(`/search?q=${value.keyword || value}`);
            }}
            focusedRow={focusedRow}
            queryKey={keyword ? '' : 'keyword'}
            onDelete={deleteHistory}
          >
            {(isEmpty(searched) && !keyword) && (
              children
            )}
          </StyledAutoCompleteList>
          <SwitchBtnUl>
            <li>
              검색기록 저장
              <ToggleBtnDiv
                className={
                  cn('pointer', {on: is_save_search})
                }
                onClick={saveSearch}
              >
                <span className="dot">
                  {is_save_search ? 'ON' : 'OFF'}
                </span>
              </ToggleBtnDiv>
            </li>
            <li>
              자동완성
              <ToggleBtnDiv
                className={
                  cn('pointer', {on: isAbleAutoComplete})
                }
                onClick={() => {
                  setAutoComplete(id, {isAbleAutoComplete: !isAbleAutoComplete});
                  setAutoCompleteState(curr => ({
                    isAbleAutoComplete: !curr.isAbleAutoComplete
                  }));
                }}
              >
                <span className="dot">
                  {isAbleAutoComplete ? 'ON' : 'OFF'}
                </span>
              </ToggleBtnDiv>
            </li>
          </SwitchBtnUl>
        </AutocompleteDiv>
      );
    }
  )
);

AutoComplete.displayName = 'AutoComplete';
export default AutoComplete;
