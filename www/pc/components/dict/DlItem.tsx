import * as React from 'react';
import isEmpty from 'lodash/isEmpty';

interface Props {
  dt?: string;
  dd?: React.ReactNode;
}

const DlItem: React.FC<Props> = ({dt, dd}) => (
  (dd && !isEmpty(dd)) ? (
    <>
      <dt>{dt}</dt>
      <dd>{dd}</dd>
    </>
  ) : null
);

export default DlItem;
