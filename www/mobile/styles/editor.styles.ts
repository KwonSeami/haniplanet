import {createGlobalStyle} from 'styled-components';
import {$GRAY} from './variables.types';

const root = (selector: string = '') => `.ak-editor-content-area ${selector}, .ak-renderer-document ${selector}`;
const EditorStyle = createGlobalStyle`
   ${root('*')}{
    font-size: 14px;
    color: inherit;
  }
  
  .ak-editor-content-area {
    height: 500px;
    box-sizing: border-box;
    color: ${$GRAY};
  }

  .ak-renderer-document {
    overflow: hidden;
  }

  .code-content {
    pre {
      margin: 0;
    }
  }

  .Tooltip {
    background-color: #505f79;
    border-radius: 3px;
    font-size: 12px;
    color: #f4f5f7;
    padding: 2px 5px;
  }
 
  .akEditor button.css-c7hv5y {
    color: #f4f5f7 !important;
  }

  .akEditor button.css-c7hv5y div {
    color: #f4f5f7 !important;
  }

  .akEditor button.selected {
    color: #f4f5f7 !important;
  }

  .akEditor .jpIZiA > div {
    margin: 0 1px;
  }

  .akEditor ul li {
    list-style-type: disc;
  }

  .akEditor ol li {
    list-style-type: decimal;
  }
  
  .akEditor strong span {
    font-weight: bold;
  }
  
  .akEditor .sc-bwzfXH.jpIZiA:nth-child(6) > div:first-child {
    display: none;
  }
  
  .akEditor {
    h1, h2, h3, h4, h5, h6 {
      em, s, span, strong, sub, sup, u {
        font-size: inherit;
      }
    }
  }
  
  .akEditor h1 {
    font-size: 1.714em;
  }
  
  .akEditor h2 {
    font-size: 1.429em;
  }
  
  .akEditor h3 {
    font-size: 1.143em;
  }
  
  .akEditor h4 {
    font-size: 1em;
  }
  
  .akEditor h5 {
    font-size: 0.857em;
  }
  
  .akEditor h6 {
    font-size: 0.786em;
  }
`;

export default EditorStyle;
