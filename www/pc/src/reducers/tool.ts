import {
  Action,
  handleActions,
  createActions
} from 'redux-actions';

export const DEFAULT_TOOL_STATE = {};

export interface IToolPayload {
  toolData: Array<{
    label: string;
    value: number;
  }>;
}

export const SAVE_TOOL = 'SAVE_TOOL';
export const {
  saveTool
} = createActions({
  [SAVE_TOOL]: (payload) => payload
});

const tool = handleActions(
  {
    [saveTool.toString()]: (state, {payload: {toolData}}: Action<IToolPayload>) => {
      const filteredTool = toolData.map(({id, name}) => ({
        label: name,
        value: id
      }));

      return {
        ...state,
        toolData: filteredTool
      };
    }
  },
  DEFAULT_TOOL_STATE
);

export default tool;