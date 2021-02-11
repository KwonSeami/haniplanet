import {createGlobalStyle} from 'styled-components';
import {$FONT_COLOR, $TEXT_GRAY, $WHITE} from './variables.types';

export const HEADER_HEIGHT = 55;

const BaseStyles = createGlobalStyle`
  img {
    user-drag: none; 
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
  body, html, #appRoot {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    -webkit-overflow-scrolling: auto;
  }

  #appRoot, #popup {
    color: ${$FONT_COLOR};
    font-size: 12px;
  }
  
  * {
    font-family: "Noto Sans KR", sans-serif;
    letter-spacing: -0.2px;
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  a, blockquote, p, span {
    font-weight: 400;
  }
  
  strong a, strong blockquote, strong p, strong span {
    font-weight: 700 !important;
  }

  dl, dt, dd {
    margin: 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 400;
    margin: 0;
    color: ${$FONT_COLOR};
    line-height: 1.3;
  }

  button, div, p, ul, ol {
    margin: 0;
    padding: 0;
    color: ${$FONT_COLOR};
    outline: none;
  }

  article, aside, figure, footer, header, main, nav, section {
    display: block;
  }

  dl, dt, dd {
    margin: 0;
    padding: 0;
  }

  li {
    list-style-type: none;
  }

  /* select::-ms-expand {
    display: none;
  } */
  a, img {
    outline: none;
  }

  button {
    background: none;
    border: 0;
  }

  a:link, a:visited, a:focus, a:hover, a:active {
    text-decoration: none;
    color: ${$FONT_COLOR};
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
  }

  textarea {
    padding: 0;
    border: 0;
    background: none;
    width: 100%;
    
  }

  /*ios 그림자 제거*/
  input, textarea {
    appearance: none;
    outline: none;
    resize: none;
    border-radius: 0;
  }

  input[type="text"],
  input[type="password"],
  input[type="email"],
  input[type="number"] {
    /* width: 100%; */
    display: block;
    border: 1px solid transparent;
    box-sizing: border-box;
    background-color: transparent;
  }
  
  img, input[type="image"] {
    border-width: 0;
    height: auto;
    max-width: 100%;
  }

  input[type="text"]::-ms-clear {
    display: none;
  }

  input[type="number"] {
    -moz-appearance:textfield;
  }

  input::placeholder {
    color: ${$TEXT_GRAY};
  }

  input:-webkit-autofill,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:hover,
  input:-internal-autofill-selected {
    -webkit-box-shadow: 0 0 0px 1000px ${$WHITE} inset !important;
    background-color: ${$WHITE} !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

iframe {
  width: 100% !important;
  max-width: 100%;
}
`;

export default BaseStyles;
