import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import Block, {IBlockProps} from './Block';
import {$BORDER_COLOR,$POINT_BLUE, $GRAY, $TEXT_GRAY} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {MoreBtn, LayerPopUpUl} from '../../story/common2';

const BlockWrapperDiv = styled.div`
  box-sizing: border-box;
  font-size: 14px;
  line-height: 22px;
  
  h3 {
    & + .form {
      margin: 12px 15px 0;
    }

    ${MoreBtn} {
      top: 6px;
      right: 8px;
      font-size: 0;
      transform: rotate(90deg);
    }

    ${LayerPopUpUl} {
      top: 39px;
      line-height: normal;
      z-index: 2;

      li {
        padding: 12px 15px 11px 45px;

        span {
          margin-top: -3px;
        }
      }
    }
  }

  .block-list {
    padding: 9px 15px 12px; 

    &.section {
      padding: 0;
    }
    
    &.detail {
      padding: 0 0 0 15px;
      border-left: 1px solid ${$BORDER_COLOR};

      .block {
        & ~ .block {
          padding: 9px 0 0;
        }

        &:first-child {
          padding-top: 8px;
        }
      }
    }

    .form {
      margin: 9px 0 0;
      padding-left: 12px;
      border-left: 1px solid ${$BORDER_COLOR};

      &.input + .block-list {
        padding-top: 14px;
      }

      &.textarea + .block-list {
        padding-top: 10px;
      }
    }

    .block ~ .block {
      margin-top: 10px;
      padding: 9px 0 0;
      border-top: 1px solid #eee;
    }

    .reference {
      display: block;
      color: ${$POINT_BLUE};
    } 
  }

  .block {
    position: relative;
  
    .target {
      position:absolute;
      right: 0;
      top: 3px;
      font-size: 0;
      
      img {
        height: 18px;
      }
    }

    .none-select {
      -webkit-touch-callout: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-user-select: none;
      user-select: none;
    }
  }

  p {
    position: relative;
    font-size: 15px;
    line-height: normal;

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
    display: inline-block;
    vertical-align: middle;
    font-size: 0;

    li {
      display: inline-block;
      vertical-align: middle;
      margin-top: -2px;
      line-height: normal;
      ${fontStyleMixin({
        size: 11,
        weight: '600',
        color: '#999'
      })}

      & ~ li::before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        height: 8px;
        margin: 0 4px;
        border-left: 1px solid ${$BORDER_COLOR};
      }

      &.close {
        color: ${$GRAY};
        text-decoration: underline;
      }
    }
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