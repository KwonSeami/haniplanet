import * as React from 'react';
import Router from 'next/router';
import {useGlobalState} from '../editorState';
import {StyledButtonGroup} from '../../common/popup/Confirm';
import {isValid} from '../../../src/lib/validates';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';

interface Props {
  editorBody: object;
  isCommunity?: boolean;
  isCounsel?: boolean;
  attachListState: any;
  writeStoryApi: any;
}

const EditorConfirmBtn: React.FC<Props> = ({isCommunity, isCounsel, editorBody, attachListState, writeStoryApi}) => {
  const [title] = useGlobalState('title');
  const [userInfo] = useGlobalState('userInfo');
  const [open_range] = useGlobalState('open_range');
  const [user_types] = useGlobalState('user_types');
  const [user_expose_type] = useGlobalState('user_expose_type');
  const [menu_tag_id] = useGlobalState('menu_tag_id');
  const [additionalContent] = useGlobalState('additionalContent');

  const isFormValid = React.useCallback(() => {
    if (isCounsel) {
      const {gender, phone, age} = userInfo;

      if (!['male', 'female'].includes(gender)) {
        alert('잘못된 성별 값이 발견되었습니다.');
        return false;
      } else if (!age) {
        alert('나이를 입력해주세요.');
        return false;
      } else if (!!phone && !isValid(phone, 'VALIDATE_PHONE')) {
        alert('전화번호 형식을 확인해주세요.');
        return false;
      }
    }

    if (!title) {
      alert('제목을 입력해주세요');
      return false;
    } else if (!editorBody || editorBody.content.every(({content}) => isEmpty(content))) {
      alert('내용을 입력해주세요');
      return false;
    }

    return true;
  }, [editorBody, isCounsel, userInfo, title]);

  const createForm = React.useCallback((additionalForm = {}) => {
    const form = {
      title,
      user_types,
      open_range,
      user_expose_type,
      wikis: [],
      is_notice: false,
      body: typeof editorBody === 'string'
        ? editorBody
        : JSON.stringify(editorBody),
      ...additionalForm,
      ...(isCommunity && {
        menu_tag_id
      })
    };

    const {attachList: {file, image}} = attachListState;
    const {tags, dictList} = additionalContent;

    form.file_uids = file.reduce((prev, curr) => curr.uid ? [...prev, curr.uid] : prev, []);
    form.image_uids = image.reduce((prev, curr) => curr.uid ? [...prev, curr.uid] : prev, []);
    form.tag_ids = tags.map(({id}) => id);

    for (const {code} of dictList) {
      form.wikis = [...form.wikis, code];
    }

    return form;
  }, [title, user_types, open_range, isCommunity, menu_tag_id, user_expose_type, editorBody, attachListState, additionalContent]);

  const sendForm = React.useCallback(() => {
    if (isFormValid()) {
      if (isCommunity && !confirm('작성하신 글을 등록하시겠습니까?')) {
        return false;
      }
      writeStoryApi(createForm(isCounsel ? userInfo : {}))
        .then(({data, data: {result}}) => {
          if (!!data && isCommunity && !has(data, 'status_code')) {
            Router.push('/community');
          }
          if (!!result) {
            if (typeof window !== 'undefined') {
              window.onbeforeunload = null;
              window.location.reload();
            }
            Router.back();
          }
        });
    }
  }, [writeStoryApi, isFormValid, createForm, isCommunity, isCounsel, userInfo]);

  const cancelWriteButton = React.useMemo(() => ({
    children: '취소',
    onClick: () => {
      if (typeof window !== 'undefined') {
        if (isCommunity && !confirm('글 작성을 취소하시겠습니까? 작성하신 글이 저장되지 않습니다.')) {
          return false;
        }
        window.onbeforeunload = null;
        Router.back();
      }
    },
  }), []);
  const confirmWriteButton = React.useMemo(() => ({
    children: isCommunity ? '글 등록' : '확인',
    onClick: sendForm,
  }), [isCommunity, sendForm]);

  return (
    <StyledButtonGroup
      leftButton={cancelWriteButton}
      rightButton={confirmWriteButton}
    />
  );
};

export default EditorConfirmBtn;
