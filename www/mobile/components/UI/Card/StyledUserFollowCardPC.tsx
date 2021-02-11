import styled from 'styled-components';
import {heightMixin} from '../../../styles/mixins.styles';
import UserFollowCard from './UserFollowCard';

const StyledUserFollowCardPC = styled(UserFollowCard)`
  width: 96px;
  height: 100px;
  padding: 10px;

  h2 {
    font-size: 13px;
  }

  button {
    bottom: -11px;
    left: 12px;
    padding: 0 15px;
    font-size: 11px;
    ${heightMixin(24)};
  }
`;

export default StyledUserFollowCardPC;