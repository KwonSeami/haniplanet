import * as React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'react-day-picker/moment';
import styled from 'styled-components';
// import * as pickerStyle from 'react-day-picker/lib/style.css';
import {DayPickerProps} from 'react-day-picker/types/Props';
import {staticUrl} from '../src/constants/env';
import Input from './inputs/Input/InputDynamic';

interface WeekDayType {
  [key: string]: [string, string, string, string, string, string, string];
}

interface MonthType {
  [key: string]: [string, string, string, string, string, string, string, string, string, string, string, string];
}

export const WEEKDAYS_SHORT: WeekDayType = {
  ko: ['일', '월', '화', '수', '목', '금', '토'],
};
export const MONTHS: MonthType = {
  ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
};

export const WEEKDAYS_LONG: WeekDayType = {
  ko: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
};

export const FIRST_DAY_OF_WEEK = {
  ko: 0,
};
// Translate aria-labels
export const LABELS = {
  ko: {
    nextMonth: '다음달',
    previousMonth: '이전달',
  },
};

export const locale = 'ko';
export const DEFAULT_DAY_PICKER_PROPS: DayPickerProps = {
  locale,
  months: MONTHS[locale],
  weekdaysLong: WEEKDAYS_LONG[locale],
  weekdaysShort: WEEKDAYS_SHORT[locale],
  firstDayOfWeek: FIRST_DAY_OF_WEEK[locale],
  labels: LABELS[locale],
};


const DEFAULT_INPUT_PROPS: Indexable = {
  className: 'input-1',
  style: {
    backgroundImage: `url(${staticUrl('/static/images/icon/icon-calendar.png')})`,
    backgroundSize: '20px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  },
};

interface Props {
  value: Date;
  placeholder?: string;
  inputProps: Indexable;
  dayPickerProps: DayPickerProps;
  format: string | string[];
  onDayChange: (date: Date) => void;
  className?: string;
  fixedText: string;
  disableDayPicker?: boolean;
  additionalStyle?: {
    [key: string]: string;
  }
}

const Div = styled.div`
  position: relative;
  display: inline-block;

  & > span {
    position: absolute;
    top: 8px;
    left: 9px;
    font-size: 12px;
    color: #666;
  }

  & > div > div {
    z-index: 20;
  }
`;

class CustomDayPickerInput extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    format: 'YYYY.M.D',
  };
  public realDayPicker: DayPickerInput;

  public render() {
    const {
      inputProps = {},
      dayPickerProps = {},
      format,
      disableDayPicker,
      fixedText,
      placeholder,
      className,
      additionalStyle,
      ...others
    } = this.props;

    const inputCompStyle = {
      ...DEFAULT_INPUT_PROPS.style,
      ...additionalStyle
    };

    return (
      <Div className={className}>
        <span>{fixedText}</span>
        {disableDayPicker ? (
          <div className="DayPickerInput">
            <Input
              style={inputCompStyle}
              placeholder={placeholder}
              value=""
              disabled
            />
          </div>
        ) : (
          <DayPickerInput
            ref={el => (this.realDayPicker = el)}
            placeholder={placeholder}
            {...others}
            inputProps={{
              ...DEFAULT_INPUT_PROPS,
              style: inputCompStyle,
              readOnly: true,
              inputProps,
            }}
            dayPickerProps={{
              ...DEFAULT_DAY_PICKER_PROPS,
              ...dayPickerProps,
            }}
            formatDate={moment.formatDate}
            format="YYYY.MM.DD"
          />
        )}
      </Div>
    );
  }
}

export default CustomDayPickerInput;
