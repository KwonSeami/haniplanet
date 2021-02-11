import * as React from 'react';
import PointChargeTabArea from './style/PointChargeTabArea';
import PointTabConfirmButton from './style/PointTabConfirmButton';

const PointChargeTab = React.memo(() => {
  const pointChargeRef = React.useRef(null);

  return (
    <div>
      <PointChargeTabArea ref={pointChargeRef} />
      <PointTabConfirmButton
        leftButton={{children: '취소'}}
        rightButton={{
          children: '확인',
          onClick: () => {
            pointChargeRef.current.handleClickChargeButton();
          }
        }}
      />
    </div>
  );
});

export default PointChargeTab;
