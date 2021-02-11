import * as React from 'react';
import * as Sentry from '@sentry/browser';
import {parse} from '../../src/lib/atlaskit/renderer';

interface Props {
  body: string | object;
}

const HaniRenderer = React.memo<Props>(({body = {}}) => {
  const bodyContent = React.useMemo(() => {
    switch (typeof body) {
      case 'string':
        return JSON.parse(body).content;
      case 'object':
        return body.content;
    }
  }, [body]);

  try {
    return (
      <div className="hani-renderer">
        {parse(bodyContent)}
      </div>
    );
  } catch(err) {
    Sentry.captureException(err);

    return (
      <p>스토리를 불러오는 중 에러가 발생하였습니다.</p>
    );
  }
});

export default HaniRenderer;
