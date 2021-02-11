import * as React from 'react';
import {$FONT_COLOR, $LIGHT_BLUE} from '../../../../styles/variables.types';
import styled from 'styled-components';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {fetchFeedTag} from '../../../../src/reducers/orm/tag/thunks';
import {tagListSelector} from '../../../../src/reducers/orm/tag/selector';
import {useRouter} from "next/router";
import Tag from '../../tag/Tag';
import {RootState} from '../../../../src/reducers';

interface Props {
  fetchURI: string;
}

const StyledTag = styled(Tag)`
  margin: 0 7px;
  padding: 5px 0 0;
  font-size: 20px;
`;

const Li = styled.li`
  display: inline-block;
  vertical-align: middle;

  &:hover ${StyledTag} {
    color: ${$FONT_COLOR};

    &::after {
      content:'';
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: -1;
      width: 100%;
      height: 50%;
      background-color: ${$LIGHT_BLUE};
    }
  }
`;

const TagSelector = React.memo<Props>(({fetchURI}) => {
  // Redux
  const dispatch = useDispatch();
  const {access, tags: [tags]} = useSelector(
    ({system: {session: {access}}, orm}: RootState) => ({
      access,
      tags: tagListSelector('feed')(orm),
    }),
    shallowEqual,
  );
  const router = useRouter();

  React.useEffect(() => {
    dispatch(fetchFeedTag(undefined, {main: true}));
  }, [access]);

  return (
    <ul>
      {tags.slice(0, 15).map(tagItem => (
        <Li key={tagItem.id}>
          <StyledTag
            key={tagItem.id}
            isLarge
            onClick={() => router.push(`/tag/${tagItem.id}`)}
            highlighted={tagItem.is_follow}
            {...tagItem}
          />
        </Li>
      ))}
    </ul>
  );
});

TagSelector.displayName = 'TagSelector';

export default TagSelector;
