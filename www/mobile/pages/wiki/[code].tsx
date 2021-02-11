import React from 'react';
import cn from 'classnames';
import {useSelector} from 'react-redux';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {useQuery} from '@apollo/react-hooks';
import {Mutation} from '@apollo/react-components';
import BlockList from '../../components/wiki/block/BlockList';
import BlockSectionForm from '../../components/wiki/block/BlockSectionForm';
import Bookmark from '../../_pages/wiki/Bookmark';
import {WIKI_BOOKMARK_SWITCH, WIKI, WIKI_GUEST, CREATE_BLOCK} from '../../src/gqls/wiki';
import Tag from '../../components/UI/tag/Tag';
import OGMetaHead from '../../components/OGMetaHead';
import Page404 from '../../components/errors/Page404';
import Loading from '../../components/common/Loading';
import {toDateFormat} from '../../src/lib/date';
import {numberWithCommas} from '../../src/lib/numbers';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $WHITE, $TEXT_GRAY, $POINT_BLUE, $GRAY} from '../../styles/variables.types';
import {staticUrl} from "../../src/constants/env";
import {Waypoint} from 'react-waypoint';
import NoContentText from '../../components/NoContent/NoContentText';

const PageContainerDiv = styled.div`
  width: 100%;
  box-sizing: border-box;
  background-color: #f6f7f9;
  overflow: hidden;

  @media screen and (min-width: 900px) {
    padding-top: 8px;
  }

  & > h2 {
    position: relative;
    padding: 15px 51px 15px 15px;
    border-bottom: 1px solid #eee;
    background-color: ${$WHITE};
    ${fontStyleMixin({
      size: 18,
      weight: 'bold'
    })};

    &.fixed {
      margin-bottom: 46px;
    }

    &.no-content {
      border-bottom: 2px solid #b3c4ce;
    }

    p {
      display: inline-block;
      vertical-align: middle;
      margin: 0 4px 0 6px;
      ${fontStyleMixin({
        size: 11,
        weight: '600',
        color: $GRAY
      })};
    }

    ul {
      li {
        display: inline-block;

        & ~ li {
          margin-left: 3px;
        }
      }
    }

    span {
      white-space: nowrap;
      ${fontStyleMixin({
        size: 11,
        weight: '600',
        color: $TEXT_GRAY
      })};
    }
    
    .bookmark {
      position: absolute;
      top: 17px;
      right: 18px;

      img {
        width: 15px;
      }
    }
  }
`;

const WikiWrapperDiv = styled.div`
  position: relative;
  min-height: 346px;
  background-color: ${$WHITE};
  overflow: hidden;
  
  @media screen and (min-width: 900px) {
    width: 900px;
    margin: 20px auto 30px;
    border: 1px solid #eee;
  }

  section {
    position: relative;

    & ~ section {
      h3 {
        border-top: 1px solid ${$BORDER_COLOR};
      }
    }

    .section-target {
      position: absolute;
      top: -99px;
      width: 0;
      height: 0;
      opacity: 0;
      z-index: -1;
    }

    h3 {
      position: relative;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      background-color: #f3f4f7;
      box-sizing: border-box;
      ${fontStyleMixin({
        size: 15,
        weight: '600'
      })};
    }

    &.block-form-add {
      &:last-child {
        button.add {
          margin-bottom: 30px;
        }
      }
      
      h3 {
        border-bottom: 1px solid ${$BORDER_COLOR};
      }
      
      button.add {
        display: block;
        width: 150px;
        height: 40px;
        margin: 30px auto 0;
        border: 1px solid ${$BORDER_COLOR};
        background-color: #f3f4f7;
        ${fontStyleMixin({
          size: 14,
          weight: '600',
          color: $GRAY
        })};

        img {
          vertical-align: middle;
          width: 17px;
          margin: -3px 0 0 4px;
        }
      }

      &.no-content-box h3 {
        border-bottom: 0;
      }
    }

    &.clean-wrapper {
      padding: 12px 15px 30px;

      h3 {
        height: auto;
        line-height: inherit;
        padding: 0 0 6px;
        border: 0;
        background-color: transparent;
      }
    }
    
    .block-list h3 {
      height: auto;
      margin-bottom: 5px;
      padding: 0;
      line-height: inherit;
      border-width: 0;
      background-color: transparent;

      button {
        display: none;
      }
    }

    & > p {
      position: relative;
      font-size: 15px;
      padding: 10px 15px;
      background-color:${$WHITE};
    }
  }

  .block {
    .target {
      display: inline-block;
    }
  }
  
  .no-content {
    padding-top: 75px;
  }
`;


const DrugListDiv = styled.div`
  position: relative;
  padding: 10px 15px 30px;

  h4 {
    width: 80px;
    height: 30px;
    line-height: 30px;
    border-radius: 2px 2px 0 0;
    ${fontStyleMixin({
      size: 13,
      color: $WHITE
    })};
    text-align: center;
    background-color: #b3c4ce;
  }

  & > ul {
    border-top: 1px solid #b3c4ce;
  }
  
  ul {
    border-top: 1px solid #b3c4ce;
  }
  
  li {
    width: 100%;
    border-bottom: 1px solid ${$BORDER_COLOR};
    position: relative;
    
    .drug-item {
      display:table;
      table-layout: fixed;
      width:100%;
      padding:10px 0;
      box-sizing:border-box;
      
      & > div {
        display:table-cell;
        width:auto;
        padding:0 10px;
        vertical-align: middle;
        
        &.index {
          width: 50px;
          text-align: center;
        }
        
        &.price {
          width:40%;
          font-size: 15px;
          font-weight: bold;
          text-align: right;
        }
        
        i {
          text-align: center;
          font-size: 30px;
          color: #b0d2f2;
          font-style:normal;
        }
        
        h5 {
          display: inline-block;
          position: relative;
          vertical-align: middle;
      
          a {
            text-decoration: underline;
            ${fontStyleMixin({
              size: 15,
              color: '#195da3',
            })};
          }
        }
      }
    }
  }
`;

const ProductDiv = styled.div`
  position: relative;
  padding: 0 0 15px 10px;

  &:first-child {
    padding-top: 30px;

    h5 {
      padding-top: 30px;
    }
  }
  
  h4 {
    font-size: 15px;
    font-weight: 600;
    padding: 10px 0 7px;
    border-bottom: 2px solid #b3c4ce;
  }
`;

const ProductListUl = styled.ul`
  & > li {
    position: relative;
    border-bottom: 1px solid #ddd;
    padding:15px 10px;
    
    .head {
      position: relative;
      padding-right:150px;
      
      h5 {
        font-size: 15px;
      }
      span {
        position: absolute;
        right:10px;
        top:0;
        color: #195da3;
        font-size: 13px;
      }
    }
    
    .content {
      margin-top:3px;
      dl {
        position: relative;
        float:left;
        color: ${$FONT_COLOR};
        font-size: 0;
        
        & ~ dl {
          margin-left: 16px;
          
          &::before {
            position:absolute;
            left:-8px;
            top:50%;
            width:1px;
            height:12px;
            margin-top: -6px;
            background-color: ${$BORDER_COLOR};
            content: '';
          }
        }
        
        dt,dd {
          display:inline-block;
          font-size: 13px;
        }
        
        dt {
           color:#999;
           
           & ~ dd {
             margin-left: 10px;
           }
        }
      }
    }
  }
`;

const NavigateNav = styled.div`
  position: relative;
  height: 44px;
  border-bottom: 2px solid #90b0d7;
  background-color: ${$WHITE};

  .list-box {
    position: relative;
    height: 44px;
    padding: 0 60px 0 15px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;

    li {
      display: inline-block;
      padding: 10px 0 12px;

      & ~ li {
        margin-left: 15px;
      }

      a {
        ${fontStyleMixin({
          size: 15,
          weight: 'bold',
          color: $TEXT_GRAY
        })};
      }

      &.on {
        text-decoration: underline;
        a {
          color: ${$POINT_BLUE};
        }
      }
    }
  }

  > span {
    position: absolute;
    right: 0;
    top: 0;
    width: 44px;
    height: 44px;
    border-left: 1px solid #eee;
    background-color: ${$WHITE};
    box-sizing: border-box;    

    img {
      transition: all 0.2s;
    }
  }

  div {
    ${heightMixin(44)};
    text-align: center;
    border-bottom: 1px solid #ccc;
    background-color: ${$WHITE};
    ${fontStyleMixin({
      size: 14,
      weight: '600',
      color: $GRAY
    })};

    img {
      vertical-align: middle;
      width: 15px;
      height: 15px;
      margin: -3px 0 0 4px;
    }
  }
  
  &.on {
    z-index: 1;
    
    ul {
      height: auto;
      max-height: 252px;
      padding: 4px 15px;
      border-bottom: 1px solid ${$BORDER_COLOR};
      background-color: ${$WHITE};
      overflow: inherit;
      overflow-y: auto;
      
      li {
        display: block;
        padding: 6px 0;
        
        & ~ li {
          margin-left: 0;
        }
      }
    }

    > span {
      border-bottom: 1px solid #eee;
      background-color: #f9f9f9;
      z-index: 1;

      img {
        transform: rotate(-180deg);
      }
    }
  }

  &.fixed {
    position: fixed;
    top: 54px;
    width: 100%;
    z-index: 200;
  }
`;

const StyledTag = styled(Tag)`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
  margin-top: 4px;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #edf5ff;
  z-index: 1;
  
  ${fontStyleMixin({
    size: 13,
    weight: 'normal',
    color: $FONT_COLOR
  })};
`;

const DISPLAY_CONTENTS = [
  'shapes',
  'tags',
  'blocks',
  'products',
  'dependencies'
];

const WikiDetail = React.memo(() => {
  const access = useSelector(
    ({system: {session: {access}}}) => access,
  );
  const router = useRouter();
  const {query: {code}} = router;
  const {loading, error, data: {wiki} = {}, updateQuery} = useQuery(
    access 
      ? WIKI
      : WIKI_GUEST, 
    {
    variables: {code}
  });

  const [heightFixed, setHeightFixed] = React.useState(false);
  const [toggle, setToggle] = React.useState(false);
  const [isCreateSection, setIsCreateSection] = React.useState(false);
  
  const deleteBlockForm = (deletedId, depth = 0) => {
    updateQuery((data) => {
      const {wiki, ...rest} = data;

      return {
        ...rest,
        wiki: {
          ...wiki,
          blocks: depth === 0
            ? // section
              wiki.blocks.filter(({id: blockId}) => blockId !== deletedId)
            : // article
              wiki.blocks.map(({
                blocks, 
                ...rest
              }) => {
                return {
                  ...rest,
                  blocks: blocks.filter(({id: childId}) => childId !== deletedId)
                }  
              })
        }
      }
    })
  };

  const updateBlockForm = (updatedBlock, targetId) => {
    updateQuery((data) => {
      const {wiki, ...rest} = data;
      
      return { // article
        ...rest,
        wiki: {
          ...wiki,
          blocks: wiki.blocks.map((block) => {
            const {
              id,
              blocks = []
            } = block;

            if(id === targetId) {
              return {
                ...block,
                ...updatedBlock
              };
            }
            return {
              ...block,
              blocks: blocks.map(childBlock => {
                const {
                  id: childId,
                } = childBlock;

                return childId === targetId 
                  ? {
                    ...childBlock,
                    ...updatedBlock
                    } 
                  : childBlock
              })
            }   
          })
        }
      };
    });
  };

  const createBlockForm = (createdBlock, targetId) => {
    updateQuery((data) => {
      const {wiki, ...rest} = data;
      
      return !targetId ? { //section
        ...rest, 
        wiki: {
          ...wiki,
          blocks: [...wiki.blocks, createdBlock]
        }
      } : { // article
        ...rest,
        wiki: {
          ...wiki,
          blocks: wiki.blocks.map((block) => {
            const {
              id,
              blocks = []
            } = block;
            
            return id === targetId 
              ? {
                ...block, 
                blocks:  [createdBlock, ...blocks]}
              : {...block, blocks};
          })}
      };
    });
  };


  if (loading) return <Loading/>;
  if (error) return <Page404/>;
  const {
    name,
    chn_name,
    other_name,
    is_bookmarked = false,
    shapes = [],
    blocks = [],
    dependencies = [],
    tags = [],
    products = []
  } = wiki;

  const isNoContent = DISPLAY_CONTENTS.every(item => isEmpty(wiki[item]));

  return (
    <>
      <OGMetaHead title={name}/>
      <PageContainerDiv>        
        <Waypoint
          topOffset={55}
          onEnter={() => setHeightFixed(false)}
          onLeave={() => setHeightFixed(true)}
        >
          <h2 className={cn({fixed: heightFixed, 'no-content': isNoContent})}>
            {name}{chn_name}
            <p>
              <ul>
                {shapes.map(({name}, idx) => (
                  <li key={idx}>
                    {name}
                  </li>
                ))}
              </ul>
            </p>
            <span>{code}</span>
            {access && (
              <span className="bookmark">
                <Mutation mutation={WIKI_BOOKMARK_SWITCH}>
                  {(switchBookmark) => (
                    <Bookmark
                      as="span"
                      is_bookmarked={is_bookmarked}
                      onClick={() => {
                        switchBookmark({
                          variables: {code}
                        })
                        .then(({data: {wikiBookmark: {updated_wiki}}}) => {
                          if(updated_wiki === null) {
                            updated_wiki = {
                              is_bookmarked: false
                            }
                          }
                          updateQuery((data) => {
                            const {wiki, ...rest} = data;
                            return {
                              ...rest,
                              wiki: {
                                ...wiki,
                                ...updated_wiki
                              }
                            }
                          })
                        })
                      }}
                    >
                    </Bookmark>
                  )}
                </Mutation>
              </span>
            )}
          </h2>
        </Waypoint>
        {!isNoContent && (
          <NavigateNav className={cn({on: toggle, fixed: heightFixed})}>
            <ul className="list-box">
              {!isEmpty(shapes) && (
                <li>
                  <Link href="#shapes">
                    <a>제형</a>
                  </Link>
                </li>
              )}
              {!isEmpty(dependencies) && (
                <li>
                  <Link href="#dependencies">
                    <a>약재구성</a>
                  </Link>
                </li>
              )}
              {!isEmpty(blocks) && blocks.map(({id,head}) => (
                <li key={id}>
                  <Link href={`#${id}`}>
                    <a>{head}</a>
                  </Link>
                </li>
              ))}
              {!isEmpty(tags) && (
                <li>
                  <Link href="#tags">
                    <a>태그</a>
                  </Link>
                </li>
              )}
              {!isEmpty(products) && (
                <li>
                  <Link href="#products">
                    <a>가격정보</a>
                  </Link>
                </li>
              )}
            </ul>
            <span onClick={() => setToggle(curr => !curr)}>
              <img
                src={staticUrl('/static/images/icon/arrow/icon-wiki-arrow.png')}
                alt="arrow"
              />
            </span>
            {toggle && (
              <Link href="#registration">
                <a>
                  <div>
                    항목 등록
                    <img
                      src={staticUrl('/static/images/icon/icon-wiki-plus.png')}
                      alt="항목 등록"
                    />
                  </div>
                </a>
              </Link>
            )}
          </NavigateNav>
        )}
        <WikiWrapperDiv>
          {isNoContent
            ? (
              <section className="block-form-add no-content-box">
                {!isCreateSection ? (
                  <NoContentText
                    alt="등록된 정보가 없습니다."
                  >
                    <p>
                      등록된 정보가 없습니다. <br/>
                      항목등록을 통해 새로운 정보를 등록해 주세요!
                    </p>
                    <button
                      className="add"
                      onClick={() => {setIsCreateSection(true)}}
                    >
                      항목 등록
                      <img
                        src={staticUrl('/static/images/icon/icon-wiki-plus.png')}
                        alt="항목 등록"
                      />
                    </button>
                  </NoContentText>
                ) : (
                  <h3>
                    <Mutation mutation={CREATE_BLOCK}>
                      {(createSection) => (
                        <BlockSectionForm
                          className={cn({cancel: isCreateSection})}
                          addBtn={(
                            <button
                              type="button"
                              className="cencel"
                              onClick={() => {
                                setIsCreateSection(false);
                              }}
                            >
                              취소
                            </button>
                          )}
                          onSave={head => {
                            createSection({
                              variables: {
                                head,
                                wiki: code,
                                block_type: 'section',
                                parent: ''
                              }
                            })
                            .then(({data: {blockForm: {block}}}) => {
                              createBlockForm(block, null)  
                            })
                          }}
                        />
                      )}
                    </Mutation>
                  </h3>
                )}
              </section>
            )
            : (
              <div>
                {!isEmpty(shapes) && (
                  <section>
                    <span 
                      id="shapes"
                      className="section-target"
                    />
                    <h3>제형</h3>
                    <p>
                      <ul>
                        {shapes.map(({name}, idx) => (
                          <li key={idx}>
                            {name}
                          </li>
                        ))}
                      </ul>
                    </p>
                  </section>
                )}
                {!isEmpty(dependencies) && (
                  <section>
                    <span 
                      id="dependencies"
                      className="section-target"
                    />
                    <h3>약재구성</h3>
                    <div>
                      <DrugListDiv>
                        <h4>주약재</h4>
                        <ul>
                          {dependencies.map(({child: {code: childCode, name: childName, products__price__avg}, qnt_text, gram_per_chup}, idx) => (
                            <li key={idx}>
                              <div className="drug-item">
                                <div className="index">
                                  <i>{idx + 1}</i>
                                </div>
                                <div>
                                  <h5>
                                    <Link href={`/wiki/${childCode}`}>
                                      <a>{childName}</a>
                                    </Link>
                                  </h5>
                                  <p>
                                    <span>약재량</span>{qnt_text}/{gram_per_chup}g
                                  </p>
                                </div>
                                <div className="price">
                                  <strong>
                                    {!products__price__avg
                                      ? '-'
                                      : `${numberWithCommas(products__price__avg * gram_per_chup)} 원`
                                    }
                                  </strong>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </DrugListDiv>
                    </div>
                  </section>
                )}
                <BlockList
                  wikiCode={code}
                  createBlockForm={createBlockForm}
                  deleteBlockForm={deleteBlockForm}
                  updateBlockForm={updateBlockForm}
                  depth={0}
                  blocks={blocks}
                  bookmarkOnImg={staticUrl('/static/images/icon/icon-bookmark-on.png')}
                  bookmarkOffImg={staticUrl('/static/images/icon/icon-bookmark.png')}
                  decoFn={(id, depth) => (
                    depth === 0 &&
                      <span 
                        id={id}
                        className="section-target"
                      />
                  )}
                />
                {access && (
                  <section className="block-form-add">
                    <span 
                      id="registration"
                      className="section-target"
                    />
                    {isCreateSection ? (
                      <h3>
                        <Mutation mutation={CREATE_BLOCK}>
                          {(createSection) => (
                            <BlockSectionForm
                              className={cn({cancel: isCreateSection})}
                              addBtn={(
                                <button
                                  type="button"
                                  className="cencel"
                                  onClick={() => {
                                    setIsCreateSection(false);
                                  }}
                                >
                                  취소
                                </button>
                              )}
                              onSave={head => {
                                createSection({
                                  variables: {
                                    head,
                                    wiki: code,
                                    block_type: 'section',
                                    parent: ''
                                  }
                                })
                                .then(({data: {blockForm: {block}}}) => {
                                  createBlockForm(block, null)  
                                })
                              }}
                            />
                          )}
                        </Mutation>
                      </h3>
                    ) : (
                      <button
                        className="add"
                        onClick={() => {setIsCreateSection(true)}}
                      >
                        항목 등록
                        <img
                          src={staticUrl('/static/images/icon/icon-wiki-plus.png')}
                          alt="항목 등록"
                        />
                      </button>
                    )}
                  </section>
                )}
                {!isEmpty(tags) && (
                  <section className="clean-wrapper">
                    <span 
                      id="tags"
                      className="section-target"
                    />
                    <h3>태그</h3>
                    <div className="tag-wrapper">
                      {tags.map(({id, name}) => (
                        <StyledTag
                          key={id}
                          name={name}
                          onClick={() => {
                            router.push(`/wiki?q=${name}`)
                          }}
                        />
                      ))}
                    </div>
                  </section>
                )}
                {!isEmpty(products) && (
                  <ProductDiv>
                    <span 
                      id="products"
                      className="section-target"
                    />
                    <h4>가격정보</h4>
                    <ProductListUl>
                      {products.filter(({is_active}) => is_active).map(({id, base_date, name, price, product_area, seller}) => (
                        <li key={id}>
                          <div className="head">
                            <h5>{name}</h5>
                            <span>
                              1g당 <strong>{price}</strong>원
                            </span>
                          </div>
                          <div className="content clearfix">
                            <dl>
                              <dt>판매처</dt>
                              <dd>{seller}</dd>
                            </dl>
                            <dl>
                              <dt>원산지</dt>
                              <dd>{product_area}</dd>
                            </dl>
                            <dl>
                              <dt>기준일</dt>
                              <dd>{toDateFormat(base_date, 'YYYY년 MM월 DD일')}</dd>
                            </dl>
                          </div>
                        </li>
                      ))}
                    </ProductListUl>
                  </ProductDiv>
                )}
              </div>
            )
          }
        </WikiWrapperDiv>
      </PageContainerDiv>
    </>
  )
});

WikiDetail.displayName = 'WikiDetail';


export default WikiDetail;
