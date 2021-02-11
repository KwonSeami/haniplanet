import * as React from 'react';
import cn from 'classnames';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import AutoCompleteList from '../../AutocompleteList';
import Button from '../../inputs/Button';
import UserApi from '../../../src/apis/UserApi';
import SearchApi from '../../../src/apis/SearchApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {getAutoComplete, setAutoComplete} from '../../../src/lib/autoComplete';
import {staticUrl} from '../../../src/constants/env';
import {updateUser} from '../../../src/reducers/orm/user/userReducer';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {IAcCompProps} from '../../inputs/Input/SearchBaseInput';
import {$TEXT_GRAY, $BORDER_COLOR, $FONT_COLOR, $WHITE, $POINT_BLUE, $GRAY} from '../../../styles/variables.types';
import {useRouter} from "next/router";

const AutocompleteDiv = styled.div`
  position: relative;
  width: 480px;
  z-index: 10;
  box-sizing: border-box;
  border: 1px solid ${$BORDER_COLOR};
  border-top-color: ${$FONT_COLOR};
  background-color: ${$WHITE};

  h2 {
    padding: 15px 14px 14px;
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
  opacity: 0.6;
`;

const StyledAutoCompleteList = styled(AutoCompleteList)`
  border: 0;

  li:last-child {
    margin-bottom: 12px;
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
  height: 18px;
  border-radius: 10px;
  border: 1px solid ${$BORDER_COLOR};
  transition: background-color .5s, border-color .5s;
  box-sizing: border-box;

  .dot {
    display: block;
    position: absolute;
    right: -1px;
    top: -1px;
    width: 36px;
    ${heightMixin(18)}
    letter-spacing: 0;
    text-align: center;
    border-radius: 10px;
    border: 1px solid ${$BORDER_COLOR};
    background-color: ${$BORDER_COLOR};
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 10,
      weight: 'bold',
      color: $WHITE
    })}
  }

  &.on .dot {
    right: auto;
    left: -1px;
    text-indent: -2px;
    border: 1px solid ${$POINT_BLUE};
    background-color: ${$POINT_BLUE};
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

interface IRightContentProps {
  last_searched_at: string;
}

const RightContent = React.memo<IRightContentProps>(
  ({last_searched_at}) => (
    <RightContentSpan>
      {moment(last_searched_at).format('YY.MM.DD')}
      <img
        className="pointer"
        src={staticUrl("/static/images/icon/icon-serarch-delete.png")}
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
    ({acList, keyword, children, focusedRow, className}, ref) => {
      const dispatch = useDispatch();
      const user = useSelector(
        ({orm, system: {session: {id}}}) => pickUserSelector(id)(orm) || {},
        (prev, next) => isEqual(prev, next)
      );
      const {id, is_save_search, searched = []} = user;
    
      const [{isAbleAutoComplete}, setAutoCompleteState] = React.useState(id
        ? (getAutoComplete(id) || {isAbleAutoComplete: false}) // null 방지
        : {isAbleAutoComplete: false}
      );
    
      const userApi: UserApi = useCallAccessFunc(access => new UserApi(access));
      const searchApi: SearchApi = useCallAccessFunc(access => new SearchApi(access));
      const router=useRouter();
    
      return (
        <AutocompleteDiv
          ref={ref}
          className={className || ''}
        >
          {!keyword && (
            <div>
              <h2>최근 검색어</h2>
              <StyledButton
                size={{width: '64px', height: '24px'}}
                font={{size: '11px', color: $TEXT_GRAY, weight: 'bold'}}
                border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
                onClick={() => {
                  if (!isEmpty(searched)) {
                    searchApi.deleteSearchHistory()
                      .then(({status}) => {
                        if (Math.floor(status / 100) !== 4) {
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
                }}
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
            rightContent={isEmpty(acList) && RightContent}
            onSelectAutoList={value => {
              router.push(`/search?q=${value.keyword || value}`);
            }}
            focusedRow={focusedRow}
            queryKey={keyword ? '' : 'keyword'}
            onDelete={value => {
              searchApi.deleteSearchHistory(value)
                .then(({status}) => {
                  if (Math.floor(status / 100) !== 4) {
                    dispatch(updateUser(
                      id,
                      ({searched, ...curr}) => ({
                        ...curr,
                        searched: searched.filter(({keyword}) => keyword !== value)
                      })
                    )); 
                  }
                });
            }}
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
                onClick={() => {
                  userApi.patchMe({is_save_search: !is_save_search})
                    .then(({data: {result}}) => 
                      !!result && dispatch(updateUser(
                        id, 
                        curr => ({...curr, ...result})
                      )));
                }}
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

/**
 * TODO
 * 검색 후 focus가 풀리도록
 * 검색 기록 저장 혹은 자동완성 toggle시 focus가 유지되도록
 */
