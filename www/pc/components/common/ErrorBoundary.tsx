import * as React from 'react';
import * as Sentry from '@sentry/browser';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.withScope((scope) => {
        scope.setExtras(errorInfo);
        Sentry.captureException(error);
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return <p>렌더링 도중 에러가 발생하였습니다.</p>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
