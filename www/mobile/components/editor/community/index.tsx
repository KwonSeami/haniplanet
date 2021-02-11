import * as React from 'react';
import styled from 'styled-components';
import CommunityEditorTitle from '../title/CommunityEditorTitle';
import isEmpty from 'lodash/isEmpty';
import {INFO_UPLOAD_WIKIS} from '../../../src/gqls/wiki';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import ExploreApi from '../../../src/apis/ExploreApi';
import {HashId} from '@hanii/planet-types';
import {useApolloClient} from '@apollo/react-hooks';
import {dispatch as editorDispatch, GlobalStateProvider} from '../editorState';
import EditorAnonAlarm from '../EditorAnonAlarm';
import EditorBody from '../body/EditorBody';
import EditorWrapper from '../EditorWrapper';
import EditorAnonAlertPopup from '../EditorAnonAlertPopup';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $WHITE} from '../../../styles/variables.types';
import {TUserExposeType} from '../../../src/@types/user';

const GlobalWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #f6f7f9;
  overflow: auto;
  z-index: 1;
  
  div.menu-notice {
    width: 100%;
    height: 34px;
    margin-bottom: 26px;
    padding: 0 15px;
    line-height: 34px;
    ${fontStyleMixin({
      size: 12,
      color: $FONT_COLOR
    })};
    background: #eee;
    box-sizing: border-box;
    
    @media screen and (max-width: 680px) {
      margin: 0;
      border-bottom: 1px solid #eee;
      background: #f6f7f9;
    }
  }
  
  .editor-wrapper {
    margin-bottom: 125px;
    
    @media screen and (max-width: 680px) {
      margin-bottom: 56px;
    }
  }
  
  .button-group {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 56px;
    padding: 7px 4px;
    border-top: 1px solid #ddd;
    background: #eee;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    z-index: 2;
    
    li {
      width: calc(50% - 1px);
      height: 42px;
      padding: 0;

      & ~ li {
        margin-left: 2px;
      }
      
      button {
        width: 100%;
        height: 100%;
        ${fontStyleMixin({
          size: 15,
          color: $WHITE
        })};
        border-radius: 0;
        border: 1px solid #eee;
        background: #499aff;
        cursor: pointer;
        
        &:not(:last-child) {
          margin-right: 2px;
        }
      }
       
      &:first-child button {
        background: #333;
      }
    }
  }
  
  div.title-or-Range {
    margin: 0;
    padding: 0;
    
    div.editor-title {
      padding: 13px 15px 14px;
      
      div.user-select {
        padding: 0;
      }
    }
  }
`;

interface Props {
  defaultData?: {
    title: string;
    body: string;
    tags: ITag[];
    wikis: any;
    defaultAttachList: {
      file: any;
      image: any;
    };
    menu_tag_id: string;
    open_range: 'user_all' | 'only_me';
    user_expose_type: TUserExposeType;
  };
  storyPK?: HashId;
}

const setDictList = value => editorDispatch({
  type: 'SAVE_OBJ_FIELD',
  field: 'additionalContent',
  name: 'dictList',
  value
});

const HaniCommunityEditor: React.FC<Props> = (({
  defaultData,
  storyPK
}) => {
  const client = useApolloClient();

  // State
  const [editorLoaded, setEditorLoaded] = React.useState(!storyPK);
  const [defaultEditorBody, setDefaultEditorBody] = React.useState(null);
  const [defaultAttachList, setDefaultAttachList] = React.useState({file: [], image: []});

  // API
  const exploreApi = useCallAccessFunc(access => new ExploreApi(access));

  const writeStoryApi = !!storyPK
    ? formData => exploreApi.updateStory(storyPK, formData)
    : formData => exploreApi.createStory(formData);

  // defaultData가 있다면 스토리 수정으로 간주
  React.useEffect(() => {
    if (!!defaultData) {
      const {
        title,
        body,
        tags,
        wikis,
        defaultAttachList,
        menu_tag_id,
        open_range,
        user_expose_type
      } = defaultData;

      editorDispatch({
        type: 'SAVE_OBJ',
        value: {
          title,
          menu_tag_id,
          user_expose_type,
          open_range,
          additionalContent: {
            dictList: [],
            tags: tags || []
          }
        }
      });

      if (!isEmpty(wikis)) {
        client.query({query: INFO_UPLOAD_WIKIS, variables: {codes: wikis}})
          .then(({data: {wikis: {nodes}}}) => {
            setDictList(nodes);
          });
      }

      setDefaultEditorBody(JSON.parse(body));
      setDefaultAttachList(defaultAttachList);

      setEditorLoaded(true);
    }
  }, [defaultData]);

  return (
    <GlobalWrapper>
      <GlobalStateProvider>
        {editorLoaded && (
          <EditorWrapper className="editor-wrapper">
            <CommunityEditorTitle
              storyPK={storyPK}
            />
            <EditorAnonAlarm />
            <EditorBody
              defaultAttachList={defaultAttachList}
              defaultEditorBody={defaultEditorBody}
              storyPK={storyPK}
              writeStoryApi={writeStoryApi}
              isCommunity={true}
            />
            <EditorAnonAlertPopup/>
          </EditorWrapper>
        )}
      </GlobalStateProvider>
    </GlobalWrapper>
  );
});

export default HaniCommunityEditor;
