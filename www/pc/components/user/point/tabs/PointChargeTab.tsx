import * as React from 'react';
import PointChargeTabArea from './style/PointChargeTabArea';
import BasicButtonGroup from '../../../inputs/ButtonGroup/BasicButtonGroup';

const PointChargeTab = React.memo(() => {
  const pointChargeRef = React.useRef(null);

  return (
    <div>
      <PointChargeTabArea ref={pointChargeRef} />
      <BasicButtonGroup
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

PointChargeTab.displayName = 'PointChargeTab';
export default PointChargeTab;
