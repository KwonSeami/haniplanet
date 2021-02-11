import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import {useApolloClient} from '@apollo/react-hooks';
import styled from 'styled-components';
import EditorBody from './body/EditorBody';
import EditorWrapper from './EditorWrapper';
import EditorTitle from './title/EditorTitle';
import EditorAnonAlarm from './EditorAnonAlarm';
import StoryApi from '../../src/apis/StoryApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {GlobalStateProvider, dispatch as editorDispatch} from './editorState';
import {INFO_UPLOAD_WIKIS} from '../../src/gqls/wiki';
import {getOpenRangeOption} from "../../src/lib/editor";


const EditorAllWrapper = styled.section`
  position: relative;
  background-color: #f6f7f9;
  overflow: auto;
`;

interface Props {
  isCounsel?: boolean;
  openRangeList: any;
  writeStoryApi: any;
  defaultUserType: any;
  storyPK?: HashId;
  band?: any;
}

const setDictList = (value) => editorDispatch({
  type: 'SAVE_ADDITIONAL_CONTENT',
  field: 'dictList',
  value,
});

const HaniStoryEditor = React.memo<Props>((props) => {
  const {isCounsel, defaultUserType, openRangeList, writeStoryApi, storyPK, band} = props;
  const client = useApolloClient();

  // State
  const [editorLoad, setEditorLoad] = React.useState(false);
  const [defaultOpenRangeList, setDefaultOpenRangeList] = React.useState(openRangeList);
  const [defaultEditorBody, setDefaultEditorBody] = React.useState(null);
  const [defaultAttachList, setDefaultAttachList] = React.useState({file: [], image: []});

  // Api
  const storyApi = useCallAccessFunc(access => new StoryApi(access));

  // storyPK가 있다면 스토리 수정으로 간주
  React.useEffect(() => {
    if (!!storyPK) {
      storyApi.retrieve(storyPK)
        .then(({data: {result}}) => {
          if (!!result) {
            const {title, body, tags, wikis, files, images, is_band_story, timeline, open_range, user_types, user} = result;
            const user_expose_type = !!user.name
              ? 'real'
              : !!user.nick_name
                ? 'nick'
                : 'anon';

            editorDispatch({
              type: 'SAVE_OBJ',
              value: {
                title,
                open_range,
                user_expose_type,
                // user_types는 null로 오기도 함
                user_types: user_types || [],
                additionalContent: {
                  dictList: [],
                  tags: tags || [],
                },
              },
            });

            if (!isEmpty(wikis)) {
              client.query({query: INFO_UPLOAD_WIKIS, variables:{codes: wikis}})
                .then(({data: {wikis: {nodes}}}) => {
                  nodes.forEach(item => setDictList(item))
                });
            }

            setDefaultEditorBody(body);
            setDefaultAttachList({file: files, image: images});
            setDefaultOpenRangeList(
              is_band_story
                ? timeline.write_range === 'band'
                  ? getOpenRangeOption('band')
                  : getOpenRangeOption(['human', 'user_all', 'band', 'only_me'])
                : getOpenRangeOption(['human', 'user_all', 'only_me'])
            );

            setEditorLoad(true);
          }
        });
    } else {
      setEditorLoad(true);
    }
  }, [storyPK]);

  return (
    <EditorAllWrapper>
      <GlobalStateProvider>
        {editorLoad && (
          <EditorWrapper>
            <EditorTitle
              isCounsel={isCounsel}
              openRangeList={defaultOpenRangeList}
              defaultUserType={defaultUserType}
              band={band}
            />
            <EditorAnonAlarm />
            <EditorBody
              storyPK={storyPK}
              isCounsel={isCounsel}
              writeStoryApi={writeStoryApi}
              defaultEditorBody={defaultEditorBody}
              defaultAttachList={defaultAttachList}
            />
          </EditorWrapper>
        )}
      </GlobalStateProvider>
    </EditorAllWrapper>
  )
});

export default HaniStoryEditor;
