import * as React from 'react';
import styled from 'styled-components';
import {backgroundImgMixin, fontStyleMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $WHITE} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';
import classNames from "classnames";

export const UserNameSelectorUl = styled.ul`
  li {
    position: relative;
    display: inline-block;
    padding: 1.5px 8px 2.5px 6px;
    border-radius: 3px;
    border: 1px solid ${$BORDER_COLOR};
    background-color: ${$WHITE};
    box-sizing: border-box;    
    ${fontStyleMixin({
      size: 12,
      color: $FONT_COLOR,
    })}

    & +li {
      margin-left: 3px;
    }

    &.on {
      padding: 1.5px 6px 2.5px 17px;
      color: ${$POINT_BLUE};
      border-color: ${$POINT_BLUE};

      &::before {
        content: '';
        position: absolute;
        top: 6px;
        left: 6px;
        width: 10px;
        height: 12px;
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/check/icon-editor-select.png'),
        })}
      }
    }
  }
`;

interface IProps {
  value: string;
  onChange: (val: string) => void;
  types?: Array<[string, string]>;
}

// TODO: 그냥 Selector 여도 될듯
const UserNameSelector = React.memo<IProps>(
  (
    {
      value,
      onChange,
      types = [['real', '실명'], ['nick', '닉네임'], ['anon', '익명']]
    }
  ) => {
    return (
      <UserNameSelectorUl className="user-name-selector">
        {types.map(([code, name]) => (
          <li
            key={code}
            className={classNames({on: value === code})}
            onClick={() => onChange(code)}
          >
            {name}
          </li>
        ))}
      </UserNameSelectorUl>
    )
  });

export default UserNameSelector;
