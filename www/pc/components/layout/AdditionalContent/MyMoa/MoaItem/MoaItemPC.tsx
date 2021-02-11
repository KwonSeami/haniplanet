import * as React from 'react';
import styled from 'styled-components';
import MoaItem, {IMoaItemProps} from '.';
import {$BORDER_COLOR} from '../../../../../styles/variables.types';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';

const StyledMoaItem = styled(MoaItem)`
  padding: 13px 16px 14px 70px;
  border: 1px solid ${$BORDER_COLOR};
  border-bottom: 0;

  &:last-child {
    border-bottom: 1px solid ${$BORDER_COLOR};
  }

  h2 {
    padding-bottom: 6px;
    ${fontStyleMixin({
      size: 13,
      weight: '600'
    })};
  }

  .avatar {
    position: absolute;
    left: 15px;
    top: 12px;
    width: 40px;
    height: 40px;
  }

  button {
    top: 25px;
  }
`;

const MoaItemPC = React.memo<IMoaItemProps>(props => (
  <StyledMoaItem {...props} />
));

export default MoaItemPC;