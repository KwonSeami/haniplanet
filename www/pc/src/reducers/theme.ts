import {createActions, handleActions, Action} from 'redux-actions';

export type TStoryThemeType = 'title' | 'preview';

interface IThemeState {
  type: TStoryThemeType;
}

export const DEFAULT_THEME_STATE = {
  type: 'title'
};

export const SAVE_THEME = 'SAVE_THEME';

export const {saveTheme} = createActions({
  [SAVE_THEME]: (type: TStoryThemeType) => type
});

const theme = handleActions(
  {
    [saveTheme.toString()]: (state: IThemeState, {payload}: Action<TStoryThemeType>) => ({
      ...state,
      type: payload
    })
  },
  DEFAULT_THEME_STATE
);

export default theme;
