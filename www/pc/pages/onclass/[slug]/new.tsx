import * as React from 'react';
import Router, {useRouter} from 'next/router';
import styled from 'styled-components';
import {useForm} from 'react-hook-form/dist/react-hook-form.ie11';
import OnClassEditorTitle from '../../../components/editor/title/OnClassEditorTitle';
import {staticUrl} from '../../../src/constants/env';
import EditorBackBtn from '../../../components/editor/layout/EditorBackBtn';
import EditorWrapper from '../../../components/editor/layout/EditorWrapper';
import HaniEditor from '../../../components/editor/HaniEditor';
import loginRequired from '../../../hocs/loginRequired';
import userTypeRequired from '../../../hocs/userTypeRequired';
import { MAIN_USER_TYPES } from '../../../src/constants/users';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import TimelineApi from '../../../src/apis/TimelineApi';
import {createSendForm} from '../../../src/lib/editor/form';
import FollowMenu from '../../../components/FollowMenu';
import {fetchBandThunk} from '../../../src/reducers/orm/band/thunks';
import BandApi from '../../../src/apis/BandApi';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Page403 from '../../../components/errors/Page403';
import {RootState} from '../../../src/reducers';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';

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

const NewOnClassStory = () => {
  const methods = useForm();
  const {query: {slug, timeline: timelineId}} = useRouter();
  const [formPending, setFormPending] = React.useState(true);

  // Api
  const timelineApi = useCallAccessFunc(access => new TimelineApi(access));

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

  const {band} = useSelector(
    ({orm}: RootState) => ({
      band: pickBandSelector(slug)(orm) || {},
    }),
    shallowEqual
  );
  const {timelines, band_member_grade} = band || {};
  const isNotice = ((timelines || []).filter(({id}) => id === timelineId)[0] || {}).name === '공지사항 및 학습자료실';

  if (isNotice && band_member_grade !== 'admin') {
    return <Page403/>
  }

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

                      timelineApi.newStory(timelineId, form).then(({status}) => {
                        if (status === 201) {
                          Router.push({pathname: `/onclass/${slug}`, query: {timelineId}});
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
              titleComp={<OnClassEditorTitle />}
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

export default loginRequired(userTypeRequired(NewOnClassStory, MAIN_USER_TYPES));
