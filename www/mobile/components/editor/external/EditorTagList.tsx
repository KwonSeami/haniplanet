import * as React from 'react';
import xorBy from 'lodash/xorBy';
import styled from 'styled-components';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import TagList from '../../UI/tag/TagList';
import TagInput from '../../inputs/Input/TagInput';
import {$BORDER_COLOR} from '../../../styles/variables.types';
import StoryApi from '../../../src/apis/StoryApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';

const StyledTagInput = styled(TagInput)`
  width: auto;
  height: 40px;
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;

  input {
    padding: 0 12px;
    
    &:focus {
      background-color: #f9f9f9;
    }
  }

  .clear-button {
    right: 18px;
    position: fixed
  }
`;

interface Props {
  storyPK?: string;
  indelibleTag?: any;
  xorByExternalData: (key: string, value: any, iteratee?: string) => void;
}

const EditorTagList: React.FC<Props> = ({storyPK, indelibleTag, xorByExternalData}) => {
  const {watch, getValues, setValue} = useFormContext();
  const {tags} = watch('externalData');

  const storyApi: StoryApi = useCallAccessFunc(access => new StoryApi(access));

  const onSelectTag = React.useCallback(tag => {
    xorByExternalData('tags', [tag]);
  }, []);

  const onClickTagItem = React.useCallback((id, {m2m_id}) => {
    if (indelibleTag?.id === id) {
      alert('삭제할 수 없는 태그입니다.');
    } else if (!!m2m_id) {
      confirm('삭제시 다시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?');
      storyApi.deleteAttach(storyPK, 'tag', m2m_id)
        .then(({status}) => {
          if (status === 200) {
            const {externalData} = getValues();
            setValue('externalData', {
              ...externalData,
              tags: xorBy(externalData.tags, [{m2m_id}], 'm2m_id'),
            });
          }
        });
    } else {
      xorByExternalData('tags', [{id}]);
    }
  }, [xorByExternalData]);

  return (
    <div>
      <p>
        <span>#</span>
        태그를 입력하면, 더 많은 사람들이 내 글을 볼 수 있습니다.
      </p>
      <StyledTagInput onSelect={onSelectTag} />
      <TagList
        tags={tags}
        onClick={onClickTagItem}
      />
    </div>
  )
};

export default React.memo(EditorTagList);
