import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import Block, {IBlockProps} from './Block';
import {$BORDER_COLOR,$POINT_BLUE, $GRAY, $FONT_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';
import { fontStyleMixin } from '../../../styles/mixins.styles';

const BlockWrapperDiv = styled.div`
  box-sizing: border-box;
  font-size: 14px;
  line-height: 22px;

  h3 {
    & + .form {
      margin: 12px 15px 0;
    }

    &:hover ul {
      display: inline-block;
    }

    ul {
      display: none;
      vertical-align: middle;
      margin-top: -5px;

      li {
        position: relative;
        display: inline-block;
        padding: 0 4px;
        ${fontStyleMixin({
          size: 11,
          weight: '600',
          color: '#999'
        })};
        cursor: pointer;

        & ~ li:before {
          content: '';
          display: inline-block;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          height: 8px;
          border-left: 1px solid ${$BORDER_COLOR};
        }

        &:not(.report):hover {
          color: ${$GRAY};
          text-decoration: underline;
        }
      }
    }

    span {
      position: absolute;
      top: 0;
      right: 0;
      width: 79px;
      height: 100%;
      line-height: 37px;
      text-align: center;
      border-left: 1px solid #eee;
      cursor: pointer;
      ${fontStyleMixin({
        size: 13,
        weight: '600',
        color: $POINT_BLUE
      })};

      &.close {
        color: ${$FONT_COLOR};
      }

      &:not(.close):hover {
        background-color: #eceef4;
      }
    }
  }

  .block {
    position: relative;
  }

  .block-list {
    padding: 9px 0 14px;

    &.section {
      padding: 0;
    }
    
    &.detail {
      margin-right: -15px;
      padding: 0 0 0 15px;
      border-left: 1px solid ${$BORDER_COLOR};

      .block {

        & ~ .block {
          padding-left: 0;
        }

        &:first-child {
          padding: 10px 15px 0 0;
        }
      }

      .detail {

      }
    }

    .form {
      margin-top: 9px;
      padding-left: 15px;
      border-left: 1px solid ${$BORDER_COLOR};
    }

    .block {
      padding: 0 15px;

      & ~ .block {
        margin-top: 14px;
        padding: 10px 15px 0;
        border-top: 1px solid #eee;
      }
    }

    .reference {
      display: block;
      color: ${$POINT_BLUE};
    } 
  }
  

  .form {

    &.input + .block-list {
      padding-top: 14px;
    }

    &.textarea + .block-list {
      padding-top: 10px;
    }
  }

  p {
    font-size: inherit;
    line-height: inherit;

    span {
      vertical-align: middle;
    }

    &.blind {
      ${fontStyleMixin({
        color: $TEXT_GRAY,
        size: 14
      })};
      
      img {
        vertical-align: middle;
        width: 19px;
        height: 12px;
      }
    }
  }

  .btn {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    font-size: 0;

    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      line-height: normal;
      ${fontStyleMixin({
        size: 11,
        weight: '600',
        color: '#999'
      })};
      cursor: pointer;

      & ~ li {
        margin-left: 12px;

        &::before {
          position: absolute;
          left: -6px;
          top: 50%;
          width: 1px;
          height: 8px;
          margin-top: -3px;
          background-color: ${$BORDER_COLOR};
          vertical-align: middle;
          content: '';
        }
      }

      &.close {
        color: ${$GRAY};
      }

      &:first-child:hover {
        text-decoration: underline;
      }
    }
  }

  .none-select {
    -webkit-touch-callout: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  }
`;

interface Props {
  wikiCode?: string;
  createBlockForm?: (resultBlock: IBlockProps, targetId?: string) => void;
  updateBlockForm?: (resultBlock: IBlockProps, targetId: string) => void;
  deleteBlockForm?: (deletedId: string, depth?: number) => void;
  depth: number;
  parentBlockId?: string;
  blocks?: object[];
  decoFn?: (id: string, depth: number) => React.ReactNode | null;
}

interface IBlockItemProps {
  id: string;
}

const BlockList = React.memo<Props>(({
  wikiCode,
  depth = 0,
  decoFn,
  blocks = [],
  createBlockForm,
  updateBlockForm,
  deleteBlockForm
}) => {
  return (
    <BlockWrapperDiv
      className={cn('block-list', depth === 0
        ? `section`
        : depth > 1 && `detail`
      )}
      as={depth === 0 ? `section` : `div`}
    > 
      {blocks.map((block:IBlockItemProps) => {
        const {id} = block;
        
        return (
          <Block
            {...block}
            id={id}
            key={id}
            depth={depth}
            decoFn={decoFn}
            wikiCode={wikiCode}
            createBlockForm={createBlockForm}
            updateBlockForm={updateBlockForm}
            deleteBlockForm={deleteBlockForm}
          />
        )
      })}
    </BlockWrapperDiv>
  );
});
BlockList.displayName = 'BlockList';
export default BlockList;