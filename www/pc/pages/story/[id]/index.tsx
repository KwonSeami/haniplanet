import * as React from 'react';
import Router, {useRouter} from 'next/router';
import {parseCookies} from 'nookies';
import Error from '../../_error';
import StoryApi from '../../../src/apis/StoryApi';
import Loading from '../../../components/common/Loading';
import useSaveApiResult from '../../../src/hooks/useSaveApiResult';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {nodeAxiosInstance} from '../../../src/lib/axios';
import {BASE_URL} from '../../../src/constants/env';

const StoryDetail = ({pageProps}) => {
  const {query: {id}} = useRouter();

  // Api
  const storyApi: StoryApi = useCallAccessFunc(access => new StoryApi(access));
  const {resData: story} = useSaveApiResult(() => storyApi && storyApi.extendTo(id));

  const {status} = pageProps || {} as any;
  const {band: bandId, extend_to} = story || {} as any;

  React.useEffect(() => {
    if (extend_to) {
      if (!!bandId) {
        Router.replace(`/band/${bandId}/story/[id]`, `/band/${bandId}/story/${id}`);
      } else {
        Router.replace(`/${extend_to}/[id]`, `/${extend_to}/${id}`);
      }
    }
  }, [extend_to, id]);

  if (status && status !== 200) {
    return <Error statusCode={status} />;
  }

  return <Loading />;
};

StoryDetail.getInitialProps = async (ctx) => {
  const {access} = parseCookies(ctx);
  const {query: {id}} = ctx;

  try {
    const {status, data: {result}} = await nodeAxiosInstance({
      token: access,
      baseURL: BASE_URL,
    }).get(`/story/${id}/extend-to/`);
    const {band: bandId, extend_to} = result || {} as any;

    if (!!extend_to && ctx.res && ctx.res.redirect) {
      if (!!bandId) {
        ctx.res.redirect(`/band/${bandId}/story/${id}`);
      } else {
        ctx.res.redirect(`/${extend_to}/${id}`);
      }
    }

    return {status};
  } catch (err) {
    return {status: 500};
  }
};

export default StoryDetail;
