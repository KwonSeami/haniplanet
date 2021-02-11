import * as React from 'react';
import Router, {useRouter} from 'next/router';
import {useForm} from 'react-hook-form/dist/react-hook-form.ie11';
import {useDispatch} from 'react-redux';
import HaniEditor from '../../components/editor/HaniEditor';
import BandApi from '../../src/apis/BandApi';
import ExploreApi from '../../src/apis/ExploreApi';
import EditorWrapper from '../../components/editor/layout/EditorWrapper';
import loginRequired from '../../hocs/loginRequired';
import userTypeRequired from '../../hocs/userTypeRequired';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {fetchBandThunk} from '../../src/reducers/orm/band/thunks';
import {MAIN_USER_TYPES} from '../../src/constants/users';
import {createSendForm} from '../../src/lib/editor/form';
import CommunityEditorTitle from '../../components/editor/layout/title/communityEditor/CommunityEditorTitle';
import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$WHITE} from '../../styles/variables.types';

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
  const methods = useForm();
  const {query: {slug, category}} = useRouter();
  const [formPending, setFormPending] = React.useState(true);

  // Redux
  const dispatch = useDispatch();

  // Api
  const exploreApi = useCallAccessFunc(access => new ExploreApi(access));
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

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

  React.useEffect(() => {
    dispatch(fetchBandThunk(bandApi, slug));
  }, [slug]);

  return (
    <HaniCommunityEditorBackground>
      {!formPending && (
        <>
          <EditorWrapper>
            <HaniEditor
              methods={methods}
              titleComp={<CommunityEditorTitle />}
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

                        exploreApi.createStory(form).then(({ status }) => {
                          if (status === 201) {
                            Router.push({pathname: '/community', query: {category}});
                          }
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

export default loginRequired(userTypeRequired(NewCommunityStory, MAIN_USER_TYPES));
