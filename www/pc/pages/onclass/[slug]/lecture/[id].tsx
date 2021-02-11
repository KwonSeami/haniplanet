import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import Link from 'next/link';
import Helmet from 'react-helmet';
import Router, {useRouter} from 'next/router';
import Loading from '../../../../components/common/Loading';
import useSaveApiResult from '../../../../src/hooks/useSaveApiResult';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import {staticUrl} from '../../../../src/constants/env';
import {fontStyleMixin, heightMixin} from '../../../../styles/mixins.styles';
import {$FONT_COLOR, $GRAY, $WHITE, $BORDER_COLOR} from '../../../../styles/variables.types';
import loginRequired from '../../../../hocs/loginRequired';
import {toHHMMSS} from '../../../../src/lib/date';
import useSetFooter from '../../../../src/hooks/useSetFooter';
import OnClassApi from '../../../../src/apis/OnClassApi';
import userTypeRequired from '../../../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../../../src/constants/users';

const PLAYER_HEADER_HEIGHT = 40;

const Div = styled.div`
  position: relative;
  height: 100vh;

  .video-player {
    height: calc(100% - ${PLAYER_HEADER_HEIGHT}px);
    font-size: 0;

    iframe {
      border: 0;
    }
  }

  .header {
    position: absolute;
    top: 0;
    right: 0;

    .play-list-header {
      width: 258px;
      ${heightMixin(38)};
      padding-left: 12px;
      box-sizing: border-box;
      float: right;
  
      > span {
        height: 100%;
        opacity: 0;
        vertical-align: middle;
        ${fontStyleMixin({
          size: 14,
          weight: 'bold',
          color: $WHITE,
        })};
        transition: 0.2s all;
      }

      .play-list-menu {
        position: absolute;
        top: 12px;
        right: 14px;
        width: 22px;
        height: 16px;

        span {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: ${$BORDER_COLOR};
          border-radius: 2px;
          transition: 0.2s;

          &:nth-of-type(1) {
            top: 0;
          }

          &:nth-of-type(2) {
            top: 7px;
          }

          &:nth-of-type(3) {
            bottom: 0;
          }
        }

        &.active span:nth-of-type(1) {
          transform: translateY(7px) rotate(-45deg);
        }

        &.active span:nth-of-type(2) {
          opacity: 0;
        }

        &.active span:nth-of-type(3) {
          transform: translateY(-7px) rotate(45deg);
        }
      }
    }

    &.open {
      bottom: 0;
      box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.5);

      span {
        opacity: 1;
      }
    }
  }
`;

const PlayerHeader = styled.header`
  width: 100%;
  height: ${PLAYER_HEADER_HEIGHT}px;
  padding-left: 20px;
  background-color: ${$FONT_COLOR};
  box-sizing: border-box;

  > img {
    height: 18px;
    vertical-align: sub;
  }

  h3 {
    display: inline-block;
    ${heightMixin(PLAYER_HEADER_HEIGHT)};
    padding-left: 15px;
    margin-left: 20px;
    border-left: 1px solid ${$GRAY};
    ${fontStyleMixin({
      size: 16,
      weight: '600',
      color: $WHITE
    })};
  }

  .button {
    float: right;
    margin: 12px 14px 0 0;
  }
`;

const PlayList = styled.div`
  position: absolute;
  top: ${PLAYER_HEADER_HEIGHT}px;
  right: 0;
  width: 258px;
  height: calc(100% - ${PLAYER_HEADER_HEIGHT}px);
  border-top: 1px solid #6f6f6f;
  background-color: ${$FONT_COLOR};
  box-sizing: border-box;

  ul {
    padding: 12px;

    li {
      margin-bottom: 7px;

      a {
        display: table;
        table-layout: fixed;
        width: 100%;
      }

      p {
        width: 176px;
        display: table-cell;
        ${fontStyleMixin({
          size: 14,
          color: $WHITE,
        })};

        &.play {
          color: #7cc9ff;
        }
      }
  
      span {
        display: table-cell;
        text-align: right;
        ${fontStyleMixin({
          size: 14,
          color: $WHITE,
        })};
      }
    }
  }
`;

const waitForGlobal = (name: string, timeout = 300) => (
  new Promise((resolve, reject) => {
    let waited = 0;

    const wait = (interval: number) => {
      setTimeout(() => {
        waited += interval;

        if (window[name] !== undefined) {
          return resolve();
        } else if (waited >= timeout) {
          return reject({message: 'Timeout'});
        } else {
          wait(interval * 2);
        }
      }, interval);
    };

    wait(30);
  })
);

const OnclassPlayerPage = React.memo(() => {
  const [isPlayListOpen, setIsPlayListOpen] = React.useState(false);
  const [{
    data: {
      token,
      kollus_custom_key,
      next_media_content_key,
      story: {
        content: {title},
      },
    },
    pending: mediaContentPending,
  }, setMediaContnet] = React.useState({
    data: {story: {content: {}}} as any,
    pending: true,
  });
  const [{
    error: VgControllerDataErorr,
    pending: VgControllerDataPending
  }, setVgControllerData] = React.useState({
    error: false,
    pending: true,
  });
  const videoRef = React.useRef(null);

  const {query: {slug, id: lectureId}} = useRouter();

  const onClassApi: OnClassApi = useCallAccessFunc(access => new OnClassApi(access));
  const {resData: lectureList = []} = useSaveApiResult(() => onClassApi && onClassApi.onclassList(slug as string, {}));

  // Custom Hook
  useSetFooter(false);

  React.useEffect(() => {
    waitForGlobal('VgControllerClient')
      .then(() => setVgControllerData({error: false, pending: false}))
      .catch(() => {
        alert('VgController 정보를 가져오는 것에 실패했습니다.');
        setVgControllerData({error: true, pending: false});
      });

  }, []);

  React.useEffect(() => {
    onClassApi.onclassProgress(slug as string, {media_content_key: lectureId})
      .then(({data: {result}}) => {
        setMediaContnet({data: result, pending: false});
      });
  }, [slug, lectureId]);

  React.useEffect(() => {
    if (!VgControllerDataPending && !VgControllerDataErorr) {
      const controller = new window.VgControllerClient({
        target_window: videoRef.current.contentWindow
      });

      if (next_media_content_key) {
        controller.on('done', () => {
          Router.push(
            '/onclass/[slug]/lecture/[id]',
            `/onclass/${slug}/lecture/${next_media_content_key}`
          );
        });

        return () => controller.off('done');
      }
    }
  }, [videoRef, next_media_content_key, VgControllerDataPending, VgControllerDataErorr]);

  return (
    <Div>
      <Helmet script={[{src: 'https://file.kollus.com/vgcontroller/vg-controller-client.latest.min.js'}]} />
      <PlayerHeader className="clearfix">
        <img
          src={staticUrl('/static/images/logo/logo-white.png')}
          alt="한의플래닛 로고"
        />
        <h3>{title}</h3>
      </PlayerHeader>
      <div
        className={cn('header', {open: isPlayListOpen})}
      >
        <div className="play-list-header">
          <span>재생목록</span>
          <div
            className={cn('pointer play-list-menu', {active: isPlayListOpen})}
            onClick={() => setIsPlayListOpen(curr => !curr)}
          >
            <span />
            <span />
            <span />
          </div>
        </div>
        {isPlayListOpen && (
          <PlayList>
            <ul>
              {lectureList.map(({content: {title, length, media_content_key}}) => (
                <li>
                  <Link
                    href="/onclass/[slug]/lecture/[id]"
                    as={`/onclass/${slug}/lecture/${media_content_key}`}
                  >
                    <a>
                      <p
                        className={cn(
                          'ellipsis',
                          {play: media_content_key === lectureId},
                        )}
                      >
                        {title}
                      </p>
                      <span>{toHHMMSS(length)}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </PlayList>
        )}
      </div>
      <div className="video-player">
        {(VgControllerDataPending)
          ? <Loading />
          : <iframe
            ref={videoRef}
            allowFullScreen
            webkitAllowFullScreen
            mozAllowFullScreen
            style={{
              width: isPlayListOpen ? 'calc(100% - 258px)' : '100%',
              height: '100%',
            }}
            src={mediaContentPending
              ? ''
              : `https://v.kr.kollus.com/s?jwt=${token}&custom_key=${kollus_custom_key}&player_version=v3`}
          />}
      </div>
    </Div>
  );
});

OnclassPlayerPage.getInitialProps = () => {
  return {hideTalk: true};
};

export default loginRequired(
  userTypeRequired(
    OnclassPlayerPage,
    [...MAIN_USER_TYPES, 'hani']
  )
);
