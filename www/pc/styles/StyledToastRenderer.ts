import styled from 'styled-components';
import ToastRenderer from '@hanii/toast-renderer';

const StyledToastRenderer = styled(ToastRenderer)`
  position: fixed;
  left: 40px;
  bottom: 30px;
  z-index: 100000;

  > ul {
    display: flex;
    flex-direction: column-reverse;
    margin: -5px 0;
  }
`;

export default StyledToastRenderer;

export const StyledTagToastRenderer = styled(ToastRenderer)`
  position: absolute;
  z-index: 100000;
  display: inline-block;
  margin-top: 16px;

  > ul {
    display: flex;
    flex-direction: column-reverse;
    margin: -5px 0;
  }
`;
