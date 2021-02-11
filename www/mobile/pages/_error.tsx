import React from 'react'
import ErrorController from '../components/errors/ErrorController';

const Error = ({statusCode, message} : {statusCode: number, message?: string}) => {
  return <ErrorController status={statusCode} message={message} />
};

Error.getInitialProps = ({res, err}) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return {statusCode, message: ''};
};

export default Error
