import * as React from 'react';
import styled from 'styled-components';
import Confirm from '../../common/popup/Confirm';
import {Close, TitleDiv} from '../../common/popup/base/TitlePopup';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {PopupProps} from '../../common/popup/base/Popup';

const StyledConfirm = styled(Confirm)`
  text-align: center;
  ${fontStyleMixin({
    size: 14
  })};

  ${TitleDiv} {
    width: 330px;
    padding: 29px 0 9px;
    text-align: center;
    border: 0;

    h2 {
      ${fontStyleMixin({
        size: 21,
        weight: '300'
      })}
    }
  }

  ${Close} {
    right: 13px;
    top: 13px
  }
`;


interface IProfessorProps {
  school: string;
  name: string;
  major?: string;
}

interface IModuProps {
  category: string;
  detail?: string;
  name: string;
}

interface Props extends PopupProps {
  BASE_URL: string;
  form: IProfessorProps | IModuProps;
}

const RegisterNewItemPopup = React.memo<Props>(
  ({id, closePop, ...props}) =>
    <StyledConfirm
      id={id}
      closePop={closePop}
      title="등록하기"
      {...props}
    >
      <p>
        해당 내용을 등록하시겠습니까?<br/>
        정렬을 최근 등록순으로 변경하면,<br/>
        등록한 내용을 볼 수 있습니다.
      </p>
    </StyledConfirm>
);


export default RegisterNewItemPopup;