import {handleActions, createActions} from 'redux-actions';
import BandApi from '../apis/BandApi';

export const SAVE_QUESTION = 'SAVE_QUESTION';
export const UPDATE_QUESTION = 'UPDATE_QUESTION';

export const {saveQuestion, updateQuestion} = createActions({
  [SAVE_QUESTION]: ({slug, question}) => ({slug, question}),
  [UPDATE_QUESTION]: ({slug, payload}) => ({slug, payload})
});

export const fetchQuestionThunk = (slug) =>
  (dispatch, getState) => {
    const {question, system: {session: {access}}} = getState();
    const api = new BandApi(access);

    if (question[slug] === undefined) {
      api.question(slug)
        .then(({data: {result}}) => {
          !!result && dispatch(saveQuestion({slug, question: result}));
        });
    }
  };

const question = handleActions(
  {
    [saveQuestion.toString()]: (state, {payload: {slug, question}}) => ({
      ...state,
      [slug]: question.reduce((prev, curr) => {
        prev[curr.id] = curr;
        return prev;
      }, {})
    }),
    [updateQuestion.toString()]: (state, {payload: {slug, payload}}) => {
      const curr = state[slug] || {};

      return {
        ...state,
        [slug]: {
          ...(typeof payload === 'function'
            ? payload(curr)
            : {
              ...curr,
              ...payload
            }
          )
        }
      };
    }
  },
  {}
);

export default question;
