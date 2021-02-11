import {combineReducers} from 'redux';
import {IStoryORMState} from './story';
import index from './feed';
import system from './system';
import popup, {IPopupPayload} from './popup';
import skill, {ISkillPayload} from './skill';
import tool, {IToolPayload} from './tool';
import ormReducer from './orm';
import region from './region';
import navReducer from './nav';
import question from './question';
import theme from './theme';
import hospital from './hospital';
import profile from './profile';
import medicalField, {IMedicalFieldPayload} from './medicalField';
import community, {ICommunityPayload} from './community';
import categories, {ICategoriesPayload} from './categories';
import main, {IMainState} from './main';
import scroll, {IScrollPayload} from './scroll';

const rootReducer = combineReducers({
  feed: index,
  orm: ormReducer,
  system,
  popup,
  skill,
  tool,
  region,
  navs: navReducer,
  question,
  theme,
  hospital,
  profile,
  medicalField,
  community,
  categories,
  main,
  scroll
});

export interface RootState {
  feed: any;
  story: IStoryORMState;
  system: ISystemState;
  popup: IPopupPayload[];
  skill: ISkillPayload;
  tool: IToolPayload;
  orm: any;
  region: any;
  question: any;
  theme: any;
  hospital: any;
  profile: any;
  medicalField: IMedicalFieldPayload[];
  community: ICommunityPayload;
  categories: ICategoriesPayload;
  main: IMainState;
  scroll: IScrollPayload;
}

export default rootReducer;
