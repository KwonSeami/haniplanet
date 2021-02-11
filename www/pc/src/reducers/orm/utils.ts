import {createActions} from 'redux-actions';
import {cloneDeep, toUpper} from 'lodash';

export const updateModel = (state, {payload: {id, payload}}) => {
  const curr = state.itemsById[id];

  return {
    ...state,
    itemsById: {
      ...state.itemsById,
      [id]: typeof payload === 'function'
        ? payload(curr)
        : {
          ...curr,
          ...payload,
        },
    },
  };
};

export const saveModel = (state, {payload}) => {
  return {
    ...state,
    itemsById: {
      ...state.itemsById,
      [payload.id]: {
        ...(state.itemsById[payload.id] || {}),
        ...payload
      },
    },
  };
};

export const deleteModel = (state, {payload: {id}}) => {
  const cloned = cloneDeep(state);
  delete cloned.itemsById[id];
  cloned.items = cloned.items.filter(item => item !== id);

  return cloned;
};

export const bulkSaveModel = (state, {payload: {
  results,
}}) => {
  if (results) {
    const cloned = cloneDeep(state);
    const {itemsById, items} = cloned;

    results.forEach((model) => {
      itemsById[model.id] = {
        ...(itemsById[model.id] || {}),
        ...model,
      };
      items.push(model.id);
    });

  return cloned;
  }

  return state;
};
 
export const bulkDeleteModel = (state, {payload: ids}) => {
  const cloned = cloneDeep(state);
  const {itemsById} = cloned;

  cloned.items = cloned.items.filter(item => !ids.includes(item));
  ids.forEach(id => {
    delete itemsById[id];
  });
  return cloned;
};

export const defaultActions = (modelName: string) => {
  const UPPERED_MODEL =  toUpper(modelName);

  const UPDATE_MODEL = `UPDATE_${UPPERED_MODEL}`;
  const SAVE_MODEL = `SAVE_${UPPERED_MODEL}`;
  const BULK_SAVE_MODEL = `BULK_SAVE_${UPPERED_MODEL}`;
  const DEL_MODEL = `DEL_${UPPERED_MODEL}`;
  const BULK_DEL_MODEL = `BULK_DEL_${UPPERED_MODEL}`;

  return createActions({
    [UPDATE_MODEL]: (id, payload) => ({id, payload}),
    [SAVE_MODEL]: (model: any) => (model),
    [DEL_MODEL]: (id) => ({id}),
    [BULK_SAVE_MODEL]: (results: any[], kwargs = {}) => ({results, kwargs}),
    [BULK_DEL_MODEL]: (ids) => (ids),
  });
};
