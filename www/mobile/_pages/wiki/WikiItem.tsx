import * as React from 'react';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import {Mutation} from "@apollo/react-components";
import {WIKI_BOOKMARK_SWITCH} from '../../src/gqls/wiki';
import KeyWordHighlight from '../../components/common/KeyWordHighlight';
import Bookmark from '../../_pages/wiki/Bookmark';

interface IWikiItemProps {
  access?: string;
  code: string;
  name: string;
  other_name?: string;
  chn_name?: string;
  is_bookmarked?: boolean;
  tags?: {
    name: string,
    id: string
  }[];
  bookmarked_articles?: {
    id: string;
    head: string;
    text: string;
    bookmarked_users: {
      offset_range: number;
      text: string;
    }
  }[]
  updateQuery: <T>(data: T) => T;
}


const WikiItem = React.memo<IWikiItemProps>(({
  access = null,
  code,
  name,
  chn_name,
  other_name,
  is_bookmarked = false,
  tags = [],
  bookmarked_articles = [],
  updateQuery
}) => {
  return (
    <li>
      <div>
        <Link href={`/wiki/${code}`}>
          <a>
            <i>{other_name}</i>
            <h3 className="ellipsis">
              {name}<span>{chn_name}</span>
            </h3>
            <div className="others">
              {!isEmpty(tags) && (
                <ul className="tags ellipsis">
                  {tags.map(({
                    name,
                    id
                  }) => (
                    <li key={id}>
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
          </a>
        </Link>
        {access && (
          <span className="bookmark">
            <Mutation mutation={WIKI_BOOKMARK_SWITCH}>
              {(switchBookmark) => (
                <Bookmark
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
                        const {wikis, ...rest} = data;
                        const {nodes} = wikis;
                        return {
                          ...rest,
                          wikis: {
                            ...wikis,
                            nodes: nodes.map((wiki) => {
                              const {code:_code} = wiki;
                              if(code === _code) {
                                wiki = {
                                  ...wiki,
                                  ...updated_wiki
                                }
                              }
                              return wiki;
                            })
                          }
                        }
                      })
                    })
                  }}
                />
              )}
            </Mutation>
          </span>
        )}
      </div>
      {!isEmpty(bookmarked_articles) && (
        <div className="element">
          {bookmarked_articles.map(({
            id, 
            head, 
            text,
            bookmark = {offset_range: [0, 0]}
          }) => {
            const {
              offset_range
            } = bookmark
            const [offsetStart, offsetEnd] = offset_range;

            return (
              <p 
                key={id}
                className="pre-line"
              >
                {head && (
                  <em>{head}</em>
                )}
                {text && (
                  <KeyWordHighlight
                    text={text}
                    keyword={offsetStart === offsetEnd ? text : text.slice(offsetStart, offsetEnd)}
                    color="rgba(43, 137, 255, 0.45)"
                    background
                  />
                )}
              </p>
            )
          })}
        </div>
      )}
    </li>
  )
});

WikiItem.displayName = 'WikiItem';

export default WikiItem;
