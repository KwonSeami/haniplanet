import {makeMockStore} from '../__mocks__/store';
import tool, {DEFAULT_TOOL_STATE, saveTool, SAVE_TOOL, IToolPayload} from '../tool';
import {TOOL_MOCK_DATA} from '../__mocks__/tool';

describe('reducers/tool.ts', () => {
  const {data: {result: toolData}} = TOOL_MOCK_DATA;

  describe('tool action creator 테스트', () => {
    it('saveTool 액션 생성 함수는 액션을 의도한대로 생성해야 한다.', () => {
      const store = makeMockStore(DEFAULT_TOOL_STATE);
      const expectedActions = [
        {
          type: SAVE_TOOL,
          payload: {
            toolData
          }
        }
      ];

      store.dispatch(saveTool({
        toolData
      }));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('tool reducer 테스트', () => {
    it('action에 빈 객체를 넘겨 줄 경우 initialState를 반환해야 한다.', () => {
      expect(
        tool(DEFAULT_TOOL_STATE, {} as ReduxActions.Action<any>)
      ).toEqual(DEFAULT_TOOL_STATE);
    });

    it('action에 saveTool({toolData: "mocking한 toolData"})을 넘겨줄 경우, IToolPayload와 동일한 타입의 state를 반환해야 한다.', () => {
      const changedToolData = toolData.map(({id, name}) => ({
        label: name,
        value: id
      }));
      const expectedState: IToolPayload = {
        toolData: changedToolData
      };

      expect(
        tool(DEFAULT_TOOL_STATE, saveTool({
          toolData
        }))
      ).toEqual(expectedState);
    });
  });
});
