import {staticUrl} from "../src/constants/env";
import * as React from "react";
import classNames from "classnames";
import styled from "styled-components";
import {range} from 'lodash/util';

const Ul = styled.ul`
  li {
    margin: 0 2px;
    display: inline-block;
  
    img {
      display: inline-block;
      vertical-align: middle;
      width: 28px;
      height: 28px;
    }
  }
`;

interface IProps {
  value: number;
  onChange: (score: number) => void;
  count?: number;
  unit?: number;
  className?: string;
}

const Rating = React.memo<IProps>((
  {
    className,
    value,
    unit = 2,
    count = 5,
    onChange
  }
) => {
  const [hoverPosition, setHoverPosition] = React.useState(-1);

  return (
    <Ul
      className={classNames('rating', className)}
      onMouseLeave={() => setHoverPosition(-1)}
    >
      {range(count).map(idx => {
        const position = (idx + 1) * unit;
        return (
          <li
            key={position}
            onMouseEnter={() => setHoverPosition(position)}
            onMouseLeave={() => setHoverPosition(position)}
            onClick={() => onChange && (
              position === value ? (
                onChange(0),
                setHoverPosition(0)
              ) : (
                onChange(position)
              ))}
            className="pointer"
          >
            {(hoverPosition >= position || value >= position) ? (
              <img
                src={staticUrl('/static/images/icon/icon-story-star-on.png')}
                alt="icon-star-on"
              />
            ) : (
              <img
                src={staticUrl('/static/images/icon/icon-story-star-off.png')}
                alt="icon-star-off"
              />
            )}
          </li>
        );
      })}
    </Ul>
  );
});

export default Rating;
