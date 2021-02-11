import React from 'react';
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
import {WIKI_BOOKMARK_SWITCH, WIKI, CREATE_BLOCK, WIKI_GUEST} from '../../src/gqls/wiki';
import Tag from '../../components/UI/tag/Tag';
import OGMetaHead from '../../components/OGMetaHead';
import Page404 from '../../components/errors/Page404';
import Loading from '../../components/common/Loading';
import {toDateFormat} from '../../src/lib/date';
import {numberWithCommas} from '../../src/lib/numbers';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $WHITE, $GRAY, $TEXT_GRAY, $POINT_BLUE} from '../../styles/variables.types';
import {staticUrl} from "../../src/constants/env";
import {Waypoint} from 'react-waypoint';
import classNames from 'classnames';
import useElementSize from "react-element-size";
import HashReload from "../../components/HashReload";
import useSetPageNavigation from '../../src/hooks/useSetPageNavigation';
import cn from 'classnames';
import NoContentText from '../../components/NoContent/NoContentText';

const PageContainerDiv = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 20px 0 50px;
  background-color: #f6f7f9;

  @media screen and (max-width: 1300px) {
    > div {
      margin-left: 230px;

      nav {
        z-index: 1;
      }
    }
  }
`;

const WikiWrapperDiv = styled.div`
  position: relative;
  width: 800px;
  min-height: 640px;
  margin: auto;
  padding: 20px;
  background-color: ${$WHITE};
  box-sizing: border-box;

  & > h2 {
    ${fontStyleMixin({
      size: 17,
      weight: 'bold'
    })};
    padding-bottom: 10px;
  }

  section {
    position: relative;

    .section-target {
      position: absolute;
      top: -118px;
      width: 0;
      height: 0;
      opacity: 0;
      z-index: -1;
    }

    h3 {
      position: relative;
      height: 40px;
      line-height: 39px;
      padding: 0 15px;
      background-color: #f3f4f7;
      border-top: 1px solid ${$BORDER_COLOR};
      box-sizing: border-box;
      ${fontStyleMixin({
        size: 15,
        weight: '600'
      })};
    }

    &:first-of-type {
      > h3,
      > .block:first-of-type > h3 {
        border-top: 2px solid #90b0d7;
      }
    }

    &.block-form-add {
      h3 {
        margin-bottom: 20px;
      }

      button.add {
        position: relative;
        display: block;
        width: 150px;
        height: 40px;
        margin: 12px auto 20px;
        line-height: 16px;
        ${fontStyleMixin({
          size: 14,
          weight: '600',
          color: $GRAY
        })};
        background-color: #f3f4f7;
        border: 1px solid ${$BORDER_COLOR};
        cursor: pointer;

        img {
          vertical-align: middle;
          width: 17px;
          margin: -3px 0 0 4px;
        }
      }

      .no-content {
        margin-top: 210px;

        button.add {
          margin: 32px auto 0;
        }
      }
    }

    &.clean-wrapper {
      padding: 11px 0 15px 80px;
      border-top: 2px solid #eee;
      border-bottom: 2px solid #eee;

      h3 {
        position: absolute;
        top: 0;
        left: 0;
        padding-top: 18px;
        line-height: normal;
        border: 0;
        background-color: transparent;
      }

      li {
        display: inline-block;
        vertical-align: middle;
      }
    }

    .block-list h3 {
      height: auto;
      margin-bottom: 5px;
      padding: 0;
      line-height: normal;
      border-width: 0;
      background-color: transparent;
    }
    
    & > p {
      position: relative;
      font-size: 15px;
      padding: 10px 15px;
      background-color:${$WHITE};
    }
  }
`;

const DrugListDiv = styled.div`
  position: relative;
  padding: 10px 0 30px;

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
          width: 60px;
          text-align: center;
        }
        
        &.price {
          width:10%;
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

const NavigateLayoutNav = styled.nav`
  position: absolute;
  left: -230px;
  top:0;
  height: 100%;

  & > div {
    position: fixed;
  }

  &.bottom > div {
    position: absolute;
    bottom: 0;
  }

  .title-box {
    position: relative;
    width: 210px;
    margin-bottom: 8px;
    padding: 15px 15px 34px;
    background-color: ${$WHITE};
    box-sizing: border-box;

    h2 {
      width: calc(100% - 27px);
      line-height: 23px;
      ${fontStyleMixin({
        size: 17,
        weight: 'bold'
      })};
    }

    p {
      margin-top: 3px;

      ul {
        display: inline-block;
     
        li {
          display: inline-block;
          ${fontStyleMixin({
            size: 11,
            weight: '600',
            color: $GRAY
          })};

          & ~ li {
            margin-left: 4px;
          }

          &:last-child {
            margin-right: 4px;
          }
        }
      }

      span {
        ${fontStyleMixin({
          size: 11,
          weight: '600',
          color: $TEXT_GRAY
        })};
      }
    }

    .bookmark {
      position: absolute;
      top: 19px;
      right: 15px;
    }
  }

  .list-box {
    width: 210px;
    background-color: ${$WHITE};
    box-sizing: border-box;
    overflow: hidden;

      ul {
      width: 230px;
      height: auto;
      max-height: 488px;
      margin-top: 6px;
      padding-bottom: 6px;
      border-bottom: 1px solid ${$BORDER_COLOR};
      overflow-y: scroll;
      box-sizing: border-box;

      li {
        position: relative;
        padding: 8px 15px;
        transition: all 0.2s;
        box-sizing: border-box;

        a {
          line-height: 20px;
          transition: all 0.2s;
          ${fontStyleMixin({
            size: 14,
            weight: '600'
          })};
        }

        &:hover {
          a {
            color: ${$POINT_BLUE};
          }
        }

        &.on {
          background-color: #f9f9f9;

          a {
            color: ${$POINT_BLUE};
          }
        }
      } 
    }

    div {
      ${heightMixin(44)};
      text-align: center;
      ${fontStyleMixin({
        size: 13,
        weight: '600',
        color: $GRAY
      })};
      cursor: pointer;

      img {
        vertical-align: middle;
        width: 17px;
        height: 17px;
        margin: -3px 0 0 4px;
      }
    }
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
  cursor: pointer;
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

const WikiDetail = () => {
  const access = useSelector(
    ({system: {session: {access}}}) => access,
  );

  // Custom Hooks
  useSetPageNavigation('/wiki');

  const router = useRouter();
  const {query: {code}} = router;
  const {loading, error, data: {wiki} = {}, updateQuery} = useQuery(
    access 
      ? WIKI 
      : WIKI_GUEST, 
    {
      variables: {code}
    });
  const [isCreateSection, setIsCreateSection] = React.useState(false);
  const [isNavFollow, setIsNavFollow] = React.useState(true);
  const nav = useElementSize();

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
        <WikiWrapperDiv>
          <NavigateLayoutNav
            className={classNames({
              bottom: !isNavFollow
            })}
          >
            <div ref={nav.setRef}>
              <div className="title-box">
                <h2>{name}{chn_name}</h2>
                <p>
                  <ul>
                    {shapes.map(({name}, idx) => (
                      <li key={idx}>
                        {name}
                      </li>
                    ))}
                  </ul>
                  <span>{code}</span>
                </p>
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
              </div>
              <div className="list-box">
                {!isNoContent && (
                  <ul>
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
                )}
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
              </div>
            </div>
          </NavigateLayoutNav>
          <div>
            {isNoContent
              ? (
                <section className="block-form-add">
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
                  <>
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
                                          : `${numberWithCommas(products__price__avg*gram_per_chup)} 원`
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
                        <ul>
                          {tags.map(({id, name}) => (
                            <li>
                              <StyledTag
                                key={id}
                                name={name}
                                not_hover
                                onClick={() => {
                                  router.push(`/wiki?q=${name}`)
                                }}
                              />
                            </li>
                          ))}
                        </ul>
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
                  </>
                )
              }
            
          </div>
        </WikiWrapperDiv>
        <Waypoint
          bottomOffset={nav.size.height
            && `${(window.innerHeight - nav.size.height) / 2}px`
          }
          onEnter={() => setIsNavFollow(false)}
          onLeave={() => setIsNavFollow(true)}
        />
        <HashReload/>
      </PageContainerDiv>
    </>
  )
};

export default React.memo(WikiDetail);
