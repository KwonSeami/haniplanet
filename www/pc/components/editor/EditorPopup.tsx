import * as React from 'react';
import find from 'lodash/find';
import uniq from 'lodash/uniq';
import {shallowEqual, useSelector} from 'react-redux';
import {FormContext, useForm} from 'react-hook-form/dist/react-hook-form.ie11';
import FakeFullPopup from '../common/popup/base/FakeFullPopup';
import EditorWrapper from './body/EditorWrapper';
import EditorBackBtn from './body/EditorBackBtn';
import BasicEditorTitle from './title/BasicEditorTitle';
import CounselEditorTitle from './title/CounselEditorTitle';
import {RootState} from '../../src/reducers';
import {staticUrl} from '../../src/constants/env';
import {PopupProps} from '../common/popup/base/Popup';
import Loading from '../common/Loading';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {IOpenRangeOption} from './title/EditorTitle';
import EditorBody from './body/EditorBody';
import {StyledButtonGroup} from "../common/popup/Confirm";
import {createSendForm} from '../../src/lib/editor/form';
import isEmpty from "lodash/isEmpty";
import {INFO_UPLOAD_WIKIS} from "../../src/gqls/wiki";
import useCallAccessFunc from "../../src/hooks/session/useCallAccessFunc";
import StoryApi from "../../src/apis/StoryApi";
import {ApolloProvider, useApolloClient} from "@apollo/react-hooks";
import {getOpenRangeOption} from "../../src/lib/editor";
import apolloClient from "../../src/lib/apollo/apolloClient";

interface IEditorAttachList {
  file: [];
  image: [];
}

export type TEditorAttachListState = [IEditorAttachList, React.Dispatch<React.SetStateAction<IEditorAttachList>>];

interface Props extends PopupProps {
  band?: any;
  storyPK: HashId;    // storyPK가 존재할 때 수정 게시글이라고 판단
  writeStoryApi: any;
  openRangeList: IOpenRangeOption[];
  defaultValue: {
    defaultTag: any;
    defaultUserType: string[];
  };
}

const EditorPopup = React.memo<Props>(({
  id,
  closePop,
  band,
  storyPK,
  defaultValue,
  openRangeList,
  writeStoryApi,
}) => {
  const {defaultTag, defaultUserType} = defaultValue || {} as any;

  // State
  const [defaultEditorBody, setDefaultEditorBody] = React.useState(null);
  const [defaultOpenRangeList, setDefaultOpenRangeList] = React.useState(openRangeList);
  const [stateRegisterLoading, setStateRegisterLoading] = React.useState(true);
  const [editStoryStateLoading, setEditStoryStateLoading] = React.useState(!!storyPK);
  const attachListState = React.useState<IEditorAttachList>({file: [], image: []});
  const [_, setAttachList] = attachListState;

  // Redux
  const {theme} = useSelector(({theme}: RootState) => ({theme}));
  const {access, me: {user_type: myUserType}} = useSelector(
    ({system: {session: {access, id}}, orm}: RootState) => ({
      access,
      me: pickUserSelector(id)(orm),
    }),
    shallowEqual,
  );

  // Hooks
  const open_range = openRangeList
    ? (find(openRangeList, ({value}) => ['band', 'user_all'].includes(value)) || openRangeList[0]).value
    : '';

  const client = useApolloClient();
  const methods = useForm({
    defaultValues: {
      body: '',
      open_range,
      user_types: uniq([myUserType, ...(defaultUserType || [])].filter(item => item)),
      user_expose_type: 'real',
      additionalContent: {
        dictList: [],
        tags: defaultTag
          ? [defaultTag]
          : [],
        url_card: {},
      },
    },
  });
  const {register, handleSubmit, getValues, setValue} = methods;

  // Api
  const storyApi = useCallAccessFunc(access => new StoryApi(access));

  React.useEffect(() => {
    register({name: 'body'});   // 에디터 본문
    register({name: 'open_range'});   // 공개 범위
    register({name: 'user_types'});   // 유저 공개 범위
    register({name: 'user_expose_type'}); // 유저 노출 유형
    register({name: 'additionalContent'});  // 태그 및 처방사전 데이터
    setStateRegisterLoading(false);
  }, [register]);

  // storyPK가 있다면 스토리 수정으로 간주
  React.useEffect(() => {
    if (!stateRegisterLoading && !!storyPK) {
      storyApi.retrieve(storyPK)
        .then(({data: {result}}) => {
          if (!!result) {
            const {title, body, tags, wikis, files, images, is_band_story, timeline, open_range, url_card, user_types, user} = result;
            const user_expose_type = !!user.name
              ? 'real'
              : !!user.nick_name
                ? 'nick'
                : 'anon';

            setValue('title', title);
            setValue('open_range', open_range);
            setValue('user_expose_type', user_expose_type);
            setValue('user_types', user_types || uniq([myUserType, ...(defaultUserType || [])].filter(item => item)));
            setValue('additionalContent', {tags: tags || [], url_card: url_card || {}, dictList: []});

            if (!isEmpty(wikis)) {
              client.query({query: INFO_UPLOAD_WIKIS, variables:{codes: wikis}})
                .then(({data: {wikis: {nodes}}}) => {
                  nodes.forEach(item => {
                    const {additionalContent} = getValues();

                    setValue('additionalContent', {
                      ...additionalContent,
                      dictList: [
                        ...additionalContent.dictList,
                        item,
                      ],
                    })
                  });
                });
            }

            setDefaultEditorBody(JSON.parse(body));
            setAttachList({file: files, image: images});

            setDefaultOpenRangeList(
              is_band_story
                ? timeline.write_range === 'band'
                  ? getOpenRangeOption('band')
                  : getOpenRangeOption(['human', 'user_all', 'band', 'only_me'])
                : getOpenRangeOption(['human', 'user_all', 'only_me'])
            );

            setEditStoryStateLoading(false);
          }
        });
    }
  }, [stateRegisterLoading, storyPK, setAttachList, myUserType]);


  const editorTitleDefaultProps = {
    openRangeList: defaultOpenRangeList,
    defaultUserType,
  };

  if (stateRegisterLoading) {
    return <Loading />;
  }

  return (
    <FakeFullPopup id={id} closePop={closePop}>
      <FormContext {...methods}>
        <EditorWrapper>
          {!access
            ? <CounselEditorTitle {...editorTitleDefaultProps} />
            : <BasicEditorTitle band={band} {...editorTitleDefaultProps} />}
          <EditorBody
            storyPK={storyPK}
            defaultTag={defaultTag}
            attachListState={attachListState}
            defaultEditorBody={defaultEditorBody}
            editStoryStateLoading={editStoryStateLoading}
          />
          <StyledButtonGroup
            leftButton={{
              children: '취소',
              onClick: () => {
                closePop(id);
              },
            }}
            rightButton={{
              children: '확인',
              onClick: handleSubmit(data => {
                const form = createSendForm(data, attachListState);

                if (form) {
                  writeStoryApi(form)
                    .then(({data: {result}}) => {
                      if (!!result) {
                        closePop(id);

                        if (typeof window !== 'undefined') {
                          window.location.reload();
                        }
                      }
                    });
                }
              }),
            }}
          />
        </EditorWrapper>
      </FormContext>
      <EditorBackBtn
        className="back-button pointer"
        onClick={() => closePop(id)}
      >
        <img
          src={staticUrl('/static/images/icon/arrow/icon-big-shortcuts.png')}
          alt="뒤로가기"
        />
        뒤로가기
      </EditorBackBtn>
    </FakeFullPopup>
  );
});

const ApolloEditorPopup = React.memo(props => {
  const access = useSelector(({system: {session: {access}}}: RootState) => access);

  return (
    <ApolloProvider client={apolloClient(access)}>
      <EditorPopup {...props} />
    </ApolloProvider>
  )
});

export default ApolloEditorPopup;
