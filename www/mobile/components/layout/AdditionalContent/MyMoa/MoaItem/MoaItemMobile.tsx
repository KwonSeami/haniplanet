import * as React from 'react';
import styled from 'styled-components';
import MoaItem, {IMoaItemProps} from '.';
import {$BORDER_COLOR} from '../../../../../styles/variables.types';
import {fontStyleMixin, inlineBlockMixin} from '../../../../../styles/mixins.styles';

const StyledMoaItem = styled(MoaItem)`
  padding: 10px 27px 17px 3px;
  border-bottom: 1px solid ${$BORDER_COLOR};

  .avatar {
    ${inlineBlockMixin(46)};
    height: 46px;
  }

  .moa-box {
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 46px);
    box-sizing: border-box;
    padding-left: 12px;

    h2 {
      padding-right: 3px;
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 14,
        weight: '600',
      })};
      
    }
  }

  .new-story-count {
    display: inline-block;
    vertical-align: middle;
  }

  button {
    top: 50%;
    margin-top: -6px;
  }
`;

const MoaItemMobile = React.memo<IMoaItemProps>(props => (
  <StyledMoaItem {...props} />
));

export default MoaItemMobile;
