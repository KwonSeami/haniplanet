import * as React from 'react';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import {Waypoint} from 'react-waypoint';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import usePrevious from '../../../src/hooks/usePrevious';
import {setLayout, clearLayout} from '../../../src/reducers/system/style/styleReducer';
import {RootState} from '../../../src/reducers';
import {HEADER_HEIGHT} from "../../../styles/base.types";

interface Props {
  themetype?: string;
  headerComp?: React.ReactNode;
  children: React.ReactNode;
}

const WaypointHeader = React.memo<Props>((props) => {
  const {themetype, headerComp, children} = props;

  const {popup, layout} = useSelector(
    ({popup, system: {style: {header: {layout}}}}: RootState) => ({
      popup,
      layout,
    }),
    shallowEqual,
  );
  const prevPopup = usePrevious(popup);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!isEqual(prevPopup, popup) && isEmpty(popup)) {
      dispatch(setLayout({
        background: 'transparent',
        fakeHeight: false,
        position: 'absolute',
        themetype: !!themetype ? themetype : 'black',
      }));
    } 
    
    return () => {
      dispatch(clearLayout());
    }
  }, [popup, themetype]);

  React.useEffect(() => {
    dispatch(setLayout({
      background: 'transparent',
      fakeHeight: false,
      position: 'absolute',
      themetype: !!themetype ? themetype : 'black',
    }));
    return () => {
      dispatch(clearLayout());
    }
  }, [themetype]);

  const onEnterHeader = React.useCallback(() => {
    dispatch(setLayout({
      background: 'transparent',
      fakeHeight: false,
      position: 'absolute',
      themetype: !!themetype ? themetype : 'black',
    }));
  }, [themetype]);

  const onLeaveHeader = (() => {
    dispatch(clearLayout());
  });

  return (
    <section className="waypoint-header">
      {headerComp && (
        <Waypoint
          scrollableAncestor="window"
          topOffset={layout.position === 'fixed'
            ? HEADER_HEIGHT
            : 0}
          onEnter={onEnterHeader}
          onLeave={onLeaveHeader}
        >
          <div>{headerComp}</div>
        </Waypoint>
      )}
      {children}
    </section>
  );
});

WaypointHeader.displayName = 'WaypointHeader';
export default WaypointHeader;
