import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import Router, {useRouter} from 'next/router';
import styled from 'styled-components';
import {useForm} from 'react-hook-form/dist/react-hook-form.ie11';
import HaniEditor from '../../../components/editor/HaniEditor';
import EditorBackBtn from '../../../components/editor/layout/EditorBackBtn';
import ExploreApi from '../../../src/apis/ExploreApi';
import FollowMenu from '../../../components/FollowMenu';
import EditorWrapper from '../../../components/editor/layout/EditorWrapper';
import loginRequired from '../../../hocs/loginRequired';
import userTypeRequired from '../../../hocs/userTypeRequired';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {staticUrl} from '../../../src/constants/env';
import {MAIN_USER_TYPES} from '../../../src/constants/users';
import {createSendForm} from '../../../src/lib/editor/form';
import CommunityEditorTitle from '../../../components/editor/layout/title/communityEditor/CommunityEditorTitle';
import {INFO_UPLOAD_WIKIS} from '../../../src/gqls/wiki';
import {useApolloClient} from '@apollo/react-hooks';
import {useDispatch} from 'react-redux';
import { updateStory } from '../../../src/reducers/orm/story/storyReducer';

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

const EditorConfirmButtonGroup = styled.div`  
  button {
    width: 75px;
    height: 75px;
    background: #499aff;
    display: block;
    box-shadow: 1px 2px 6px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 4px;
    
    font-size: 15px;
    color: #fff;
    
    border 1px solid #eee;
    border-radius: 12px;
    
    cursor: pointer;
  }
  buttion:last-child {
    margin-bottom: 0px;
  }
  button[type=button] {
    background: #000;
  }
`;

const NewCommunityStory = () => {
  const [storyData, setStoryData] = React.useState({});
  const [formPending, setFormPending] = React.useState(true);
  const dispatch = useDispatch();

  const methods = useForm();
  const client = useApolloClient();
  const {query: {id: storyPK}} = useRouter();

  // Api
  const exploreApi = useCallAccessFunc(access => new ExploreApi(access));

  const onClickBackBtn = React.useCallback(() => {
    confirm('글 작성을 취소하시겠습니까? 작성하신 글이 저장되지 않습니다.')
    && Router.back();
  }, []);

  React.useEffect(() => {
    storyPK && exploreApi.detail(storyPK)
      .then(({data: {result: {story}}}) => {
        setStoryData(story);
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
        <EditorWrapper>
          <FollowMenu
            top={0}
            right={-20}
            menuCompFn={() =>
              <EditorConfirmButtonGroup>
                <button
                  onClick={methods.handleSubmit(data => {
                    if (confirm('작성하신 글을 등록하시겠습니까?')) {
                      const form = createSendForm(data);

                      exploreApi.updateStory(storyPK, form).then(({data}) => {
                        dispatch(updateStory(storyPK, curr => ({...curr, ...data})));
                        Router.push({pathname: '/community'});
                      });
                    }
                  })}
                >
                  글 등록
                </button>
                <button
                  type="button"
                  onClick={onClickBackBtn}
                >
                  취소
                </button>
              </EditorConfirmButtonGroup>
            }
          >
            <HaniEditor
              methods={methods}
              storyPK={storyPK}
              titleComp={
                <CommunityEditorTitle
                  defaultValue={storyData}
                  initialMenuTagId={storyData?.menu_tag?.id}
                />
              }
            />
          </FollowMenu>
        </EditorWrapper>
      )}
      <EditorBackBtn
        className="back-button pointer"
        onClick={onClickBackBtn}
      >
        <img
          src={staticUrl('/static/images/icon/arrow/icon-big-shortcuts.png')}
          alt="뒤로가기"
        />
        뒤로가기
      </EditorBackBtn>
    </HaniCommunityEditorBackground>
  );
};

export default loginRequired(userTypeRequired(NewCommunityStory, MAIN_USER_TYPES));
