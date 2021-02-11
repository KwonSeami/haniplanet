import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import {useRouter} from 'next/router';
import {useSelector,shallowEqual} from 'react-redux';
import Loading from '../common/Loading';
import Page403 from '../errors/Page403';
import HospitalRegister from './HospitalRegister';
import loginRequired from '../../hocs/loginRequired';
import {pickBandSelector} from '../../src/reducers/orm/band/selector';
import {ADMIN_PERMISSION_GRADE} from '../../src/constants/band';

const HospitalEdit = React.memo(() => {
  
  const router = useRouter();
  const {query : {slug}} = router;

  const {band} = useSelector(
    ({orm}) => ({
      band : pickBandSelector(slug as string)(orm)
    }), shallowEqual
  );

  if(isEmpty(band)) {
    return <Loading/>;
  }
  
  return(ADMIN_PERMISSION_GRADE.includes(band.band_member_grade) ? (
  <HospitalRegister type="EDIT"/>
  ) : (<Page403/>))
});

export default loginRequired(HospitalEdit);
