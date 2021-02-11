import * as React from 'react';
import Router, {useRouter} from 'next/router';
import styled from 'styled-components';
import {useForm} from 'react-hook-form/dist/react-hook-form.ie11';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import HaniEditor from '../../../../../components/editor/HaniEditor';
import EditorBackBtn from '../../../../../components/editor/layout/EditorBackBtn';
import BandEditorTitle from '../../../../../components/editor/layout/title/basicEditor/BandEditorTitle';
import BandApi from '../../../../../src/apis/BandApi';
import TimelineApi from '../../../../../src/apis/TimelineApi';
import FollowMenu from '../../../../../components/FollowMenu';
import EditorWrapper from '../../../../../components/editor/layout/EditorWrapper';
import loginRequired from '../../../../../hocs/loginRequired';
import userTypeRequired from '../../../../../hocs/userTypeRequired';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import {RootState} from '../../../../../src/reducers';
import {staticUrl} from '../../../../../src/constants/env';
import {getOpenRangeOption} from '../../../../../src/lib/editor';
import {fetchBandThunk} from '../../../../../src/reducers/orm/band/thunks';
import {pickBandSelector} from '../../../../../src/reducers/orm/band/selector';
import {pickTimelineSelector} from '../../../../../src/reducers/orm/timeline/selector';
import {MAIN_USER_TYPES} from '../../../../../src/constants/users';
import {createSendForm} from '../../../../../src/lib/editor/form';

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

const NewBandStory = () => {
  const methods = useForm();
  const {query: {slug, id: timelineParams}} = useRouter();
  const [formPending, setFormPending] = React.useState(true);

  // Redux
  const dispatch = useDispatch();
  const {timeline, band} = useSelector(
    ({orm}: RootState) => ({
      band: pickBandSelector(slug)(orm),
      timeline: pickTimelineSelector(timelineParams)(orm),
    }),
    shallowEqual,
  );

  // Api
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));
  const timelineApi: TimelineApi = useCallAccessFunc(access => new TimelineApi(access));
  
  const openRangeList = React.useMemo(() => (
    timeline?.write_range === 'band'
      ? getOpenRangeOption('band')
      : getOpenRangeOption(['human', 'user_all', 'band', 'only_me'])
  ), [timeline?.write_range]);

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
      {!formPending && !!band && (
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

                      timelineApi.newStory(timelineParams as string, form)
                        .then(() => {
                          Router.push(
                            {pathname: '/band/[slug]', query: {timeline: timelineParams}},
                            {pathname: `/band/${slug}`, query: {timeline: timelineParams}},
                          );
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
              titleComp={
                <BandEditorTitle
                  bandSlug={slug as string}
                  bandUserExposeType={band.user_expose_type}
                  openRangeList={openRangeList}
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

export default loginRequired(userTypeRequired(NewBandStory, MAIN_USER_TYPES));
