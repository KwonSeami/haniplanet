import * as React from 'react';
import cn from 'classnames';
import Input from '../../../inputs/Input/InputDynamic';
import StyledTimeRangeTable from './StyledTimeRangeTable';
import {DATE_RANGE} from '../../../../src/lib/date';
import {SHORT_DAY_TO_KOR} from '../../../../src/constants/day';
import {VALIDATE_REGEX} from '../../../../src/constants/validates';

interface IDateMap<T> {
  mon: T;
  tue: T;
  wed: T;
  thu: T;
  fri: T;
  sat: T;
  sun: T;
}

interface Props {
  isEdit?: boolean;
  dayMap?: IDateMap<string>;
  defaultTimeList?: IDateRange;
  callback?: ({timeList: IDateRange, recessDay: any}) => void;
}

const DAY_LIST = Object.keys(SHORT_DAY_TO_KOR);
const {VALIDATE_HH_MM_TIME: [timeRegex]} = VALIDATE_REGEX;

const replaceTimeFormat = (time: string) => {
  const notNumberRegex = /[^0-9]+$/;
  const timeRuleRegex =/([0-9]{2})([0-9])$/;

  return time
    .replace(notNumberRegex, '')
    .replace(timeRuleRegex, "$1:$2");
};

const toRecessDay = (timeList) => (
  DAY_LIST.reduce((prev, curr) => ({
    ...prev,
    [curr]: !(timeRegex.test(timeList[`${curr}_start_at`]) && timeRegex.test(timeList[`${curr}_end_at`]))
  }), {})
);

export const validTimeRange = (timeList, recessDay) => {
  const activeDays = Object.keys(recessDay)
    .filter(item => !recessDay[item]);

  for (const day of activeDays) {
    const startMedicalTime = timeList[`${day}_start_at`];
    const endMedicalTime = timeList[`${day}_end_at`];

    if (!startMedicalTime || !endMedicalTime) {
      return '진료 시간을 입력해주세요!';
    } else if (!timeRegex.test(startMedicalTime) || !timeRegex.test(endMedicalTime)) {
      return '형식에 맞는 진료 시간을 입력해주세요!';
    } else if (startMedicalTime > endMedicalTime) {
      return '종료 시간은 시작 시간보다 빠를 수 없습니다.';
    }
  }

  return '';
};

const TimeRangeTable: React.FC<Props> = ({
  isEdit = false,
  dayMap = SHORT_DAY_TO_KOR,
  defaultTimeList,
  callback,
}) => {
  const [timeList, setTimeList] = React.useState(defaultTimeList || DATE_RANGE);
  const [recessDay, setRecessDay] = React.useState(
    defaultTimeList
      ? toRecessDay(timeList)
      : DAY_LIST.reduce((prev, curr) => ({...prev, [curr]: false}), {})
  );

  React.useEffect(() => {
    callback && callback({timeList, recessDay});
  }, [callback, timeList, recessDay]);

  return (
    <StyledTimeRangeTable>
      <caption>진료시간 및 휴진 여부</caption>
      <tr>
        {DAY_LIST.map(day => (
          <th
            key={day}
            className={cn({
              edit: isEdit,
              on: !recessDay[day],
            })}
            onClick={() => {
              if(isEdit) {
                setRecessDay(curr => ({...curr, [day]: !curr[day]}));
                setTimeList(curr => ({
                  ...curr,
                  [`${day}_start_at`]: '',
                  [`${day}_end_at`]: '',
                }));
              }}
            }
          >
            <span>{dayMap[day]}</span>
          </th>
        ))}
      </tr>
      <tr>
        {DAY_LIST.map(day => {
          const startAt = `${day}_start_at`;

          return (
            (recessDay[day] && !isEdit) ? (
              <td rowSpan={2}>휴진</td>
            ) : (
              <td>
                <Input
                  className="date-input"
                  readOnly={!isEdit}
                  disabled={recessDay[day]}
                  maxLength={5}
                  placeholder="09:00"
                  value={timeList[startAt]}
                  onChange={({target: {value}}) => {
                    setTimeList(curr => ({
                      ...curr,
                      [startAt]: replaceTimeFormat(value),
                    }));
                  }}
                  onBlur={({target: {value}}) => {
                    if (!timeRegex.test(value)) {
                      alert('형식에 맞는 진료 시간을 입력해주세요!');
                    }
                  }}
                />
              </td>
            )
          )
        })}
      </tr>
      <tr>
        {DAY_LIST.map(day => {
          const endAt = `${day}_end_at`;

          return (
            (!recessDay[day] || isEdit) && (
              <td>
                <Input
                  className="date-input"
                  readOnly={!isEdit}
                  disabled={recessDay[day]}
                  maxLength={5}
                  value={timeList[endAt]}
                  placeholder="18:00"
                  onChange={({target: {value}}) => {
                    setTimeList(curr => ({
                      ...curr,
                      [endAt]: replaceTimeFormat(value),
                    }));
                  }}
                  onBlur={({target: {value}}) => {
                    if (!timeRegex.test(value)) {
                      alert('형식에 맞는 진료 시간을 입력해주세요!');
                    }
                  }}
                />
              </td>
            )
          );
        })}
      </tr>
    </StyledTimeRangeTable>
  );
};

export default React.memo(TimeRangeTable);