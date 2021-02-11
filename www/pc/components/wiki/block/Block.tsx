import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import cn from 'classnames';
import styled from 'styled-components';
import {Query} from "@apollo/react-components";
import {useMutation} from '@apollo/react-hooks';
import BlockList from './BlockList';
import BlockTextForm from './BlockTextForm';
import Bookmark from '../../../_pages/wiki/Bookmark';
import KeyWordHighlight from '../../common/KeyWordHighlight';
import {BLOCK_BOOKMARK, BLOCK_CHILDREN, CREATE_BLOCK, UPDATE_BLOCK, DELETE_BLOCK, REPORT_BLOCK} from '../../../src/gqls/wiki';
import Loading from '../../common/Loading';
import BlockSectionForm from './BlockSectionForm';
import {useDispatch, useSelector} from 'react-redux';
import {pushPopup} from '../../../src/reducers/popup';
import ReportPopup from '../../layout/popup/ReportPopup';
import {staticUrl} from '../../../src/constants/env';

export const HoverActWrapperSpan = styled.span`
  position: relative;
  display: inline-block;
  padding-right: 20px;
  font-size: 15px;
  line-height: 20px;

  .btn li.target {
    display: none;
  }

  &:hover,
  &.on {
    .btn li.target {
      display: inherit;
    }
  }

  .icon-bookmark {
    position: absolute;
    right: -17px;
    top: -7px;
    font-size: 0;
    display: inline-block;

    span {
      vertical-align: middle;
    }
  }
`;

export interface IBlockProps {
  wikiCode?: string;
  parentBlockId?: string;
  id: string;
  head?: string | null;
  text?: string;
  book_reference?: string | null;
  depth?: number;
  blocks?: object[];
  children_count?: number;
  is_writer: boolean;
  is_bookmarked?: boolean;
  bookmark?: {
    offset_range: number[]
  };
  status: string,
  blind_reason: string;
  is_reported: boolean;
  createBlockForm?: (resultBlock: IBlockProps, targetId?: string) => void;
  updateBlockForm?: (resultBlock: IBlockProps, targetId: string) => void;
  deleteBlockForm?: (deletedId: string, depth?: number) => void;
  decoFn?: (id: string, depth: number) => React.ReactNode | null;
}

const BLIND_REQUESTEROR_TYPE = {
  'privy': '당사자',
  'reported': '신고',
  'admin': '관리자'
}

const Block = React.memo<IBlockProps>((block) => {
  const {
    wikiCode,
    id,
    head,
    text,
    book_reference,
    depth = 0,
    blocks = [],
    children_count,
    status,
    bookmark,
    is_bookmarked,
    is_writer,
    is_reported,
    blind_reason,
    decoFn,
    createBlockForm,
    updateBlockForm,
    deleteBlockForm,
  } = block;

  const dispatch = useDispatch();
  const {access} = useSelector(({system: {session: {access}}}) => ({access}));
  const [isOpen, setIsOpen] = React.useState(!isEmpty(blocks));
  const [isEdit, setIsEdit] = React.useState(false);
  const [isAddBlockForm, setIsAddBlockForm] = React.useState(depth === 0 ? false : true);
  const [switchBookmark] = useMutation(BLOCK_BOOKMARK, {
    onCompleted: ({blockBookmark: {updated_block}}) => {
      if(updated_block === null) {
        updated_block = {
          is_bookmarked: false,
        };
      }
      updateBlockForm && updateBlockForm(updated_block, id)
    }
  });
  const [createBlock] = useMutation(CREATE_BLOCK);
  const [updateBlock] = useMutation(UPDATE_BLOCK);
  const [deleteBlock] = useMutation(DELETE_BLOCK);
  const [reportBlock] = useMutation(REPORT_BLOCK);
  
  const {offset_range: [offsetStart, offsetEnd]} = bookmark || {offset_range: [0, 0]};

  return (
    <div className="block">
      {status === 'blinded' && (
        <p className="blind">
          <img
            src={staticUrl('/static/images/icon/icon-blind.png')}
            alt="블라인드"
          />
          {BLIND_REQUESTEROR_TYPE[blind_reason] || '신고'}에 의해 블라인드 처리 된 글 입니다.
        </p>
      )}
      {status === 'active' && (
        <>
          {decoFn && decoFn(id, depth)}
          {head && (
            <h3>
              {isEdit ? (
                <BlockSectionForm
                  head={head}
                  addBtn={(
                    <button
                      type="button"
                      onClick={() => {
                        setIsEdit(false);
                      }}
                    >
                      취소
                    </button>
                  )}
                  onSave={head => {
                    updateBlock({
                      variables: {
                        head,
                        block_type: 'section',
                        wiki: wikiCode,
                        id,
                      }
                    })
                    .then(({data: {blockForm: {block}}}) => {
                      updateBlockForm && updateBlockForm(block, id);
                      setIsEdit(false);
                    })
                  }}
                />
              ) : head}
              {(depth === 0 && !isEdit) && (
                <>
                  <ul className="btns">
                    {is_writer ? (
                      <>
                        <li
                          onClick={() => {
                            setIsEdit(true);
                          }}
                        >
                          수정
                        </li>
                        <li
                          onClick={() => {
                            if(confirm('삭제하시겠습니까?')) {
                              deleteBlock({
                                variables: {id}
                              })
                              .then(({data: {deleteBlock: {is_succeed, message}}}) => {
                                if(is_succeed) deleteBlockForm(id, depth)
                                else alert(message);
                              })
                            } 
                          }}
                        >
                          삭제
                        </li>
                      </>
                    ) : (!is_reported && access) && (
                      <li 
                        className="report"
                        onClick={() => {
                          dispatch(pushPopup(ReportPopup, {
                            onClick: (form) => {
                              reportBlock({
                                variables: {
                                  ...form,
                                  block_id: id
                                }
                              })
                              .then(({data: {reportBlock: {is_succeed, message, block: resultBlock}}}) => {
                                alert(is_succeed ? '정상적으로 신고 되었습니다.\n5회 이상 신고 시 블라인드 처리 됩니다.' : message);
                                is_succeed && updateBlockForm({
                                  ...block,
                                  ...resultBlock
                                }, id);
                              })
                            },
                          }));
                        }}
                      >
                        신고
                      </li>
                    )}
                  </ul>
                  <span
                    className={cn({close: isAddBlockForm})}
                    onClick={() => setIsAddBlockForm(curr => !curr)}>
                    {!isAddBlockForm ? ('정보 추가') : ('닫기')}
                  </span>
                </>
              )}          
            </h3>
          )}
          {text && (
            <>
            {isEdit ? (
              <BlockTextForm
                isActive
                text={text}
                addBtn={(
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEdit(false);
                    }}
                  >
                    취소
                  </button>
                )}
                onSave={text => {
                  updateBlock({
                    variables: {
                      text,
                      block_type: depth === 0 ? 'section' : 'article',
                      wiki: wikiCode,
                      id,
                    }
                  })
                  .then(({data: {blockForm: {block}}}) => {
                    updateBlockForm && updateBlockForm(block, id);
                    setIsEdit(false);
                  })
                }}
              />
            ) : (
              <p>
                {book_reference && (
                  <strong className="reference">{`[출전] ${book_reference}`}</strong>
                )}
                <HoverActWrapperSpan className={cn('pre-line',{
                  on: is_bookmarked
                })}>
                  {is_bookmarked ? (
                    <KeyWordHighlight
                      text={text}
                      keyword={
                        (is_bookmarked && offsetStart === offsetEnd)
                          ? text
                          : text.slice(offsetStart, offsetEnd)
                      }
                      color="#FFFDF0"
                      background
                      onHighlightClick={() => {
                        if (confirm('북마크를 해제하시겠습니까?')) {
                          switchBookmark({
                            variables: {
                              block_id: id,
                              offset_range: [offsetStart, offsetEnd]
                            }
                          });
                        } 
                      }}
                    />
                  ) : (
                    <span>{text}</span>
                  )}
                  &nbsp;
                  <ul className="btn none-select">
                    <li
                      className={cn({
                        close: isOpen
                      })}
                      onClick={() => {
                        setIsOpen(curr => !curr);
                      }}
                    >
                      {isOpen ? `닫기` : `더보기(${children_count})`}
                    </li>
                    {is_writer ? (
                      <>
                        <li
                          className="target"
                          onClick={() => setIsEdit(true)}
                        >
                          수정
                        </li>
                        <li
                          className="target"
                          onClick={() => {
                            if(confirm('삭제하시겠습니까?')) {
                              deleteBlock({
                                variables: {id}
                              })
                              .then(({data: {deleteBlock: {is_succeed, message}}}) => {
                                if(is_succeed) deleteBlockForm(id, depth)
                                else alert(message);
                              })
                            }
                          }}
                        >
                          삭제
                        </li>
                      </>
                    ) : (!is_reported && access) && (
                      <li
                        className="target"
                        onClick={() => {
                          dispatch(pushPopup(ReportPopup, {
                            onClick: (form) => {
                              reportBlock({
                                variables: {
                                  ...form,
                                  block_id: id
                                }
                              })
                              .then(({data: {reportBlock: {is_succeed, message, block:resultBlock}}}) => {
                                alert(is_succeed ? '정상적으로 신고 되었습니다.\n5회 이상 신고 시 블라인드 처리됩니다.' : message)
                                updateBlockForm({
                                  ...block,
                                  ...resultBlock
                                }, id);
                              })
                            },
                          }));
                        }}
                      >
                        신고
                      </li>
                    )}
                    <li className="bookmark target">
                      <Bookmark
                        is_bookmarked={is_bookmarked}
                        className="icon-bookmark"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            const _selection = window.getSelection();
                            
                            switchBookmark({
                              variables: {
                                block_id: id,
                                offset_range: is_bookmarked 
                                  ? [offsetStart, offsetEnd]
                                  : [_selection.anchorOffset, _selection.focusOffset]
                              }
                            });
                          }
                        }}
                      />
                    </li>
                  </ul>
                </HoverActWrapperSpan>
              </p>
              )}
            </>
          )}
          
          {depth === 0 ? (
            <>
              {isAddBlockForm && (
                <>
                <BlockTextForm
                  isActive
                  onSave={text => {
                    createBlock({
                      variables: {
                        text,
                        block_type: 'section',
                        wiki: wikiCode,
                        parent: id
                      }
                    })
                    .then(({data: {blockForm: {block}}}) => {
                      createBlockForm && createBlockForm(block, id);
                    })
                  }}
                />
                </>
              )}
              <BlockList
                wikiCode={wikiCode}
                parentBlockId={id}
                depth={depth + 1}
                blocks={blocks}
                createBlockForm={createBlockForm}
                updateBlockForm={updateBlockForm}
                deleteBlockForm={deleteBlockForm}
              />
            </>
          ) : isOpen ? (
            <Query
              query={BLOCK_CHILDREN}
              variables={{id}}
            >
              {({data, loading, updateQuery}) => {
                if (loading) return <Loading/>;

                const {
                  block: {blocks = []}
                } = data;

                const _createBlockForm = (resultBlock) => {
                  updateQuery(({block, ...rest}) => {
                    const {
                      blocks = [],
                      children_count,
                    } = block;                    
                    return {
                      ...rest,
                      block: {
                        ...block,
                        children_count: children_count + 1,
                        blocks: [resultBlock, ...blocks]
                      }
                    }
                  })

                  updateBlockForm({
                    ...block,
                    children_count: children_count + 1,
                  }, id)
                }

                const _updateBlockForm = (resultBlock, targetId) => {
                  updateQuery(({block, ...rest}) => {
                    const {
                      blocks = [],
                    } = block;
                    return {
                      ...rest,
                      block: {
                        ...block,
                        blocks: blocks.map((childBlock) => {
                          const {id: childId} = childBlock;

                          if(childId === targetId) return {
                            ...childBlock,
                            ...resultBlock,
                          }
                          return childBlock;
                        })
                      }
                    }
                  })
                }
                
                const _deleteBlockForm = (targetId) => {
                  updateQuery(({block, ...rest}) => ({
                    ...rest,
                    block: {
                      ...block,
                      blocks: blocks.filter(({id}) => id !== targetId)
                    }
                  }))
                  updateBlockForm({
                    ...block,
                    children_count: children_count - 1,
                  }, id)
                }
                
                return (
                  <>
                    {isOpen && (
                      <BlockTextForm
                        isActive={false}
                        onSave={text => {
                          createBlock({
                            variables: {
                              text,
                              block_type: 'article',
                              wiki: wikiCode,
                              parent: id
                            }
                          })
                          .then(({data: {blockForm: {block:resultBlock}}}) => {
                            _createBlockForm && _createBlockForm(resultBlock);
                          })
                        }}
                      />
                    )}
                    <BlockList
                      wikiCode={wikiCode}
                      parentBlockId={id}
                      depth={depth + 1}
                      blocks={blocks}
                      createBlockForm={_createBlockForm}
                      deleteBlockForm={_deleteBlockForm}
                      updateBlockForm={_updateBlockForm}
                    />
                  </>
                )
              }}
            </Query>
          ): null}
        </>
      )}
    </div>
  );
});
Block.displayName = 'Block';

export default Block;
