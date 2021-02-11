import * as React from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {tagListSelector} from '../../../../src/reducers/orm/tag/selector';
import {fetchFeedTag, followTag} from '../../../../src/reducers/orm/tag/thunks';
import styled from 'styled-components';
import Tag from '../../tag/Tag';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {useRouter} from "next/router";
import {RootState} from '../../../../src/reducers';

const StyledTag = styled(Tag)`
  margin: 0 7px;
  padding: 5px 0 0;
  ${fontStyleMixin({
    size: 18,
    color: "#999"
  })}

  @media screen and (max-width: 680px) {
    margin: 0 4px;
  }
`;

const Ul = styled.ul`
  li {
    display: inline-block;
    vertical-align: middle;
  }

  @media screen and (max-width: 680px) {
    margin-left: -7px;
  }
`;

const TagSelector = React.memo(({fetchURI}) => {
  // Redux
  const dispatch = useDispatch();
  const {access, tags: [tags]} = useSelector(
    ({system: {session: {access}}, orm}: RootState) => ({
      access,
      tags: tagListSelector('feed')(orm)
    }),
    shallowEqual,
  );
  const router = useRouter();

  React.useEffect(() => {
    dispatch(fetchFeedTag(undefined, {main: true}));
  }, [access]);

  return (
    <Ul>
      {tags.slice(0, 15).map(tagItem => (
        <li key={tagItem.id}>
          <StyledTag
            key={tagItem.id}
            onClick={() => router.push(`/tag/${tagItem.id}`)}
            highlighted={tagItem.is_follow}
            {...tagItem}
          />
        </li>
      ))}
        {/* <ul className="tag-button noselect">
        <Li>
          <Link href="/tag/more">
            <StyledLink>
              <img
                src={staticUrl('/static/images/icon/icon-more.png')}
                alt="태그 더보기"
              />
              태그 더보기
            </StyledLink>
          </Link>
        </Li>
        {tags.some(({is_follow}) => is_follow) && (
          <li onClick={() => {
            dispatch(fetchFeed({
              uri: fetchURI,
              key: location.pathname,
              access,
              fetchType: 'overwrite',
            }));
          }}>
            <StyledButton
              size={{
                width: '33px',
                height: '33px',
              }}
              border={{
                radius: '0',
                width: '1px',
                color: $BORDER_COLOR,
              }}
            >
              <img
                className="refresh refresh-off"
                src={staticUrl('/static/images/icon/icon-refresh.png')}
                alt="새로고침"
              />
              <img
                className="refresh refresh-on"
                src={staticUrl('/static/images/icon/icon-refresh-on.png')}
                alt="새로고침"
              />
            </StyledButton>
          </li>
        )}
      </ul> */}
    </Ul>
  );
});

TagSelector.displayName = 'TagSelector';

export default TagSelector;
