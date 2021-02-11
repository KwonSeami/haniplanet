import * as React from 'react';
import styled from 'styled-components';
import AdditionalContentItem, {IAdditionalContentItemProps} from '.';
import {fontStyleMixin} from '../../../../styles/mixins.styles';

const StyledAdditionalContentItem = styled(AdditionalContentItem)`
  padding: 12px 0 35px;

  .title {
    ${fontStyleMixin({ 
      size: 15, 
      weight: '600'
    })};
  }

  .title .title-right-btn {
    top: 0;
  }
`;

const AdditionalContentItemPC = React.memo<IAdditionalContentItemProps>((props) => (
  <StyledAdditionalContentItem {...props} />
));

export default AdditionalContentItemPC;