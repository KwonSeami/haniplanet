import * as React from 'react';
import styled from 'styled-components';
import Button from './Button';
import {$WHITE, $POINT_BLUE, $TEXT_GRAY} from '../../styles/variables.types';
import {SHORT_DAY_TO_KOR} from '../../src/constants/day';
import isEqual from 'lodash/isEqual';

const Ul = styled.ul`
  li {
    display: inline-block;
    vertical-align: middle;
    padding-right: 9px;
  }
`;

const DateButton = styled(Button)`
  &.on {
    background-color: ${$WHITE};
    color: ${$POINT_BLUE};
  }
`;

interface IDateButtonCompProps {
  name: string;
  on: boolean;
  onClick: () => void;
}

const DateButtonComp: React.FC<IDateButtonCompProps> = React.memo(({
  name,
  on,
  onClick
}) => (
  <li>
    <DateButton
      className={on ? 'on' : undefined}
      size={{
        width: '50px',
        height: '50px'
      }}
      border={{
        radius: '16px',
        color: '#eee',
        width: '1px'
      }}
      font={{
        size: '16px',
        color: $TEXT_GRAY
      }}
      backgroundColor="#f9f9f9"
      onClick={onClick}
    >
      {name}
    </DateButton>
  </li>
));

const DEFAULT_DAY_STATUS = {
  mon: false,
  tue: false,
  wed: false,
  thu: false,
  fri: false,
  sat: false,
  sun: false
};

type TDayStatus = typeof DEFAULT_DAY_STATUS;

interface Props {
  defaultStatus?: TDayStatus;
  callback?: ({day, currState}: {
    day: keyof TDayStatus;
    currState: TDayStatus
  }) => void;
}

const DayPicker2: React.FC<Props> = React.memo(({defaultStatus, callback}) => {
  const [day, setDay] = React.useState(defaultStatus || DEFAULT_DAY_STATUS);

  React.useEffect(() => {
    if (defaultStatus && !isEqual(defaultStatus, day)) {
      setDay(defaultStatus);
    }
  }, [defaultStatus, day]);

  return (
    <Ul>
      {Object.keys(day).map(d => (
        <DateButtonComp
          key={d}
          name={SHORT_DAY_TO_KOR[d]}
          on={!day[d]}
          onClick={() => {
            const changedState = {
              ...day,
              [d]: !day[d]
            };

            setDay(changedState);
            callback && callback({
              day: d as keyof TDayStatus,
              currState: changedState
            });
          }}
        />
      ))}
    </Ul>
  );
});

DayPicker2.displayName = 'DayPicker2';

export default DayPicker2;
