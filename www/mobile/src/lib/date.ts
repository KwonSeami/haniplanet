import moment from 'moment';
import {DAY, HOUR, MINUTE, SECOND, WEEK} from '../constants/times';

export const toDateFormat = (date: string | number | Date | moment.Moment, format) => moment(date).format(format);

export const timeOver = (date: number, diff: number, unit: number = 1) =>
  Math.floor((new Date().getTime() - date) / unit) * unit > diff;

export const timeLess = (date: number, diff: number, unit: number = 1) =>
  Math.floor((new Date().getTime() - date) / unit) * unit < diff;

export const timeSince = (dateStr: string, customFormat?: string) => {
  const date = new Date(dateStr);
  const dateTime = date.getTime();
  const since = new Date().getTime() - dateTime;

  if (since < MINUTE) {
    return '방금 전';
  }
  if (since < HOUR) {
    return `${Math.floor(since / MINUTE)}분 전`;
  } else if (since < DAY) {
    return `${Math.floor(since / HOUR)}시간 전`;
  } else if (since < WEEK) {
    return `${Math.floor(since / DAY)}일 전`;
  } else {
    return moment(date).format(customFormat || 'YY.MM.DD hh:mm');
  }
};

export const toFormattedDate = (dateObj: Date, isFullYear = true, separator = '') => {
  return moment(dateObj).format(
    separator ? `YYYY${separator}MM${separator}DD` : `${isFullYear && 'YYYY년'} MM월 DD일`,
  );
};

export function dateRange(_a: string | Date | moment.Moment, _b: string | Date | moment.Moment, format: string = 'MM.DD') {
  const a = moment(_a).format(format),
    b = moment(_b).format(format);

  return a === b ? a : `${a} ~ ${b}`;
}

export type TPeriodPick = 'daily' | 'weekly' | 'monthly';
export function periodRange(standard: TPeriodPick) {
  const today = moment();

  switch(standard) {
    case 'daily':
      return toDateFormat(today, 'YY.MM.DD');
    case 'weekly':
      return dateRange(moment().subtract(7, 'days'), today, 'YY.MM.DD');
    case 'monthly':
      return toDateFormat(today, 'YY.MM');
  }
}

export const dDay = (date: string, hasD_ = false) => {
  const endAtDate = new Date(date);
  endAtDate.setHours(23);
  endAtDate.setMinutes(59);
  const endAt = endAtDate.getTime();
  const now = new Date().getTime();
  const endAtDay = Math.floor(endAt / DAY) * DAY;
  const nowDay = Math.floor(now / DAY) * DAY;
  const sinceDay = endAtDay - nowDay;

  let leftTime, leftUnit;
  if (!sinceDay) {
    const since = endAt - now;
    if (since < HOUR) {
      leftTime = Math.floor(since / MINUTE);
      leftUnit = '분';
    } else if (since < DAY) {
      leftTime = Math.floor(since / HOUR);
      leftUnit = '시간';
    }
  } else {
    leftTime = Math.floor(sinceDay / DAY);
    if (!hasD_) {
      leftUnit = '일';
    }
  }

  return [((hasD_ ? (sinceDay ? 'D -' : '') : '') + leftTime).replace('--', '+'), leftUnit, sinceDay ? '' : '남음'];
};

export function isSameDate(a: Date, b: Date) {
  return Math.floor(a.getTime() / DAY) === Math.floor(b.getTime() / DAY);
}

export const dateTimeRange = (
  _startAt: Date,
  _endAt?: Date,
  dateFormat: string = 'YYYY.MM.DD',
  timeFormat: string = 'HH:mm',
) => {
  const startAt = moment(_startAt);
  const endAt = moment(_endAt);
  let dateStr = '';

  if (endAt) {
    if (isSameDate(_startAt, _endAt)) {
      dateStr = `${startAt.format(dateFormat)} ${startAt.format(timeFormat)} ~ ${endAt.format(timeFormat)}`;
    } else {
      dateStr = `${startAt.format(dateFormat)} ${startAt.format(timeFormat)} ~ ${endAt.format(dateFormat)} ${endAt.format(
        timeFormat,
      )}`;
    }
  } else {
    dateStr = `${startAt.format(dateFormat)} ${startAt.format(timeFormat)}`;
  }
  if(dateStr.match(/00:00/g)){
    dateStr = dateStr.replace(/00:00/g, '');
  }

  return dateStr;
};

export const convertToEqualDate = (year: string, month: string) => {
  if (parseInt(month, 10) < 10) {
    month = '0' + parseInt(month, 10);
  }

  return year + '-' + month;
};

export const toResponsiveFormattedDateTime = (dateObj: Date) => {
  const dateStr = toFormattedDate(dateObj, true, '.');
  return [dateStr.substring(0, 2), dateStr.substring(2)];
};

export const convertToShowDateFormat = (date: any) => {
  const sortDatePicker = Object.keys(date).reduce((prev, curr) => {
    const [day, dayType] = curr.split('_');
    const [hour, minute] = date[curr]
      ? date[curr].split(':')
      : ['', ''];

    return {
      ...prev,
      [day]: {
        ...prev[day],
        [`${dayType}Hour`]: hour,
        [`${dayType}Minute`]: minute
      }
    };
  }, {});

  return Object.keys(sortDatePicker).reduce((prev, curr) => {
    const {listDayTime = {}}: any = prev;
    const {selectedDaysPrefix = {}}: any = prev;

    return {
      ...prev,
      listDayTime: {
        ...listDayTime,
        [curr]: sortDatePicker[curr]
      },
      selectedDaysPrefix: {
        ...selectedDaysPrefix,
        [curr]: curr
      }
    };
  }, {});
};

export const toHHMMSS = (secs, format = []) => {
  const sec_num = parseInt(secs, 10);
  const hours   = Math.floor(sec_num / 3600);
  const minutes = Math.floor(sec_num / 60) % 60;
  const seconds = sec_num % 60;
  const join = !!format[0] ? ' ' : ':';

  return [hours, minutes, seconds]
    .map((v, i) => (v < 10 ? '0' + v : v) + (format[i] || ''))
    .filter((v, i) => v.substring(0, 2) !== '00' || (!format[0] && i > 0))
    .join(join);
};


export const toFormatSec = (sec) => {
  const sec_num = parseInt(sec, 10);
  let hours: string | number = Math.floor(sec_num / 3600);
  let minutes: string | number = Math.floor((sec_num - (hours * 3600)) / 60);

  if (!hours) {
    hours = '';
  } else {
    hours = hours + '시간';
  }

  return hours + minutes + '분';
};