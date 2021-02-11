import * as React from 'react';
import {useDispatch} from 'react-redux';
import OGMetaHead from '../components/OGMetaHead';
import Loading from '../components/common/Loading';
import {clearLocalDataThunk} from '../src/reducers/system/session/thunks';

const Logout: React.FC = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(clearLocalDataThunk(() => {
      alert('로그아웃 되었습니다.');
      location.href = '/';
    }));
  }, []);

  return (
    <div>
      <OGMetaHead title="Logout..."/>
      <Loading/>
    </div>
  );
};

export default Logout;
