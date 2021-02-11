import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import flatten from 'lodash/flatten';
import dropRight from 'lodash/dropRight';
import Button from './Button/ButtonDynamic';
import TimeInput from './Input/TimeInput';
import {staticUrl} from '../../src/constants/env';
import {DAY_VALUE} from '../../src/constants/day';

// @혜연. 해당 부분 스타일 수정 부탁드립니다.
const DayPickerBox = styled.div`
  display: flex;
  flex-direction: column;

  & > ul {
    display: flex;
    flex-direction: column;

    & > li {
      display: flex;

      .day-select-btn {
        &:disabled {
          background: cyan;
        }
        &.on {
          background: tomato;
        }
      }
    }
  }

  .add-day-btn {
  }
`;

export interface IDayTimeItem {
  time: ITimeRange;
  isTimeValid: [boolean, any];
  day: any[];
}

const INITAL_SELECTED_TIME_STATE: IDayTimeItem = {
  time: {startHour: '', startMinute: '', endHour: '', endMinute: ''},
  isTimeValid: [false, { errMsg: '모든 항목을 입력해주세요' }],
  day: [],
};

interface Props {
  onChange: (dayTime: IDayTimeItem[]) => void;
}

const DayPicker = React.memo<Props>(
  ({onChange}) => {
    const [selectedTime, setSelectedTime] = React.useState<IDayTimeItem[]>(
      [INITAL_SELECTED_TIME_STATE]
    );
  
    const flattenList = React.useCallback((dayTimes: IDayTimeItem[]) => {
      const dayList = [];
      for (const item of dayTimes) {
        dayList.push(item.day);
      }
  
      return flatten(dayList);
    }, []);
  
    React.useEffect(() => {
      onChange(selectedTime);
    }, [selectedTime]);
  
    return (
      <DayPickerBox className="day-picker">
        <ul>
          {selectedTime.map((days, daysIdx) => {
            const flattenPrevDayList = flattenList(
              dropRight(selectedTime, selectedTime.length - daysIdx)
            );
  
            return (
              <li key={daysIdx}>
                {DAY_VALUE.map(([value, prefix]) => (
                  <Button
                    key={prefix + value}
                    disabled={flattenPrevDayList.includes(prefix)}
                    className={cn('day-select-btn', {
                      on: days.day.includes(prefix),
                    })}
                    onClick={() => {
                      setSelectedTime(curr => curr.reduce((prev, curr, currIdx) => (
                        daysIdx === currIdx
                          ? [
                            ...prev,
                            {
                              ...curr,
                              day: !!curr.day.includes(prefix)
                                ? curr.day.filter(item => item !== prefix)
                                : [...curr.day, prefix]
                            }
                          ]
                          : [...prev, curr]
                      ), []));
                    }}
                  >
                    {value}
                  </Button>
                ))}
                <TimeInput
                  time={days.time}
                  onChange={chanedTime => {
                    setSelectedTime(curr => curr.reduce((prev, curr, currIdx) => (
                      daysIdx === currIdx
                        ? [...prev, {...curr, time: {...curr.time, ...chanedTime}}]
                        : [...prev, curr]
                    ), []));
                  }}
                  // @용빈: 이와 같이 isTimeValid를 따로 넘겨줘서 두 번 렌더링되는 이슈가 있습니다.
                  // onChange시에, valid 정보를 같이 넘겨주는 방법으로 개선합니다.
                  isTimeValid={isTimeValid => {
                    setSelectedTime(curr => curr.reduce((prev, curr, currIdx) => (
                      daysIdx === currIdx
                        ? [...prev, {...curr, isTimeValid}]
                        : [...prev, curr]
                    ), []));
                  }}
                />
                {daysIdx !== 0 && (
                  <Button
                    onClick={() => {
                      setSelectedTime(curr => curr.filter((_, currIdx) => daysIdx !== currIdx));
                    }}
                  >
                    <img
                      src={staticUrl("/static/images/icon/btn-line-gray.png")}
                      alt="삭제"
                    />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
        {flattenList(selectedTime).length < 7 && (
          <Button
            className="add-day-btn"
            onClick={() => {
              for (const item of selectedTime) {
                if (!item.isTimeValid[0]) {
                  alert('시간을 확인해주세요.');
                  return null;
                }
              }
              setSelectedTime(curr => [...curr, INITAL_SELECTED_TIME_STATE]);
            }}
          >
            추가
          </Button>
        )}
      </DayPickerBox>
    );
  }
);

export default DayPicker;
