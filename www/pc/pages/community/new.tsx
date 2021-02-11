import * as React from 'react';
import Router, {useRouter} from 'next/router';
import styled from 'styled-components';
import {useForm} from 'react-hook-form/dist/react-hook-form.ie11';
import HaniEditor from '../../components/editor/HaniEditor';
import EditorBackBtn from '../../components/editor/layout/EditorBackBtn';
import ExploreApi from '../../src/apis/ExploreApi';
import FollowMenu from '../../components/FollowMenu';
import EditorWrapper from '../../components/editor/layout/EditorWrapper';
import loginRequired from '../../hocs/loginRequired';
import userTypeRequired from '../../hocs/userTypeRequired';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {staticUrl} from '../../src/constants/env';
import {MAIN_USER_TYPES} from '../../src/constants/users';
import {createSendForm} from '../../src/lib/editor/form';
import CommunityEditorTitle from '../../components/editor/layout/title/communityEditor/CommunityEditorTitle';

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
  const methods = useForm();
  const {query: {category}} = useRouter();
  const [formPending, setFormPending] = React.useState(true);

  // Api
  const exploreApi = useCallAccessFunc(access => new ExploreApi(access));

  const onClickBackBtn = React.useCallback(() => {
    confirm('글 작성을 취소하시겠습니까? 작성하신 글이 저장되지 않습니다.')
    && Router.back();
  }, []);

  React.useEffect(() => {
    const {register} = methods;

    register({name: 'body', value: ''});
    register({name: 'excludedUrlList', value: []});
    register({name: 'externalData', value: {
        tags: [],
        dictList: [],
        url_card: {},
      }});
    register({name: 'attachments', value: {
        file: [],
        image: [],
      }});

    setFormPending(false);
  }, []);

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

                      exploreApi.createStory(form).then(({status}) => {
                        if (status === 201) {
                          Router.push({pathname: '/community', query: {category}});
                        }
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
              titleComp={<CommunityEditorTitle />}
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
