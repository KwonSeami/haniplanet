import styled from 'styled-components';
import * as React from 'react';
import {useApolloClient} from '@apollo/react-hooks';
import Router, {useRouter} from 'next/router';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import isEmpty from 'lodash/isEmpty';
import {INFO_UPLOAD_WIKIS} from '../../../src/gqls/wiki';
import EditorWrapper from '../../../components/editor/layout/EditorWrapper';
import {createSendForm} from '../../../src/lib/editor/form';
import HaniEditor from '../../../components/editor/HaniEditor';
import loginRequired from '../../../hocs/loginRequired';
import userTypeRequired from '../../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../../src/constants/users';
import {useForm} from 'react-hook-form';
import TimelineApi from '../../../src/apis/TimelineApi';
import OnClassEditorTitle from '../../../components/editor/layout/title/OnClassEditorTitle';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$WHITE} from '../../../styles/variables.types';

const HaniCommunityEditorBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #f6f7f9;
  overflow: auto;
  z-index: 1;
  
  .editor-bot-wrapper {
    padding-bottom: 36px;
    
    .embed-urlcard {
      margin-left: 0;
      margin-right: 0;
    }
  }
  
  .editor-wrapper {
    margin-bottom: 125px;
    
    @media screen and (max-width: 680px) {
      margin-bottom: 56px;
    }
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

const NewOnClassStory = () => {
  const [storyData, setStoryData] = React.useState({});
  const [formPending, setFormPending] = React.useState(true);

  const methods = useForm();
  const client = useApolloClient();
  const {query: {id: storyPK, slug, timeline: timelineId}} = useRouter();

  // Api
  const timelineApi = useCallAccessFunc(access => new TimelineApi(access));

  const onClickBackBtn = React.useCallback(() => {
    confirm('글 작성을 취소하시겠습니까? 작성하신 글이 저장되지 않습니다.')
    && Router.back();
  }, []);

  React.useEffect(() => {
    storyPK && timelineApi.detail(timelineId, storyPK)
      .then(({status, data: {result}}) => {
        if (status === 200) setStoryData(result);
      });
  }, [storyPK, timelineId]);

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
              titleComp={
                <OnClassEditorTitle />
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
                  onClick={
                    methods.handleSubmit(data => {
                      if (confirm('작성하신 글을 등록하시겠습니까?')) {
                        const form = createSendForm(data);

                        timelineApi.newStory(timelineId, form).then(({status}) => {
                          if (status === 201)
                            Router.push(
                              {pathname: '/onclass/[slug]', query: {timeline: timelineId}},
                              {pathname: `/onclass/${slug}`, query: {timeline: timelineId}},
                            );
                        });
                      }
                    })
                  }
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
};

export default loginRequired(userTypeRequired(NewOnClassStory, MAIN_USER_TYPES));
