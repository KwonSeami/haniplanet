// @ts-nocheck
import React from 'react';
import FroalaEditor from 'react-froala-wysiwyg';
import Froalaeditor from 'froala-editor';
import {useDispatch} from 'react-redux';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/video.min.js';
import 'froala-editor/js/plugins/file.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/quote.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/languages/ko.js';
import ApolloDictPopup from '../../dict/ApolloDictPopup';
import {pushPopup} from '../../../src/reducers/popup';
import {STAGE_URL, staticUrl, IS_PROD, IS_API_STAGE, FROALA_STAGE_KEY, IS_PROD_SERVER, FROALA_PROD_KEY} from '../../../src/constants/env';

Froalaeditor.ICON_TEMPLATES = {
  font_awesome: '<i class="fa fa-[NAME]" aria-hidden="true"></i>',
  font_awesome_5: '<i class="fas fa-[FA5NAME]" aria-hidden="true"></i>',
  font_awesome_5r: '<i class="far fa-[FA5NAME]" aria-hidden="true"></i>',
  font_awesome_5l: '<i class="fal fa-[FA5NAME]" aria-hidden="true"></i>',
  font_awesome_5b: '<i class="fab fa-[FA5NAME]" aria-hidden="true"></i>',
  text: '<span style="text-align: center;">[NAME]</span>',
  image: "<img src=[SRC] alt=[ALT] />",
  svg: '<svg class="fr-svg" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="[PATH]"/></svg>',
  customSVG: '[PATH]',
  empty: " ",
};

Froalaeditor.DefineIcon('bold', {
  PATH: `
    <svg class="fr-svg bold" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <text fill="#333" fill-rule="evenodd" font-family="Montserrat-ExtraBold, Montserrat ExtraBold" font-size="19" font-weight="600">
        <tspan x="5" y="20">B</tspan>
      </text>
    </svg>
  `,
  template: 'customSVG',
});
Froalaeditor.DefineIcon('italic', {
  PATH: `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g fill="#333" fill-rule="evenodd">
      <path d="M4.011 0H13.011V1H4.011z" transform="translate(5.489 6)"/>
      <path d="M0 5.947L12.531 5.804 13 7.002 0 6.947z" transform="translate(5.489 6) rotate(-70 6.5 6.403)"/>
      <path d="M0.011 12H9.011V13H0.011z" transform="translate(5.489 6)"/>
    </g>
  </svg>
  `,
  template: 'customSVG',
});
Froalaeditor.DefineIcon('underline', {
  PATH: `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g fill="none" fill-rule="evenodd">
      <path class="not-fill" stroke="#333" d="M11.5.986v6.68c0 2.486-2.015 4.5-4.5 4.5s-4.5-2.014-4.5-4.5V.986" transform="translate(5 5)"/>
      <path fill="#333" d="M0 14H14V15H0z" transform="translate(5 5)"/>
    </g>
  </svg>
  `,
  template: 'customSVG',
});
Froalaeditor.DefineIcon('strikeThrough', {
  PATH: `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g fill="#333" fill-rule="evenodd">
      <g>
        <path d="M0 0H13V1H0z" transform="translate(5 6) translate(1)"/>
        <path d="M5 13H8V14H5z" transform="translate(5 6) translate(1) matrix(1 0 0 -1 0 27)"/>
        <path d="M0 0H1V2H0z" transform="translate(5 6) translate(1)"/>
        <path d="M0 0H1V2H0z" transform="translate(5 6) translate(1) translate(12)"/>
        <g>
          <path d="M0 0H14V1H0z" transform="translate(5 6) translate(1) rotate(90 3.5 3.5)"/>
        </g>
      </g>
      <path d="M0 7H15V8H0z" transform="translate(5 6)"/>
    </g>
  </svg>
  `,
  template: 'customSVG',
});
Froalaeditor.DefineIcon('alignLeft', {
  SRC: staticUrl('/static/images/icon/editor/icon-editor-align-left.png'),
  ALT: 'alignLeft',
  template: 'image',
});
Froalaeditor.DefineIcon('alignCenter', {
  SRC: staticUrl('/static/images/icon/editor/icon-editor-align-center.png'),
  ALT: 'alignCenter',
  template: 'image',
});
Froalaeditor.DefineIcon('alignRight', {
  SRC: staticUrl('/static/images/icon/editor/icon-editor-align-right.png'),
  ALT: 'alignRight',
  template: 'image',
});
Froalaeditor.DefineIcon('quote', {
  SRC: staticUrl('/static/images/icon/editor/icon-editor-quote.png'),
  ALT: 'quote',
  template: 'image',
});
Froalaeditor.DefineIcon('insertLink', {
  SRC: staticUrl('/static/images/icon/editor/icon-editor-insert-link.png'),
  ALT: 'insertLink',
  template: 'image',
});
Froalaeditor.DefineIcon('insertImage', {
  SRC: staticUrl('/static/images/icon/editor/icon-editor-insert-image.png'),
  ALT: 'insertImage',
  template: 'image',
});
Froalaeditor.DefineIcon('selectAll', {
  SRC: staticUrl('/static/images/icon/editor/icon-editor-select-all.png'),
  ALT: 'selectAll',
  template: 'image',
});

const EDITOR_CONFIG = {
  language: 'ko',
  key: IS_PROD && (IS_API_STAGE
    ? FROALA_STAGE_KEY
    : (IS_PROD_SERVER && FROALA_PROD_KEY)),
  height: 500,
  placeholderText: '내용을 입력해주세요.',
  attribution: false,
  pasteAllowLocalImages: true,
  fontSize: ['13', '15', '17', '19', '21', '24', '30', '36'],
  linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
  toolbarButtons: [
    'fontSize', 'bold', 'italic', 'underline', 'strikeThrough', 'textColor', 'alignLeft', 'alignCenter', 'alignRight', 'quote', 'insertHR',
    'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'selectAll', 'dict',
  ],
  imageEditButtons: [
    'imageAlign', 'imageRemove', '|',
    'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageAlt',
  ],
  fileUploadMethod: 'POST',
  fileUploadParam: 'file',
  fileUploadURL: `${STAGE_URL}/story/assets/file/`,
  imageUploadMethod: 'POST',
  imageUploadParam: 'image',
  imageUploadURL: `${STAGE_URL}/story/assets/image/`,
};

export interface IHaniEditorCoreProps {
  isUpload: boolean;
  defaultValue: string;
  onChange: (value: string) => void;
  onChangeDictList?: (dictList: any[]) => void;
  imageBeforeUploadEvents: (ref) => (images) => void;
  fileBeforeUploadEvents: (ref) => (images) => void;
}

const HaniEditorCore: React.FC<IHaniEditorCoreProps> = ({
  isUpload = true,
  defaultValue,
  onChange,
  onChangeDictList,
  imageBeforeUploadEvents = () => () => null,
  fileBeforeUploadEvents = () => () => null,
}) => {
  const editorRef = React.useRef(null);
  const dispatch = useDispatch();

  const editorConfig = React.useMemo(() => ({
    ...EDITOR_CONFIG,
    events: {
      'image.uploaded': (response) => {
        const results = JSON.parse(response).results;
        const {image, uid} = results[0];
        const {current: {editor}} = editorRef;

        editor.image.insert(image, false, uid, editor.image.get(), results);
        imageBeforeUploadEvents(results);

        return false;
      },
      'file.uploaded': response => {
        const results = JSON.parse(response).results;
        const {file} = results[0];

        const {current: {editor}} = editorRef;
        editor.file.insert(file, file, {link: file});
        fileBeforeUploadEvents(results);

        return false;
      },
    },
  }), [imageBeforeUploadEvents, fileBeforeUploadEvents]);

  React.useEffect(() => {
    if (onChangeDictList) {
      Froalaeditor.RegisterCommand('dict', {
        title: '처방사전 업로드',
        focus: false,
        undo: false,
        refreshAfterCallback: false,
        callback: () => {
          dispatch(pushPopup(ApolloDictPopup, {
            setDictList: dict => {
              onChangeDictList(dict);
            },
          }));
        },
      });
    }
  }, [onChangeDictList]);

  React.useEffect(() => {
    Froalaeditor.DefineIcon('insertVideo', {
      SRC: staticUrl('/static/images/icon/editor/icon-editor-insert-video.png'),
      ALT: 'insertVideo',
      template: 'image',
    });
    Froalaeditor.DefineIcon('insertFile', {
      SRC: staticUrl('/static/images/icon/editor/icon-editor-insert-file.png'),
      ALT: 'insertFile',
      template: 'image',
    });
    Froalaeditor.DefineIcon('dict', {
      SRC: staticUrl('/static/images/icon/editor/icon-editor-dict.png'),
      ALT: 'dict',
      template: 'image',
    });
  }, [isUpload]);

  return (
    <FroalaEditor
      ref={editorRef}
      tag="textarea"
      config={editorConfig}
      model={defaultValue}
      onModelChange={onChange}
    />
  );
};

export default React.memo(HaniEditorCore);
