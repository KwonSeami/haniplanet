import * as React from 'react';
import styled from 'styled-components';
import Router, {useRouter} from 'next/router';
import {useForm} from 'react-hook-form/dist/react-hook-form.ie11';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import HaniEditor from '../../../../../components/editor/HaniEditor';
import EditorWrapper from '../../../../../components/editor/layout/EditorWrapper';
import BandEditorTitle from '../../../../../components/editor/layout/title/basicEditor/BandEditorTitle';
import BandApi from '../../../../../src/apis/BandApi';
import TimelineApi from '../../../../../src/apis/TimelineApi';
import loginRequired from '../../../../../hocs/loginRequired';
import userTypeRequired from '../../../../../hocs/userTypeRequired';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import {getOpenRangeOption} from '../../../../../src/lib/editor';
import {createSendForm} from '../../../../../src/lib/editor/form';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {fetchBandThunk} from '../../../../../src/reducers/orm/band/thunks';
import {pickBandSelector} from '../../../../../src/reducers/orm/band/selector';
import {pickTimelineSelector} from '../../../../../src/reducers/orm/timeline/selector';
import {RootState} from '../../../../../src/reducers';
import {$WHITE} from '../../../../../styles/variables.types';
import {MAIN_USER_TYPES} from '../../../../../src/constants/users';

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
        <>
          <EditorWrapper>
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

                        timelineApi.newStory(timelineParams, form).then(({status}) => {
                          if (status === 201)
                            Router.push({pathname: `/band/${band?.slug}`, query: {timeline: timelineParams}});
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
});

export default loginRequired(userTypeRequired(MoaWrite, MAIN_USER_TYPES));
