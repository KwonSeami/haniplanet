import styled from 'styled-components';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {$GRAY, $POINT_BLUE} from '../../../../styles/variables.types';

const UserFollowInfo = styled.li`
  margin: -1px 0 0 4px;

  div {
    ${fontStyleMixin({size: 13, weight: '600'})};

    &.follow-add {
      color: ${$POINT_BLUE};
    }

    &.follow-cancel {
      color: ${$GRAY};
    }

    &:hover {
      text-decoration: underline;
    }

    img {
      vertical-align: middle;
      margin-top: -2px;
      width: 15px;
      height: 15px;
    }
  }
`;

export default UserFollowInfo;
