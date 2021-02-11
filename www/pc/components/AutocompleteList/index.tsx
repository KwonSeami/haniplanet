import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {IAcCompProps} from '../inputs/Input/SearchBaseInput';
import {$TEXT_GRAY, $BORDER_COLOR, $POINT_BLUE, $WHITE} from '../../styles/variables.types';
import KeyWordHighlight from '../common/KeyWordHighlight';

export const AutocompleteUl = styled.ul<Pick<IAcCompProps, 'rightContent'>>`
  background-color: ${$WHITE};
  border-top: 1px solid ${$BORDER_COLOR};
  position: relative;
  z-index: 1;

  li {
    position: relative;
    display: block;
    width: 100%;
    height: 28px;
    font-size: 13px;
    box-sizing: border-box;
    padding: 4px 13px 5px;

    &.on, &:hover {
      background-color: #f9f9f9;
    }

    .right-content {
      position: absolute;
      right: 6px;
      top: 1px;
      letter-spacing: 0;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY,
      })}
    }
  }

  ${props => props.rightContent && `
    li {
      padding-right: 85px;
    }
  `}
`;

const AutocompleteList = React.memo<IAcCompProps>(
  ({acList, keyword, onSelectAutoList, className, children, rightContent: RightContent, queryKey, focusedRow, onDelete}) => (
    <AutocompleteUl rightContent={RightContent} className={className}>
      {acList.map((item, index) => {
        const text = queryKey ? item[queryKey] : item;

        return (
          <li
            className={cn('pointer ellipsis', { on: index + 1 === focusedRow })}
            key={`autocomplete-list--${index}`}
            onClick={() => onSelectAutoList(acList[index])}
            
          >
            {keyword ? (
              <KeyWordHighlight
                text={text}
                keyword={keyword}
                color={$POINT_BLUE}
              />
            ) : text}
            {RightContent && (
              <div
                className="right-content"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(text);
                }}
              >
                <RightContent item={item}/>
              </div>
            )}
          </li>
        );
      })}
      {children}
    </AutocompleteUl>
  ),
);

AutocompleteUl.displayName = 'AutocompleteUl';
AutocompleteList.displayName = 'AutocompleteList';

export default AutocompleteList;
