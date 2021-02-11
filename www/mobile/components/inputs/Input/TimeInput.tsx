import * as React from 'react';
import styled from 'styled-components';
import Input from '.';
import {DAY, HOUR, MINUTE} from '../../../src/constants/times';
import { $BORDER_COLOR, $FONT_COLOR } from '../../../styles/variables.types';

export type TTimeError = [
  boolean,
  { errMsg?: string; }
];

interface Props {
  time: ITimeRange;
  onChange: (time: Partial<ITimeRange>) => void;
  isTimeValid?: (timeValid: TTimeError) => void;
}

const StyledInput = styled(Input)`
  width: 35px !important;
  min-height: 35px;
  padding: 0 10px;
  font-size: 15px;
  color: ${$FONT_COLOR};
  border-radius: 2px;
  border: 1px solid ${$BORDER_COLOR} !important;
`;

const Div = styled.div`
  li {
    display: inline-block;

    span {
      padding: 0 6px;
    }
  }
`;

const TimeInput = React.memo<Props>(({time, onChange, isTimeValid}) => {
  const startMinuteRef = React.useRef<HTMLInputElement>();
  const endHourRef = React.useRef<HTMLInputElement>();
  const endMinuteRef = React.useRef<HTMLInputElement>();

  const {startHour, startMinute, endHour, endMinute} = time;

  const isValid = React.useCallback((): TTimeError => {
    const startTime = HOUR * Number(startHour) + MINUTE * Number(startMinute);
    const endTime = HOUR * Number(endHour) + MINUTE * Number(endMinute);

    if (!(!!startHour && !!startMinute && !!endHour && !!endMinute)) {
      return [false, { errMsg: '모든 항목을 입력해주세요' }];
    }

    if (DAY + 1 < startTime) {
      return [false, { errMsg: '시작 시간을 확인해주세요' }];
    }  if (DAY + 1 < endTime) {
      return [false, { errMsg: '종료 시간을 확인해주세요' }];
    } else if (startTime > endTime) {
      return [false, { errMsg: '시작 시간이 종료 시간보다 늦습니다' }];
    }

    return [true, {}];
  }, [time]);

  React.useEffect(() => {
    isTimeValid && isTimeValid(isValid());
  }, [isTimeValid, isValid]);

  return (
    <Div>
      <ul>
        <li>
          <StyledInput
            value={startHour}
            onChange={({target: {value: startHour}}) => {
              onChange({startHour});
              if (startHour.length === 2) {
                startMinuteRef.current.focus();
              }
            }}
            placeholder=""
            maxLength={2}
            numberOnly
          />
          &nbsp;:&nbsp;
          <StyledInput
            ref={startMinuteRef}
            value={startMinute}
            onChange={({target: {value: startMinute}}) => {
              onChange({startMinute});
              if (startMinute.length === 2) {
                endHourRef.current.focus();
              }
            }}
            placeholder=""
            maxLength={2}
            numberOnly
          />
          <span>~</span>
        </li>
        <li>
          <StyledInput
            ref={endHourRef}
            value={endHour}
            onChange={({target: {value: endHour}}) => {
              onChange({endHour});
              if (endHour.length === 2) {
                endMinuteRef.current.focus();
              }
            }}
            placeholder=""
            maxLength={2}
            numberOnly
          />
          &nbsp;:&nbsp;
          <StyledInput
            ref={endMinuteRef}
            value={endMinute}
            onChange={({target: {value: endMinute}}) => {
              onChange({endMinute});
            }}
            placeholder=""
            maxLength={2}
            numberOnly
          />
        </li>
      </ul>
    </Div>
  );
});

export default TimeInput;
