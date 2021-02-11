import gql from 'graphql-tag';

export const BLOCK_DEFAULT_FIELD = `
  id
  head
  book_reference
  text
  children_count
  created_at
  status
  is_bookmarked
  is_reported
  blind_reason
  is_writer
  bookmark {
    offset_range
  }
`

export const BLOCK_PARENT_FIELD = `
  ${BLOCK_DEFAULT_FIELD}
  parent {
    id
  }
`;


export const WIKI_GUEST = gql`
  query WikiGuest($code: String!) {
    wiki(code: $code) {
      name
      chn_name
      other_name
      shapes {
        name
      }
      tags {
        name
      }
      kinds {
        name
      }
      blocks {
        id
        head
        book_reference
        text
        children_count
        created_at
        status
        blind_reason
        blocks {
          id
          head
          book_reference
          text
          children_count
          created_at
          status
          blind_reason
        }
      }
      dependencies {
        id
        text
        cook
        default_chup
        qnt_text
        qnt_unit
        qnt_per_one
        gram_per_chup
        child {
          name
          code
        }
      }
    }
  }
`;

export const WIKIS = gql`
  query Wikis(
    $q: String,
    $offset: Int,
    $limit: Int,
    $doc_type: IWikiDocTypeEnum,
    $shapes: [String],
    $categories: [String],
    $exclude_tags: [String],
    $include_tags: [String],
    $exclude_dependencies: [String],
    $incldue_dependencies: [String],
    $min_price: Int,
    $max_price: Int,
    $min_dependency_count: Int,
    $max_dependency_count: Int,
    $order_by: IOrderByEnum,
    $only: IWikiFilterEnum,
    $isBookmarkedArticle: Boolean = false,
  ) {
    wikis (
      q: $q,
      offset: $offset,
      limit: $limit,
      doc_type: $doc_type,
      shapes: $shapes,
      categories: $categories,
      exclude_tags: $exclude_tags,
      include_tags: $include_tags,
      exclude_dependencies: $exclude_dependencies,
      include_dependencies: $incldue_dependencies,
      min_price: $min_price,
      max_price: $max_price,
      min_dependency_count: $min_dependency_count,
      max_dependency_count: $max_dependency_count,
      order_by: $order_by
      only: $only
    ) {
      nodes {
        name
        chn_name
        other_name
        code
        is_bookmarked
        doc_type
        tags {
          name
          id
        }
        bookmarked_articles @include(if: $isBookmarkedArticle){
          id
          head
          text
          bookmark {
            offset_range
            text
            revision
          }
        }
      }
      total_count
    }
  }
`;

export const WIKI = gql`
  query Wiki($code: String!) {
    wiki(code: $code) {
      name
      chn_name
      other_name
      is_bookmarked
      shapes {
        name
      }
      tags {
        name
      }
      kinds {
        name
      }
      blocks {
        ${BLOCK_PARENT_FIELD}
        blocks {
          ${BLOCK_PARENT_FIELD}
        }
      }
      products {
        id
        name
        product_area
        price
        seller
        base_date
        is_active
      }
      dependencies {
        id
        text
        cook
        default_chup
        qnt_text
        qnt_unit
        qnt_per_one
        gram_per_chup
        child {
          name
          code
          products__price__avg
        }
      }
    }
  }
`;

export const UPLOAD_WIKIS = gql`
  query StoryUploadWikis(
    $q: String,
    $offset: Int,
    $limit: Int,
  ) {
    wikis (
        q: $q,
        offset: $offset,
        limit: $limit,
    ) {
      nodes {
        name
        chn_name
        other_name
        code
        dependencies {
            child {
              name
              code
            }
        }
      }
      total_count
    }
  }
`;

export const INFO_UPLOAD_WIKIS = gql`
  query InfoUploadWikis($codes: [String]) {
    wikis (codes: $codes) {
      nodes {
        name
        chn_name
        other_name
        code
        dependencies {
          child {
            name
            code
          }
        }
      }
      total_count
    }
  }
`;

export const WIKI_BOOKMARK_SWITCH = gql`
  mutation WikiBookmarkSwitch($code: String!) {
    wikiBookmark(code: $code) {
      updated_wiki {
        is_bookmarked
      }
    }
  }
`;

const BOOKMARK_DEFAULT_FIELD = `
  id
  name
  chn_name
  description
  legacy_id
`;

export const WIKI_BOOKMARKS = gql`
  query books {
    ${BOOKMARK_DEFAULT_FIELD}
    chapters {
      ${BOOKMARK_DEFAULT_FIELD}
    }
  }
`;

export const AUTO_COMPLETE_WIKIS = gql`
  query AutoCompleteWikis(
    $q: String,
    $doc_type: IWikiDocTypeEnum,
    $limit: Int
  ) {
    wikis (
      q: $q, 
      doc_type: $doc_type,
      limit: $limit
    ) {
      nodes {
        name
        doc_type
        children_dependencies {
          child {
            code
            name
          }
        } 
      }
    }
  }
`

export const Block = gql`
  query Block($id: ID!) {
    block(id: $id) {
      ${BLOCK_PARENT_FIELD}
      blocks {
        ${BLOCK_PARENT_FIELD}
      }
    }
  }
`;

export const BLOCK_CHILDREN = gql`
  query BlockChildren($id: ID!) {
    block(id: $id) {
      blocks {
        ${BLOCK_PARENT_FIELD}
      }
    }
  }
`;

export const CREATE_BLOCK = gql`
  mutation CreateBlock(
    $wiki: String!
    $block_type: String!
    $parent: String
    $clientMutationId: String
    $head: String
    $text: String
  ) {
    blockForm(input: {
      wiki: $wiki
      block_type: $block_type
      parent: $parent
      clientMutationId: $clientMutationId
      head: $head
      text: $text
    }) {
      block {
        ${BLOCK_PARENT_FIELD}
        blocks {
          ${BLOCK_PARENT_FIELD}
        }
      }
    }
  }
`;

export const UPDATE_BLOCK = gql`
  mutation UpdateBlock(
    $wiki: String!
    $block_type: String!
    $id: String!
    $head: String
    $text: String
  ) {
    blockForm(input: {
      wiki: $wiki
      block_type: $block_type
      id: $id
      head: $head
      text: $text
    }) {
      block {
        head
        text
      }
    }
  }
`

export const DELETE_BLOCK = gql`
  mutation DeleteBlock($id: ID!) {
    deleteBlock(id: $id) {
      is_succeed
      message
    }
  }
`

export const REPORT_BLOCK = gql`
  mutation ReportBlock(
    $block_id: String!
    $reason: String
  ) {
    reportBlock(
      block_id: $block_id,
      reason: $reason
    ) {
      is_succeed
      message
      block {
        status
        is_reported
        blind_reason
      }
    }
  }
`

export const BLOCK_BOOKMARK = gql`
  mutation BlockBookmark($block_id: String!, $offset_range: [Int]) {
    blockBookmark(block_id: $block_id, offset_range: $offset_range) {
      updated_block {
        id
        is_bookmarked,
        bookmark {
          offset_range
        }
      }
    }
  }
`;

export const TAGS = gql`
  query Tags (
    $tag_type: IWikiHasTagTypeEnum, 
    $q: String,
    $after: Int, 
    $first: Int,
  ) {
    tags (
      tag_type: $tag_type,
      q: $q,
      after: $after,
      first: $first
    ) {
      id
      name
    }
  }
`;
