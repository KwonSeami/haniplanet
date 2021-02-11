import * as React from 'react';
import xorBy from 'lodash/xorBy';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import DictCard from '../../dict/DictCard';
import FileList from '../FileList';
import {DictUl} from '../../story/common2';
import {TEditorAttachListState} from '../EditorPopup';
import cn from 'classnames';
import {fetchExploreTag} from '../../../src/reducers/orm/tag/thunks';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {tagListSelector} from '../../../src/reducers/orm/tag/selector';
import {RootState} from '../../../src/reducers';
import styled from 'styled-components';
import TagInput from '../../inputs/Input/TagInput';
import {$BORDER_COLOR} from '../../../styles/variables.types';
import TagList from '../../UI/tag/TagList';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import StoryApi from '../../../src/apis/StoryApi';
import {UrlCard} from '../../story/embeds';
import {embedUrlCard} from '../../../src/lib/editor/utils';

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
  defaultTag?: any;
  isCommunity?: boolean;
  attachListState: TEditorAttachListState;
}

const EditorAdditionalContent = React.memo<Props>(({storyPK, defaultTag, isCommunity = false, attachListState}) => {
  const [attachList, setAttachList] = attachListState;
  const {file} = attachList;

  const methods = useFormContext();
  const {getValues, setValue, watch} = methods;
  const additionalContent = watch('additionalContent');
  const {dictList, url_card, tags} = additionalContent;

  // API
  const storyApi = useCallAccessFunc(access => new StoryApi(access));

  // Redux
  const dispatch = useDispatch();
  const {exploreTags, access} = useSelector(
    ({orm}: RootState) => ({exploreTags: tagListSelector('explore')(orm)[0], access}),
    shallowEqual,
  );

  const deleteUrlCard = React.useCallback(() => {
    const {getValues, setValue} = methods;
    const {additionalContent} = getValues();

    setValue('additionalContent', {
      ...additionalContent,
      url_card: {},
    });
    embedUrlCard(methods);
  }, [methods]);

  React.useEffect(() => {
    dispatch(fetchExploreTag());
  }, []);

  return (
    <div className="editor-bot-wrapper">
      {!!(url_card && url_card.id) && // EditorBody useEffect 내에서 URL ID가 등록되었을 경우 True
        <UrlCard
          url_card={url_card}
          deleteUrlCard={deleteUrlCard}
        />
      }
      <DictUl>
        {dictList.map(({type, ...item}) => (
          <li key={item.id}>
            <DictCard
              data={item}
              type={type}
              onDelete={(id) => {
                const {additionalContent} = getValues();

                setValue('additionalContent', {
                  ...additionalContent,
                  dictList: xorBy(additionalContent.dictList, [{code: id}], 'id'),
                });
              }}
            />
          </li>
        ))}
      </DictUl>
      <FileList
        fileList={file}
        deleteFile={(uid, {id}) => {
          if (!!id) {
            confirm('삭제시 다시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')
              && storyApi.deleteAttach(storyPK, 'file', id)
                .then(({status}) => {
                  if (status === 200) {
                    setAttachList(curr => ({
                      ...curr,
                      file: curr.file.filter(item => item.id !== id) as any
                    }));
                  }
                });
          } else {
            setAttachList(curr => ({
              ...curr,
              file: curr.file.filter(({uid: currUid}) => currUid !== uid) as any,
            }));
          }
        }}
      />
      {!isCommunity && (<ul className="community-Menu">
        {exploreTags.map(item => {
          const {id, name} = item;

          return (
            <li
              key={id}
              className={cn({on: !!tags.some(({id: _id}) => _id === id)})}
              onClick={() => {
                const {additionalContent} = getValues();

                setValue('additionalContent', {
                  ...additionalContent,
                  tags: xorBy(additionalContent.tags, [item], 'id'),
                });
              }}
            >
              {name}
            </li>
          );
        })}
      </ul>)}
      <p>
        <span>#</span>
        태그를 입력하면, 더 많은 사람들이 내 글을 볼 수 있습니다.
      </p>
      <StyledTagInput onSelect={tag => {
        const {additionalContent} = getValues();

        setValue('additionalContent', {
          ...additionalContent,
          tags: xorBy(additionalContent.tags, [tag], 'id'),
        });
      }} />
      <TagList
        tags={tags}
        onClick={(id, {m2m_id}) => {
          if ((defaultTag || {} as any).id === id) {
            alert('삭제할 수 없는 태그입니다.');
            return null;
          }
          if (!!m2m_id) {
            confirm('삭제시 다시 되돌릴 수 없습니다. 정말 삭제하시겠습니까?')
              && storyApi.deleteAttach(storyPK, 'tag', m2m_id)
                .then(({status}) => {
                  if (status === 200) {
                    setValue('additionalContent', {
                      ...additionalContent,
                      tags: xorBy(additionalContent.tags, [{m2m_id}], 'm2m_id'),
                    });
                  }
                });
          } else {
            // 태그 리스트에서 제거하기 위해 {id}를 넘겨줌
            setValue('additionalContent', {
              ...additionalContent,
              tags: xorBy(additionalContent.tags, [{id}], 'id'),
            });
          }
        }}
      />
    </div>
  );
});

export default EditorAdditionalContent;
