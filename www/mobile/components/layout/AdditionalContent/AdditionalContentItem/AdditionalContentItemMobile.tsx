import * as React from 'react';
import styled from 'styled-components';
import AdditionalContentItem, {IAdditionalContentItemProps} from '.';
import {fontStyleMixin} from '../../../../styles/mixins.styles';

const StyledAdditionalContentItem = styled(AdditionalContentItem)`
  padding: 22px 0 0 0;
  margin-bottom: 7px;
  border: 0;

  .title {
    ${fontStyleMixin({ size: 16, weight: '600' })};
  }

  .title .title-right-btn {
    top: 2px;

    @media screen and (max-width: 500px) {
      right: 8px;
      top: 0;
    }
  }
`;

const AdditionalContentItemMobile = React.memo<IAdditionalContentItemProps>((props) => (
  <StyledAdditionalContentItem {...props} />
));

export default AdditionalContentItemMobile;
