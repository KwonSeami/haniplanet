import * as React from 'react';
import {isEmpty, throttle} from 'lodash';
import {useRouter} from 'next/router';
import {useLazyQuery} from '@apollo/react-hooks';
import {AUTO_COMPLETE_WIKIS, TAGS} from '../../../src/gqls/wiki';

const MIN_DEPEND = 0;
const MAX_DEPEND = 50;

const MIN_PRICE = 0;
const MAX_PRICE = 100000;

const SHAPES = [
  {id: 1, value: '탕제'},
  {id: 2, value: '환제'},
  {id: 3, value: '산제'},
  {id: 5, value: '외용제'},
  {id: 4, value: '기타'}
];

const SOURCES = [
  {id: 1, value: '동의보감'},
  {id: 8, value: '방약합편'},
  {id: 7, value: '상한론'},
  {id: 6, value: '동의수세보원'},
  {id: 10, value: '청강의감'},
  {id: 11, value: '기타'},
];

const OTHER_DONGI = [2, 3, 4, 5];
const DEFAULT_PARAMS_OF_STATE = {
  q: '',
  category: [],
  exclude_dependencies: [],
  exclude_tags: [],
  include_dependencies: [],
  include_tags: [],
  max_dependency_count: MAX_DEPEND,
  max_price: MAX_PRICE,
  min_dependency_count: MIN_DEPEND,
  min_price: MIN_PRICE,
  shapes: [],
};

const useWikiDetailSearch = () => {
  const {query} = useRouter();
  const [params, setParams] = React.useState(DEFAULT_PARAMS_OF_STATE);
  const [incluDepend, setIncluDepend] = React.useState('');
  const [excluDepend, setExcluDepend] = React.useState('');
  const [incluTag, setIncluTag] = React.useState('');
  const [excluTag, setExcluTag] = React.useState('');
  const [autoCompletedWikis, setAutoCompletedWiki] = React.useState([]);
  const [autoCompletedTags, setAutoCompletedTag] = React.useState([]);
  const [searchAutoCompletedWiki] = useLazyQuery(AUTO_COMPLETE_WIKIS, {
    onCompleted: (data) => {
      const {
        wikis: {nodes}} = {wikis: {nodes: []}
      } = data;
      setAutoCompletedWiki(nodes);
    }
  });
  
  const [searchAutoCompletedTag] = useLazyQuery(TAGS, {
    onCompleted: (data) => {
      const {
        tags = [],
      } = data;
      setAutoCompletedTag(tags);
    }
  });

  const throttledSearchAutoCompletedWiki = throttle((variables): void => {
    if (!isEmpty(variables)) {
      searchAutoCompletedWiki({
        variables: {...variables}
      });
    }
  }, 500);

  const throttledSearchAutoCompletedTag = throttle((variables): void => {
    if (!isEmpty(variables)) {
      searchAutoCompletedTag({
        variables: {...variables}
      });
    }
  }, 500);

  React.useEffect(() => {
    if (query['is_detail']) {
      const {
        category,
        exclude_dependencies,
        exclude_tags,
        include_dependencies,
        include_tags,
        shapes,
      } = query;

      // @ts-ignore
      setParams(curr => ({
        ...curr,
        ...query,
        include_dependencies: !!include_dependencies ? (include_dependencies as string).split(',') : [],
        exclude_dependencies: !!exclude_dependencies ? (exclude_dependencies as string).split(',') : [],
        include_tags: !!include_tags ? (include_tags as string).split(',') : [],
        exclude_tags: !!exclude_tags ? (exclude_tags as string).split(',') : [],
        category: !!category ? (category as string).split(',') : [],
        shapes: !!shapes ? (shapes as string).split(',') : [],
      }));
    }
  }, [query]);


  return {
    incluDepend,
    setIncluDepend,
    excluDepend,
    setExcluDepend,
    incluTag,
    setIncluTag,
    excluTag,
    setExcluTag,
    params,
    setParams,
    throttledSearchAutoCompletedWiki,
    throttledSearchAutoCompletedTag,
    autoCompletedWikis,
    autoCompletedTags,
    setAutoCompletedWiki,
    setAutoCompletedTag,
    MIN_DEPEND,
    MAX_DEPEND,
    SHAPES,
    SOURCES,
    MIN_PRICE,
    MAX_PRICE,
    DEFAULT_PARAMS_OF_STATE,
    OTHER_DONGI,
  };
};

export default useWikiDetailSearch;
