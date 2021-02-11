import {createGlobalStyle} from 'styled-components';
import {$POINT_BLUE} from './variables.types';

const CommonStyles = createGlobalStyle`
  .clearfix::after {
    content: '';
    display: block;
    clear: both;
  }

  .no-select {
    user-select: none;
  }

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :disabled {
    opacity: 0.5;
  }

  .pre-line {
    white-space: pre-line;
    word-wrap: break-word;
    word-break: break-all;
  }

  .pre-wrap {
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: keep-all;
  }

  .keyword {
    color: ${$POINT_BLUE};
  }

  .hidden {
    overflow: hidden;
    border: 0;
    width: 1px;
    height: 1px;
    margin: -1px;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
  }
`;

export default CommonStyles;
