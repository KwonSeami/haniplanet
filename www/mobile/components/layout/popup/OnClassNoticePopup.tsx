import * as React from 'react';
import {PopupProps} from '../../common/popup/base/Popup';
import Alert from '../../common/popup/Alert';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {Close} from '../../common/popup/base/TitlePopup';


const NoticePopup = styled(Alert)`
  .modal-body {
    width: 320px;
  }

  .popup-title {
    padding: 40px 0 18px;
    border-bottom: 0;

    h2 {
      text-align: center;
      ${fontStyleMixin({size: 21, weight: '300'})};
    }

    ${Close} {
      top: 14px;
      right: 11px;
    }
  }

  ul {
    li {
      position: relative;
      padding: 0 20px 0 34px;
      line-height: 22px;
      ${fontStyleMixin({size: 13})};

      & ~ li {
        margin-top: 17px;
      }

      span {
        position: absolute;
        top: 0;
        left: 19px;
        ${fontStyleMixin({
          size: 13,
          weight: '600',
          style: 'italic',
          family: 'Montserrat',
          color: '#999',
        })};
      }
    }
  }

  .button {
    margin: 32px auto 30px;
  }
`;

interface Props extends PopupProps {
}

const OnClassNoticePopup: React.FC<Props> = (props) => {
    const {id, closePop} = props || {};

    return (
      <NoticePopup
        id={id}
        closePop={closePop}
        title="강의 유의사항 안내"
      >
        <ul>
          <li>
            <span>1</span>
            강의 동영상은 PC, 휴대폰, 태블릿, MAC OS 등의 기기로 수강할 수 있습니다.<br/>
            (단, <b>2대 이상의 기기에서 동시 수강이 불가능</b>합니다.)
          </li>
          <li>
            <span>2</span>
            기기등록은 <b>최대 3대</b>까지 가능합니다. 강의를 재생하면 해당 기기가 <b>자동으로 등록</b>됩니다.<br/>
            (수강 기기 변경이 필요한 경우 고객센터로 문의하시면 <b>6개월당 1회에 한하여 초기화</b>가 가능합니다. 즉, 한 번 기기 초기화를 진행하면 이후 <b>6개월 간 초기화가 불가능</b>합니다. 수강하실 기기를 신중하게 선택해주세요.)
          </li>
          <li>
            <span>3</span>
            <b>동영상 수강 시 문제가 발생하는 경우 우측 탭 옆에 있는 온라인 강의 이용가이드를 확인</b>해 주시기 바랍니다.<br/>
            동영상 재생에 대한 다른 문의사항은 1:1 채널톡문의나 고객센터(02-6941-4860)를 이용해주세요.
          </li>
        </ul>
      </NoticePopup>
    );
  };

export default React.memo(OnClassNoticePopup);
