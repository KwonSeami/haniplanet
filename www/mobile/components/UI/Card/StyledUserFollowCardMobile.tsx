import styled from 'styled-components';
import {heightMixin, inlineBlockMixin} from '../../../styles/mixins.styles';
import UserFollowCard from './UserFollowCard';

const StyledUserFollowCardMobile = styled(UserFollowCard)`
  width: 120px;
  height: 125px;
  padding: 11px;

  h2 {
    font-size: 14px;
    padding-bottom: 3px;
  }

  button {
    bottom: -14px;
    left: 13px;
    padding: 0 19px;
    font-size: 12px;
    ${heightMixin(30)}

    img {
      ${inlineBlockMixin(9)};
      margin: -3px 0 0;
    }
  }
`;

export default StyledUserFollowCardMobile;