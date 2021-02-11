import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import Router, {useRouter} from 'next/router';
import {useDispatch} from 'react-redux';
import {useApolloClient} from '@apollo/react-hooks';
import {useForm} from 'react-hook-form/dist/react-hook-form.ie11';
import HaniEditor from '../../../components/editor/HaniEditor';
import EditorWrapper from '../../../components/editor/layout/EditorWrapper';
import BandEditorTitle from '../../../components/editor/layout/title/basicEditor/BandEditorTitle';
import StoryApi from '../../../src/apis/StoryApi';
import TimelineApi from '../../../src/apis/TimelineApi';
import loginRequired from '../../../hocs/loginRequired';
import userTypeRequired from '../../../hocs/userTypeRequired';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {getOpenRangeOption} from '../../../src/lib/editor';
import {createSendForm} from '../../../src/lib/editor/form';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {updateStory} from '../../../src/reducers/orm/story/storyReducer';
import {$WHITE} from '../../../styles/variables.types';
import {INFO_UPLOAD_WIKIS} from '../../../src/gqls/wiki';
import {MAIN_USER_TYPES} from '../../../src/constants/users';

const HaniCommunityEditorBackground = styled.div`
  background: #f6f7f9;
  padding: 30px 0;
  
  .editor-bot-wrapper {
    padding-bottom: 36px;
    
    .embed-urlcard {
      margin-left: 0;
      margin-right: 0;
    }
  }
  
  .editor-wrapper {
    margin: 0 auto;
  }
`;

const ConfirmButtonGroup = styled.div`
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
  
  ul {
    text-align: center;
  }
  
  li {
    display: inline-block;
    width: calc(50% - 1px);
    height: 42px;
    padding: 0;
    vertical-align: middle;

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
`;

const MoaWrite: React.FC = React.memo(() => {
  const [storyData, setStoryData] = React.useState({});
  const [formPending, setFormPending] = React.useState(true);

  const methods = useForm();
  const dispatch = useDispatch();
  const client = useApolloClient();
  const {query: {id: storyPK, timeline: timelineParams}} = useRouter();

  // Api
  const storyApi = useCallAccessFunc(access => new StoryApi(access));
  const timelineApi: TimelineApi = useCallAccessFunc(access => new TimelineApi(access));

  const openRangeList = React.useMemo(() => (
    storyData?.timeline?.write_range === 'band'
      ? getOpenRangeOption('band')
      : getOpenRangeOption(['human', 'user_all', 'band', 'only_me'])
  ), [storyData?.timeline?.write_range]);

  const onClickBackBtn = React.useCallback(() => {
    confirm('글 작성을 취소하시겠습니까? 작성하신 글이 저장되지 않습니다.')
    && Router.back();
  }, []);

  React.useEffect(() => {
    storyApi.retrieve(storyPK)
      .then(({data: {result}}) => {
        setStoryData(result);
      });
  }, [storyPK]);

  React.useEffect(() => {
    if (!isEmpty(storyData)) {
      const {register, getValues, setValue} = methods;
      const {body, files, images, tags, wikis} = storyData || {} as any;

      register({name: 'body', value: body});
      register({name: 'excludedUrlList', value: []});
      register({name: 'attachments', value: {file: files || [], image: images || []}});
      register({name: 'externalData', value: {
          tags: tags || [],
          dictList: [],
          url_card: {},
        }});

      if (!isEmpty(wikis)) {
        client.query({query: INFO_UPLOAD_WIKIS, variables: {codes: wikis}})
          .then(({data: {wikis: {nodes}}}) => {
            const {externalData} = getValues();
            setValue('externalData', {...externalData, dictList: nodes});
          });
      }

      setFormPending(false);
    }
  }, [storyData]);

  return (
    <HaniCommunityEditorBackground>
      {!formPending && (
        <>
          <EditorWrapper>
            <HaniEditor
              methods={methods}
              storyPK={storyPK}
              titleComp={
                <BandEditorTitle
                  defaultValue={storyData}
                  openRangeList={openRangeList}
                />
              }
            />
          </EditorWrapper>
          <ConfirmButtonGroup>
            <ul>
              <li>
                <button
                  type="button"
                  onClick={onClickBackBtn}
                >
                  취소
                </button>
              </li>
              <li>
                <button
                  onClick={methods.handleSubmit(data => {
                    if (confirm('작성하신 글을 등록하시겠습니까?')) {
                      const form = createSendForm(data);
                      timelineApi.update(timelineParams as string, storyPK as string, form)
                        .then(({data: {result}}) => {
                          const {getValues} = methods;
                          const {body} = getValues();

                          dispatch(updateStory(storyPK, {...result, body}));
                          Router.back();
                        });
                    }
                  })}
                >
                  글 등록
                </button>
              </li>
            </ul>
          </ConfirmButtonGroup>
        </>
      )}
    </HaniCommunityEditorBackground>
  );
});

export default loginRequired(userTypeRequired(MoaWrite, MAIN_USER_TYPES));
