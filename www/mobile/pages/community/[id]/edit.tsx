import * as React from 'react';
import loginRequired from '../../../hocs/loginRequired';
import {useRouter} from 'next/router';
import Loading from '../../../components/common/Loading';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import ExploreApi from '../../../src/apis/ExploreApi';
import Error from '../../_error';
import userTypeRequired from '../../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../../src/constants/users';
import EditorWrapper from '../../../components/editor/layout/EditorWrapper';
import HaniEditor from '../../../components/editor/HaniEditor';
import CommunityEditorTitle from '../../../components/editor/layout/title/communityEditor/CommunityEditorTitle';
import {createSendForm} from '../../../src/lib/editor/form';
import {useForm} from 'react-hook-form/dist/react-hook-form.ie11';
import styled from 'styled-components';
import {INFO_UPLOAD_WIKIS} from '../../../src/gqls/wiki';
import isEmpty from 'lodash/isEmpty';
import {useApolloClient} from '@apollo/react-hooks';
import { fontStyleMixin } from '../../../styles/mixins.styles';
import { $WHITE } from '../../../styles/variables.types';
import {useDispatch} from 'react-redux';
import { updateStory } from '../../../src/reducers/orm/story/storyReducer';

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

const NewCommunityStory = () => {
  // State
  const [{defaultData, pending, status}, setDefaultData] = React.useState({
    defaultData: {},
    pending: true,
    status: 0
  });
  const dispatch = useDispatch();

  // Router
  const router = useRouter();
  const {id: storyPK} = router.query;

  // Form
  const methods = useForm();

  const client = useApolloClient();

  // API
  const exploreApi = useCallAccessFunc(access => new ExploreApi(access));

  const onClickBackBtn = React.useCallback(() => {
    confirm('글 작성을 취소하시겠습니까? 작성하신 글이 저장되지 않습니다.')
      && router.back();
  }, []);

  React.useEffect(() => {
    !!storyPK && exploreApi.detail(storyPK)
      .then(({data: {result: {story}}, status}) => {
        if (!!story) {
          const {register, getValues, setValue} = methods;

          const {
            title,
            body,
            tags,
            wikis,
            files,
            images,
            menu_tag: {
              id: menu_tag_id
            },
            open_range,
            user
          } = story || {} as any;

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

          const user_expose_type = !!user.name
            ? 'real'
            : !!user.nick_name
              ? 'nick'
              : 'anon';

          setDefaultData({
            defaultData: {
              title,
              body,
              tags,
              wikis,
              defaultAttachList: {
                file: files,
                image: images
              },
              menu_tag_id,
              open_range,
              user_expose_type
            },
            pending: false,
            status
          });
        }
      });
  }, [storyPK]);

  if (!pending && status !== 200) {
    return <Error statusCode={status}/>
  }

  return pending ? (
    <Loading/>
  ) : (
    <HaniCommunityEditorBackground>
      <EditorWrapper>
        <HaniEditor
          storyPK={storyPK}
          methods={methods}
          titleComp={
            <CommunityEditorTitle
              defaultValue={defaultData}
              initialMenuTagId={defaultData?.menu_tag_id}
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
              onClick={
                methods.handleSubmit(data => {
                  if (confirm('작성하신 글을 등록하시겠습니까?')) {
                    const form = createSendForm(data);

                    exploreApi.updateStory(storyPK, form).then(() => {
                      dispatch(updateStory(storyPK, curr => ({...curr, ...data})));
                      router.push({pathname: '/community'});
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
    </HaniCommunityEditorBackground>
  );
};

export default loginRequired(userTypeRequired(NewCommunityStory, MAIN_USER_TYPES));

