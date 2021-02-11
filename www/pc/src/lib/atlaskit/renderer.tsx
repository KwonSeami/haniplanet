import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import ReactVideoPlayer from "../../../components/common/ReactVideoPlayer";

const RENDERER_TYPE = {
  bulletList: 'ul',
  orderedList: 'ol',
  listItem: 'li',
  paragraph: 'p',
  blockquote: 'blockquote',
};

const MARKES_TYPE = {
  underline: 'u',
  strike: 's',
  textColor: 'span',
  link: 'a',
  code: 'span',
};

const MARKES_PROPS_TYPE = {
  textColor: 'style',
};

const TABLE_TYPE = {
  table: 'table',
  tableRow: 'tr',
  tableHeader: 'th',
  tableCell: 'td',
};

const parseTextMarks = (content, idx) => {
  const {marks, text} = content;
  let element = text;

  for (const {type, attrs} of marks.reverse()) {
    const hasAttrsType = ['subsup'].includes(type) ? attrs.type : null;
    const marksType = MARKES_TYPE[type] || type;
    const propsType = MARKES_PROPS_TYPE[type] || null;
    const directProps = ['link'].includes(type);

    const elementType = hasAttrsType || marksType;
    const elementProps = !!propsType
      ? {[propsType]: attrs}
      : directProps
        ? {...attrs, target: '_blank'}
        : type === 'code' ? {className: 'code'} : {};

    element = React.createElement(elementType, {...elementProps, key: type + text + idx}, element);
  }

  return element;
};

const attrsObjToStr = attrs => (
  Object.keys(attrs).reduce((prev, curr) => (
    prev + ` ${curr}-${attrs[curr]}`
  ), '')
);

const parseContentMarks = (content, childElement, idx) => {
  const {marks} = content;
  let element = childElement;

  for (const {type, attrs} of marks.reverse()) {
    element = React.createElement('div', {className: `${type}${attrsObjToStr(attrs)}`, key: type + idx}, element);
  }

  return element;
};

export const movieExtensionParse = parameters => {
  const {type, key} = parameters;
  const allowFullScreen = type !== 'vimeo';

  return (
    <ReactVideoPlayer
      channel={type}
      videoId={key}
      allowFullScreen={allowFullScreen}
      vimeo={{autoplay: false}}
      youtube={{autoplay: false}}
    />
  );
};

const extensionParse = attrs => {
  const {extensionKey, parameters} = attrs;

  switch (extensionKey) {
    case 'media':
      return (
        <div>
          <img src={parameters.src} alt="이미지"/>
        </div>
      );
    case 'movie':
      return movieExtensionParse(parameters);
    default:
      return null;
  }
};

export const parse = (items = []) => {
  return items.map((item, idx) => {
    const {type, content, marks, attrs} = item;

    if (type === 'text') {
      // text와 text 객체 내에 marks가 존재하는 경우에 대해 처리
      return !!marks ? parseTextMarks(item, idx) : item.text;
    } else if (['paragraph', 'bulletList', 'listItem', 'orderedList', 'blockquote', 'heading'].includes(type)) {
      // 최 외각에 있는 type에 대해 처리
      const elementType = type === 'heading' ? `h${attrs.level}` : RENDERER_TYPE[type];
      const childElement = React.createElement(elementType, {key: type + idx}, parse(content));

      if (type === 'paragraph' && isEmpty(content)) {
        return <p>&nbsp;</p>;
      }

      return !!marks ? parseContentMarks(item, childElement, idx) : childElement;
    } else if (['table', 'tableRow', 'tableHeader', 'tableCell'].includes(type)) {
      const elementType = TABLE_TYPE[type];
      const elementProps = type === 'tableCell'
        ? {key: type + idx, ...attrs}
        : {key: type + idx};
      const tableElement = type === 'table' && (
        <div className="table-wrapper">
          {React.createElement(elementType, {key: type + idx}, <tbody>{parse(content)}</tbody>)}
        </div>
      );
      const tableChildElement = React.createElement(elementType, elementProps, parse(content));

      const childElement = tableElement || tableChildElement;

      return !!marks ? parseContentMarks(item, childElement, idx) : childElement;
    } else if (type === 'extension') {
      return extensionParse(attrs);
    } else if (type === 'hardBreak') {
      return <br/>;
    } else if (type === 'codeBlock') {
      return (
        <div className="code-block code-content">
            <pre>
              <code spellCheck={false}>
                {content[0].text}
              </code>
            </pre>
        </div>
      );
    }
  });
};
