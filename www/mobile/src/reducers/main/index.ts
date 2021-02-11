import {createActions, handleActions} from 'redux-actions';
import {ISearchRank} from '../../@types/search';

// Curating contents 기본 타입
// @정윤재: any 타입 수정 필요
export interface ICuratingContent {
  id: number;
  content_type: number;
  story: any;
  user: any;
  text: string;
  tag: any;
  band: any;
  og_domain: any;
  og_link: any;
  avatar: string;
  color: string;
  children?: Omit<ICuratingContent, 'children'>[];
}

// 공지
export interface IPlanetNotice {
  id: HashId;
  title: string;
}

// 배너
export interface IPlanetAdBanner {
  id: number;
  title: string;
  description: string;
  avatar: string;
  mobile_bg_img: string;
  mobile_under_480: string;
  mobile_over_480: string;
  bg_code: string;
  url: string;
  order: number;
}

// 플래닛 픽
export type TPlanetPick = Pick<ICuratingContent, 'text'
  | 'avatar'
  | 'story'
>;

// 플래닛 뉴스
export interface IPlanetNews {
  curatingPk: number;
  newspaper: {
    [key: string]: Pick<ICuratingContent, 'og_domain'>;
  };
  dailyNews: Pick<ICuratingContent, 'og_link'>[];
  weeklyNews: Pick<ICuratingContent, 'og_link'>[];
}

// 한의원 스토리
export interface IPlanetHospitalStory {
  curatingPk: number;
  tags: {
    [key: string]: Pick<ICuratingContent, 'tag'>;
  };
  stories: Pick<ICuratingContent, 'story'>[];
}

// State
export interface IMainState {
  currUserPk: HashId | null;
  notices: IPlanetNotice[];
  searchRanks: ISearchRank[];
  banners: IPlanetAdBanner[];
  hospitalStory: IPlanetHospitalStory;
  planetNews: IPlanetNews;
  planetPick: TPlanetPick[];
}

export type TUpdateMainKey = 'hospitalStory' | 'planetNews';

export const DEFAULT_MAIN_STATE = {
  currUserPk: null,
  notices: [],
  searchRanks: [],
  banners: [],
  hospitalStory: {},
  planetNews: {},
  planetPick: []
};

export const SAVE_MAIN = 'SAVE_MAIN';
export const UPDATE_MAIN = 'UPDATE_MAIN';
export const CLEAR_MAIN = 'CLEAR_MAIN';

export const {saveMain, updateMain, clearMain} = createActions({
  [SAVE_MAIN]: (data) => data,
  [UPDATE_MAIN]: ({key, data}: {
    key: TUpdateMainKey;
    data: Dig<IMainState, TUpdateMainKey>
  }) => ({key, data}),
  [CLEAR_MAIN]: () => DEFAULT_MAIN_STATE
});

const main = handleActions(
  {
    [saveMain.toString()]: (state, {payload}) => ({
      ...state,
      ...payload
    }),
    [updateMain.toString()]: (state, {payload: {key, data}}) => ({
      ...state,
      [key]: {
        ...state[key],
        ...data
      }
    }),
    [clearMain.toString()]: () => DEFAULT_MAIN_STATE
  },
  DEFAULT_MAIN_STATE
);

export default main;
