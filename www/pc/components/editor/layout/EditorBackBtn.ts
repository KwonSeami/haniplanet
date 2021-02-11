import styled from 'styled-components';
import {fontStyleMixin, inlineBlockMixin} from '../../../styles/mixins.styles';
import {$GRAY} from '../../../styles/variables.types';

const EditorBackBtn = styled.a`
    position: fixed;
    top: 50%;
    left: 5%;
    float: left;
    width: 160px;
    transform: translateY(-50%);
    ${fontStyleMixin({size: 15, color: $GRAY})};
    
    img {
      ${inlineBlockMixin(30)};
      margin: -5px 11px 0 0;
    }
`;

export default EditorBackBtn;
