import * as React from 'react';
import useTimer from '../../../src/hooks/time/useTimer';
import {AuthType} from '../../../pages/find/[field]';
import {MINUTE} from '../../../src/constants/times';

export interface IFormProps {
  send_by: AuthType;
  field: string;
}

const useForm = ({send_by, field}: Pick<IFormProps, 'send_by' | 'field'>) => {
  const IDENTIFIER = React.useMemo(() => field === 'id' ? '이름' : '아이디', [field]);
  const isSendTypeEmail = React.useMemo(() => send_by === 'email', [send_by]);

  const [isVerify, setIsVerify] = React.useState(false);

  const authTime = useTimer({
    time: 3 * MINUTE,
    autoStart: false
  });

  React.useEffect(() => {
    if (isVerify && !isSendTypeEmail) {
      authTime.start();
    }
  }, [isVerify, isSendTypeEmail]);

  return {
    IDENTIFIER,
    isSendTypeEmail,
    authTime,
    isVerifyState: {isVerify, setIsVerify}
  };
};

export default useForm;
