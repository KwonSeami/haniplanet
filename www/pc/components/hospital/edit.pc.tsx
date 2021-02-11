import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import loginRequired from '../../hocs/loginRequired';
import Loading from '../common/Loading';
import Page403 from '../errors/Page403';
import HospitalRegister from './register/HospitalRegister';
import {ADMIN_PERMISSION_GRADE} from '../../src/constants/band';

interface Props {
  band: any;
}

const HospitalEdit: React.FC<Props> = ({band}) => {
  if (isEmpty(band)) {
    return <Loading/>;
  }

  return (
    ADMIN_PERMISSION_GRADE.includes(band.band_member_grade)
      ? <HospitalRegister defaultData={band} />
      : <Page403/>
  )
};

export default loginRequired(HospitalEdit);
