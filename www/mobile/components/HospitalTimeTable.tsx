import React from 'react';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import Input from './inputs/Input';
import {fontStyleMixin} from '../styles/mixins.styles';
import {convertToShowDateFormat} from '../src/lib/date';
import {SHORT_DAY_TO_KOR} from '../src/constants/day';
import {$FONT_COLOR, $TEXT_GRAY, $WHITE} from '../styles/variables.types';
import {DEFAULT_DAY_OF_RECESS, IHospitalRegisterState} from '../src/hooks/hospital/useHospitalRegister';
import {VALIDATE_REGEX} from '../src/constants/validates';

export const ScheduleTable = styled.table`
  width: auto;
  padding-bottom: 1px;

  caption {
    display: none;
  }

  tr {
    th {
      display: inline-block;
      background-color: #f9f9f9;
      text-align: center;
      padding: 0;
      border: 1px solid #eee;
      box-sizing: border-box;
      ${fontStyleMixin({
        size: 15,
        color: $TEXT_GRAY
      })};
  
      &.on {
        background-color: #90b0d7;
        color: ${$WHITE};
        border: none;
      }
    }

    td {
      padding: 0;

      .line {
        display: inline-block;
        vertical-align: middle;
        height: 1px;
        background-color: ${$FONT_COLOR};
      }
    }
  }
`;

const DateInput = styled(Input)`
  display: inline-block !important;
  vertical-align: middle;
  width: 70px;
  height: 100%;
  padding: 0;
  text-align: center;
  ${fontStyleMixin({
    size: 17,
    weight: '300',
    family: 'Montserrat',
    color: $FONT_COLOR
  })};

  &::placeholder {
    color: ${$TEXT_GRAY};
  }
`;

interface ICareTimeCompProps {
  on: boolean;
  disabled?: boolean;
  readOnly: boolean;
  startAtValue: string;
  endAtValue: string;
  onChangeStartAt: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeEndAt: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurStartAt: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurEndAt: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


const CareTimeComp = React.memo<ICareTimeCompProps>(({
  on,
  disabled,
  readOnly,
  startAtValue,
  endAtValue,
  onChangeStartAt,
  onChangeEndAt,
  onBlurStartAt,
  onBlurEndAt,
}) => {
  if (readOnly && !on) {
    return <td colSpan={2}> 휴진 </td>;
  }

  return (
    <td>
      <DateInput
        placeholder="09:00"
        disabled={disabled}
        readOnly={readOnly}
        value={startAtValue || ''}
        onChange={onChangeStartAt}
        onBlur={onBlurStartAt}
        maxLength={5}
      />
      <span className="line"/>
      <DateInput
        placeholder="18:00"
        disabled={disabled}
        value={endAtValue || ''}
        onChange={onChangeEndAt}
        onBlur={onBlurEndAt}
        maxLength={5}
      />
    </td>
  );
});

const filterTime = (time: string) => {
  const timeRuleRegex =/([0-9]{2})([0-9])$/;
  const notNumberRegex = /[^0-9]+$/;

  return time.replace(notNumberRegex, '').replace(timeRuleRegex, "$1:$2");
};

interface ITimeTableProps {
  workDayObj: {[key: string]: string};
  isEdit: boolean;
  type?: string;
  recessDay: any;
  setHospital?: React.Dispatch<React.SetStateAction<IHospitalRegisterState>>;
}

type TRecessDay = typeof DEFAULT_DAY_OF_RECESS;

const HospitalTimeTable = ({workDayObj, isEdit, type, recessDay, setHospital}) => {
  const dayList = Object.keys(SHORT_DAY_TO_KOR);
  const [hospitalTimeList, setHospitalTimeList] = React.useState(workDayObj);
  const {VALIDATE_HH_MM_TIME: [timeRegex]} = VALIDATE_REGEX;

  React.useEffect(() => {
    setHospitalTimeList(workDayObj);

    if (type === 'EDIT') {
      const activeDatePrefix = dayList
        .reduce((prev, curr) => {
          if (timeRegex.test(workDayObj[`${curr}_start_at`]) && timeRegex.test(workDayObj[`${curr}_end_at`])) {
            return prev.includes(curr) ? prev : [...prev, curr];
          } else {
            return prev;
          }
        }, []);

      const recessDay = dayList.reduce<TRecessDay>(
        (prev, curr) => ({
          ...prev,
          [curr]: !activeDatePrefix.includes(curr),
        }),
        {} as TRecessDay,
      );

      setHospital(curr => ({...curr, recessDay}));
    }
  },[workDayObj]);

  return (
    !isEmpty(hospitalTimeList) && (
      <ScheduleTable>
        <caption>진료시간 및 휴진 여부</caption>
        {dayList.map((day) => {
          const isWorkingDay = !recessDay[day];
          const startAt = `${day}_start_at`;
          const endAt = `${day}_end_at`;

          return (
            <tr>
              <th
                className={cn({on: !recessDay[day]})}
                onClick={() => isEdit && (
                  setHospital(curr => ({
                    ...curr,
                    recessDay: {
                      ...curr.recessDay,
                      [day]: isWorkingDay,
                    },
                    medicalTime: {
                      ...curr.medicalTime,
                      [`${day}_start_at`]: isWorkingDay ? '' : '09:00',
                      [`${day}_end_at`]: isWorkingDay ? '' : '18:00',
                    }
                  }))
                )}
              >
                <span>{SHORT_DAY_TO_KOR[day]}</span>
              </th>
              <CareTimeComp
                on={isEdit || isWorkingDay}
                disabled={recessDay[day]}
                readOnly={!isEdit}
                startAtValue={!recessDay[day] && hospitalTimeList[startAt] || ''}
                endAtValue={!recessDay[day] && hospitalTimeList[endAt] || ''}
                onChangeStartAt={({target: {value}}) => {
                  setHospitalTimeList(curr => ({
                    ...curr,
                    [startAt]: filterTime(value)
                  }))
                }}
                onChangeEndAt={({target: {value}}) => {
                  setHospitalTimeList(curr => ({
                    ...curr,
                    [endAt]: filterTime(value)
                  }))
                }}
                onBlurStartAt={({target: {value}}) => {
                  if (!timeRegex.test(value)) {
                    alert('형식에 맞는 진료 시간을 입력해주세요!');
                  } else {
                    setHospital && setHospital(curr => ({
                      ...curr,
                      medicalTime: {
                        ...curr.medicalTime,
                        [startAt]: value
                      }
                    }));
                  }
                }}
                onBlurEndAt={({target: {value}}) => {
                  if (!timeRegex.test(value)) {
                    alert('형식에 맞는 진료 시간을 입력해주세요!');
                  } else {
                    setHospital && setHospital(curr => ({
                      ...curr,
                      medicalTime: {
                        ...curr.medicalTime,
                        [endAt]: value
                      }
                    }));
                  }
                }}
              />
            </tr>
          );
        })}
      </ScheduleTable>
    )
  );
};

export default React.memo<ITimeTableProps>(HospitalTimeTable);
