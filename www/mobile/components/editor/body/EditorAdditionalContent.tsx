import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import FileList from '../FileList';
import DictCard from '../../dict/DictCard';
import TagList from '../../UI/tag/TagList';
import TagInput from '../../inputs/Input/TagInput';
import StoryApi from '../../../src/apis/StoryApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {dispatch as editorDispatch} from '../editorState';
import {fetchExploreTag} from '../../../src/reducers/orm/tag/thunks';
import {tagListSelector} from '../../../src/reducers/orm/tag/selector';
import {$BORDER_COLOR} from '../../../styles/variables.types';
import {RootState} from '../../../src/reducers';

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
  }
`;

interface Props {
  storyPK: HashId;
  attachListState: any;
  additionalContent: any;
  defaultAttachList?: any;
  isCommunity?: boolean;
}

const toggleTag = tag => editorDispatch({
  type: 'TOGGLE_ADDITIONAL_CONTENT',
  field: 'tags',
  value: [tag],
  id: 'id',
});

const toggleDictItem = dict => editorDispatch({
  type: 'TOGGLE_ADDITIONAL_CONTENT',
  field: 'dictList',
  value: [dict],
  id: 'id',
});

const EditorAdditionalContent = (props: Props) => {
  const {storyPK, additionalContent, attachListState, defaultAttachList, isCommunity} = props;
  const {dictList, tags} = additionalContent;
  const {attachList: {file}, setAttachList} = attachListState;
  const {file: defaultFile} = defaultAttachList;

  const {query: {defaultTagId}} = useRouter();

  // Redux
  const dispatch = useDispatch();
  const exploreTags = useSelector(
    ({orm}: RootState) => tagListSelector('explore')(orm)[0],
    shallowEqual,
  );

  const storyApi: StoryApi = useCallAccessFunc(access => new StoryApi(access));

  React.useEffect(() => {
    if (!!defaultFile) {
      setAttachList(curr => ({
        ...curr,
        file: [...(defaultFile || []), ...file],
      }));
    }
  }, [defaultFile]);

  React.useEffect(() => {
    dispatch(fetchExploreTag());
  }, []);

  return (
    <div className="editor-bot-wrapper">
      <ul className="dict-wrap">
        {dictList.map(({type, ...item}) => (
          <li key={item.id}>
            <DictCard
              data={item}
              type={type}
              onDelete={(id, {type, m2m_id}) => {
                if (!!m2m_id) {
                  const attachType = {medi: 'medicine', herb: 'herb'};

                  confirm('삭제시 다시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')
                  && storyApi.deleteAttach(storyPK, attachType[type], m2m_id)
                    .then(({status}) => {
                      (Math.floor(status / 100) !== 4) && toggleDictItem({code: id});
                    });
                } else {
                  // 사전 리스트에서 제거하기 위해 {id}를 넘겨줌
                  toggleDictItem({code: id});
                }
              }}
            />
          </li>
        ))}
      </ul>
      <FileList
        fileList={file}
        deleteFile={(uid, {id}) => {
          if (!!id) {
            confirm('삭제시 다시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')
            && storyApi.deleteAttach(storyPK, 'file', id)
              .then(({status}) => {
                (Math.floor(status / 100) !== 4)
                && setAttachList(curr => ({
                  ...curr,
                  file: curr.file.filter(item => item.id !== id)
                }))
              });
          } else {
            setAttachList(curr => ({
              ...curr,
              file: curr.file.filter(({uid: currUid}) => currUid !== uid),
            }));
          }
        }}
      />
      {!isCommunity && 
        <div className="community-Menu">
          <ul>
            {exploreTags.map(item => {
              const {id, name} = item;
  
              return (
                <li
                  key={id}
                  className={cn({on: !!tags.some(({id: _id}) => _id === id)})}
                  onClick={() => toggleTag(item)}
                >
                  {name}
                </li>
              );
            })}
          </ul>
        </div>
      }
      <p>
        <span>#</span>
        태그를 입력하면, 더 많은 사람들이 내 글을 볼 수 있습니다.
      </p>
      {/* TODO: 온라인 상담일시 뜨지 않아야 합니다. (StyledTagInput) */}
      <StyledTagInput onSelect={tag => toggleTag(tag)}/>
      <TagList
        tags={tags}
        onClick={(id, {m2m_id}) => {
          if (id === defaultTagId) {
            alert('삭제할 수 없는 태그입니다.');
            return null;
          }
          if (!!m2m_id) {
            confirm('삭제시 다시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')
            && storyApi.deleteAttach(storyPK, 'tag', m2m_id)
              .then(({status}) => {
                (Math.floor(status / 100) !== 4) && toggleTag({id});
              });
          } else {
            // 태그 리스트에서 제거하기 위해 {id}를 넘겨줌
            toggleTag({id});
          }
        }}
      />
    </div>
  );
};

export default React.memo(EditorAdditionalContent);
