import {createGlobalStyle} from 'styled-components';
import {$GRAY} from './variables.types';

const RendererStyle = createGlobalStyle`
  .hani-renderer {
    font-size: 15px;
    padding: 20px 0 10px;
    
    * {
      line-height: 1.8;
    }

    div.code-content {
      font-size: 12px;
      background: rgb(244, 245, 247);
      color: rgb(23, 43, 77);
      border-radius: 3px;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre;
      
      pre {
        margin: 0;
        padding: 8px;
      }
    }

    div.table-wrapper {
      margin: 24px 0 16px 0;

      table {
        border: 1px solid #C1C7D0;

        & * {
          box-sizing: border-box;
        }

        & th {
          background-color: #F4F5F7;
          text-align: left;
        }
  
        & th, & td {
          min-width: 48px;
          font-weight: normal;
          vertical-align: top;
          border: 1px solid #C1C7D0;
          border-right-width: 0;
          border-bottom-width: 0;
          padding: 8px;
          background-clip: padding-box;
        }
      }
    }

    div.alignment {
      &.align-center {
        text-align: center;
      }
      &.align-end {
        text-align: end;
      }
    }
    
    blockquote {
      box-sizing: border-box;
      padding-left: 16px;
      margin-right: 0;
      border-left: 2px solid #DFE1E6;

      :first-child {
        margin-top: 0;
      }
    }

    strong span {
      font-weight: bold;
    }

    p {
      word-break: break-word;
      color: ${$GRAY};    
      
      a {
        color: rgb(0, 0, 238);
        
        :hover {
          border-bottom: 1px solid rgb(0, 0, 238);
        }
      }

      span.code {
        font-size: 12px;
        padding: 2px 0px;
        background-color: rgba(9, 30, 66, 0.08);
        -webkit-box-decoration-break: clone;;
        border-radius: 3px;
        border-style: none;
        font-family: 'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace;
        white-space: pre-wrap;
        margin: 0 4px;
        box-shadow: -4px 0 0 0 rgba(9,30,66,0.08), 4px 0 0 0 rgba(9,30,66,0.08);
      }
    }

    ul, ol {
      padding-left: 24px;
    }

    ul li {
      list-style-type: disc;
    }

    ol li {
      list-style-type: decimal;
    }
    
    .modal-video {
      .modal-video-movie-wrap {
        padding-bottom: 0 !important;
      }
      
      .modal-video-movie-wrap iframe {
        width: 100%;
        height: 400px;
      }
    }
    
    h1, h2, h3, h4, h5, h6 {
      * {
        font-size: inherit;
      }
    }
    
    h1 {
      font-size: 1.714em;
    }
    
    h2 {
      font-size: 1.429em;
    }
    
    h3 {
      font-size: 1.143em;
    }
    
    h4 {
      font-size: 1em;
    }
    
    h5 {
      font-size: 0.857em;
    }
    
    h6 {
      font-size: 0.786em;
    }
  }
`;

export default RendererStyle;
