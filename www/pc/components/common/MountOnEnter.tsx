import * as React from 'react';
import {Waypoint} from 'react-waypoint';

const MountOnEnter = React.memo(({children}) => {
  const [on, setOn] = React.useState(false);
  return (
    <Waypoint onEnter={() => setOn(true)}>
      <div>{on && children}</div>
    </Waypoint>
  );
});

MountOnEnter.displayName = 'MountOnEnter';
export default MountOnEnter;
