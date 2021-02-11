import theme, {
  saveTheme,
  DEFAULT_THEME_STATE,
  SAVE_THEME
} from '../theme';
import {makeMockStore} from '../__mocks__/store';

describe('reducers/theme.ts', () => {
  describe('theme action creator 테스트', () => {
    it('saveTheme 액션 생성 함수는 액션을 의도한대로 생성해야 한다.', () => {
      const store = makeMockStore(DEFAULT_THEME_STATE);

      store.dispatch(saveTheme('title'));
      expect(store.getActions()).toEqual([
        {
          type: SAVE_THEME,
          payload: 'title'
        }
      ]);

      store.clearActions();

      store.dispatch(saveTheme('preview'));
      expect(store.getActions()).toEqual([
        {
          type: SAVE_THEME,
          payload: 'preview'
        }
      ]);
    });
  });

  describe('theme reducer 테스트', () => {
    it('action에 빈 객체를 넘겨 줄 경우 initialState를 반환해야 한다.', () => {
      expect(
        theme(DEFAULT_THEME_STATE, {} as ReduxActions.Action<any>)
      ).toEqual(DEFAULT_THEME_STATE);
    });
  
    it(`action에 saveTheme('title')을 넘겨줄 경우 type이 'title'로 변경된 state를 반환해야 한다.`, () => {
      expect(
        theme(DEFAULT_THEME_STATE, saveTheme('title'))
      ).toEqual({
        type: 'title'
      });
    });
  });
});
