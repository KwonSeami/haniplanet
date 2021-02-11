type TMonPrefix = 'mon_';
type TTuePrefix = 'tue_';
type TWedPrefix = 'wed_';
type TThuPrefix = 'thu_';
type TFriPrefix = 'fri_';
type TSatPrefix = 'sat_';
type TSunPrefix = 'sun_';

type TMonWord = '월';
type TTueWord = '화';
type TWedWord = '수';
type TThuWord = '목';
type TFriWord = '금';
type TSatWord = '토';
type TSunWord = '일';

type TDatePrefix = TMonPrefix | TTuePrefix | TWedPrefix | TThuPrefix | TFriPrefix | TSatPrefix | TSunPrefix;

type TDateWord = TMonWord | TTueWord | TWedWord | TThuWord | TFriWord | TSatWord | TSunWord;

interface ITimeRange {
    startHour: string;
    startMinute: string;
    endHour: string;
    endMinute: string;
}

type TTimeRange = 'startHour' | 'startMinute' | 'endHour' | 'endMinute';

interface IDateRange {
    mon_start_at: string;
    mon_end_at: string;
    tue_start_at: string;
    tue_end_at: string;
    wed_start_at: string;
    wed_end_at: string;
    thu_start_at: string;
    thu_end_at: string;
    fri_start_at: string;
    fri_end_at: string;
    sat_start_at: string;
    sat_end_at: string;
    sun_start_at: string;
    sun_end_at: string;
}
