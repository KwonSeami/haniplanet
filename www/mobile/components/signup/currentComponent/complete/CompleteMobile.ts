import styled from 'styled-components';
import CompletePC, { CompleteButtonGroup } from './CompletePC';

const CompleteMobile = styled(CompletePC)`
  div {
    padding: 0 0 51px 0;
    text-align: center;
    border-top: 0;
    height: auto;

    img {
      position: static;
      width: 267px;
      margin: -16px auto auto;
    }

    h2 {
      padding-top: 22px;
      font-size: 22px;
    }

    p {
      padding-left: 0;

      span {
        display: inline;
      }
    }
  }

  ${CompleteButtonGroup} {
    padding: 30px 0 268px;
    text-align: center;

    li {
      padding: 0 5px;
    }

    button {
      width: 128px;
      height: 33px;
      border-radius: 16px;
    }
  }
`;

export default CompleteMobile;
