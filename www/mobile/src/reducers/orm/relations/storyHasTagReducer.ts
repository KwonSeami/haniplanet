import {handleActions} from 'redux-actions';
import {DEFAULT_ORM_STATE} from '../assets';
import {bulkSaveStory, saveStory} from '../story/storyReducer';
import {SAVE_FEED} from '../../feed';

const reduceSaveStory = (
  state,
  {payload: {id: storyId, tags}},
) => {
  const tagIds = [];
  const sortByTag = {...state.sortByTag};
  tags.forEach(tag => {
    const {id: tagId} = tag;
    tagIds.push(tagId);

    const storyIds = sortByTag[tagId];
    if (storyIds) {
      if (storyIds.includes(storyId)) { // 위 조건과 합치면 안됨
        sortByTag[tagId] = [...storyIds, storyId];
      }
    } else {
      sortByTag[tagId] = [storyId];
    }
  });

  return {
    ...state,
    sortByStory: {
      ...state.sortByStory,
      [storyId]: tagIds,
    },
    sortByTag,
  };
};

const reduceBulkSaveStory = (
  state,
  {
    payload: {
      results: models,
    },
  },
) => {
  if (models) {
    const sortByStory = {...state.sortByStory};
    const sortByTag = {...state.sortByTag};

    models.forEach(({id: storyId, tags}) => {
      const tagIds = [
        ...(sortByStory[storyId] || []), // 기존 배열이 있다면 그 데이터로 초기화
      ];

      (tags || []).forEach(tag => {
        const {id: tagId} = tag;

        // 중복되지 않게 스토리의 태그 아이디 정의
        if (!tagIds.includes(tagId)) {
          tagIds.push(tagId);
        }

        // 중복되지 않게 태그의 스토리 아이디 정의
        const storyIds = sortByTag[tagId];
        if (storyIds) {
          if (storyIds.includes(storyId)) { // 위 조건과 합치면 안됨
            sortByTag[tagId] = [...storyIds, storyId];
          }
        } else {
          sortByTag[tagId] = [storyId];
        }
      });
      sortByStory[storyId] = tagIds;
    });
    return {
      ...state,
      sortByStory,
      sortByTag,
    };
  }

  return state;
};

const storyHasTagReducer = handleActions({
  [saveStory.toString()]: reduceSaveStory,
  [bulkSaveStory.toString()]: reduceBulkSaveStory,
  [SAVE_FEED]: reduceBulkSaveStory,
}, DEFAULT_ORM_STATE.storyHasTag);

export default storyHasTagReducer;
