import {combineEpics} from "redux-observable";
import sessionSaveTokenEpic from './session';
import {fetchFeedEpic} from './feed';

export default combineEpics(
  sessionSaveTokenEpic,
  fetchFeedEpic
);