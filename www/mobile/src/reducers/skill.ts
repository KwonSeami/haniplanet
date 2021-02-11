import {
  Action,
  handleActions,
  createActions
} from 'redux-actions';

export interface ISkillPayload {
  field: Array<{
    id: number;
    name: string;
  }>;
  detail: Array<{
    id: number;
    name: string;
    field: number;
  }>;
}

export const SAVE_SKILL = 'SAVE_SKILL';
export const {
  saveSkill
} = createActions({
  [SAVE_SKILL]: (payload) => payload
});

const skill = handleActions(
  {
    [saveSkill.toString()]: (state, {payload: {field, detail}}: Action<ISkillPayload>) => {
      const filteredField = [];
      const filteredDetail = {};

      field.forEach(({id, name}) => {
        filteredField.push({
          label: name,
          value: id
        });
  
        filteredDetail[id] = detail
          .filter(({field}) => id === field)
          .map(({id: _id, name}) => ({
            label: name,
            value: _id
          }));
      });

      return {
        ...state,
        field: filteredField,
        detail: filteredDetail
      };
    }
  },
  {}
);

export default skill;