import React from 'react';
import Router, {useRouter} from 'next/router';
import {useForm} from 'react-hook-form/dist/react-hook-form.ie11';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$WHITE} from '../../../styles/variables.types';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import TimelineApi from '../../../src/apis/TimelineApi';
import EditorWrapper from '../../../components/editor/layout/EditorWrapper';
import {createSendForm} from '../../../src/lib/editor/form';
import HaniEditor from '../../../components/editor/HaniEditor';
import loginRequired from '../../../hocs/loginRequired';
import userTypeRequired from '../../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../../src/constants/users';
import OnClassEditorTitle from '../../../components/editor/layout/title/OnClassEditorTitle';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '../../../src/reducers';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import Page403 from '../../../components/errors/Page403';

const OnClassEditorWrapper = styled(EditorWrapper)`
  margin: 0;
`;

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
    margin-top: 0;
    
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

const NewOnClassStory: React.FC = () => {
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
        <>
          <OnClassEditorWrapper>
            <HaniEditor
              methods={methods}
              titleComp={
                <OnClassEditorTitle />
              }
            />
          </OnClassEditorWrapper>
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
