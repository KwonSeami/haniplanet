import * as React from 'react';
import throttle from 'lodash/throttle';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import AutoTagList from './AutoTagList';
import SearchBaseInput from '../SearchBaseInput';
import TagApi from '../../../../src/apis/TagApi';
import {numberWithCommas} from '../../../../src/lib/numbers';
import {$BORDER_COLOR} from '../../../../styles/variables.types';
import {RootState} from '../../../../src/reducers';

export const StyledSearchBaseInput = styled(SearchBaseInput)`
  width: calc(100% - 2px);
  height: 44px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;

  input {
    font-size: 14px;
  }
`;

interface Props {
  onSelect: (tag: any) => void;
  className?: string;
  placeholder? : string;
}

const TagRightContent = React.memo<{item: any}>(({item: {refer_count}}) => (
  <p>{numberWithCommas(refer_count)}개</p>
));

const TagInput = React.memo<Props>(({onSelect, className, placeholder}) => {
  const [tag, setTag] = React.useState('');
  const [tagAutoComplete, save] = React.useState([]);

  // Redux
  const {session: {access}} = useSelector(({system}: RootState) => system);

  // Memo Function, Variable
  const getTags = React.useCallback((q: string) => {
    if (!q || q.includes('#') || q.includes(' ')) {
      save([]);
      return null;
    }

    new TagApi(access).list({q})
      .then(({data: {results}}) => !!results && save(results));
  }, []);
  const throttleGetTags = React.useCallback(throttle(getTags, 300), [getTags]);

  const handleOnSelect = React.useCallback((tag) => {
    if (!onSelect) { return null; }
    setTag('');
    save([]);
    tag && onSelect(tag);
  }, [onSelect]);

  const isTagInsideList = React.useMemo(
    () => tagAutoComplete.some(({name}) => tag === name),
    [tag, tagAutoComplete]
  );

  return (
    <StyledSearchBaseInput
      value={tag}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const value = (e.target ? e.target.value : e) as string;

        setTag(value.replace(' ', '').replace('#', ''));
        throttleGetTags(value);
      }}
      placeholder={placeholder || '키워드로만 입력가능합니다. (최대 10개)'}
      onReset={() => {
        setTag('');
        save([]);
      }}
      className={className}
      autoList={{
        acCompProps: {
          children: (!isTagInsideList && tag.length > 0) && (
            <li
              className="pointer"
              onClick={() => {
                new TagApi(access).create({name: tag})
                  .then(({data: {result}}) => !!result && handleOnSelect(result));
              }}
            >
              <span className="keyword">{tag}</span>
              <div className="right-content">
                <p>새로운 태그 추가</p>
              </div>
            </li>
          ),
        },
        acList: tag && tagAutoComplete,
        blockStrItemSelect : true,
        queryKey: 'name',
        acComp: AutoTagList,
        onSelect: handleOnSelect,
        rightContent: TagRightContent,
      }}
    />
  );
});

TagInput.displayName = 'TagInput';
export default TagInput;
