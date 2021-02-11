import * as React from 'react';
import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import {setLayout} from '../../../src/reducers/system/style/styleReducer';
import {$BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';
import {fontStyleMixin, heightMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import Tag from '../../../components/UI/tag/Tag';
import Link from 'next/link';
import {staticUrl} from '../../../src/constants/env';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import DoctalkApi from '../../../src/apis/DoctalkApi';
import {useRouter} from 'next/router';
import Loading from '../../../components/common/Loading';
import {toDateFormat} from '../../../src/lib/date';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import Page401 from '../../../components/errors/Page401';
import NaverKinBadge from '../../../components/faq/NaverKinBadge';
import NaverKinBtn from '../../../components/faq/Button/NaverKinBtn';
import SourcePageBtn from '../../../components/faq/Button/SourcePageBtn';

interface IStateProps {
  pending: boolean;
  faq: IDocTalkFaq;
}

const WrapperDiv = styled.div`
  dl {
    padding: 20px 15px;

    & ~ dl {
      border-top: 1px solid ${$BORDER_COLOR}
    }

    dt {
      position: relative;
      padding-bottom: 15px;
      border-bottom: 1px solid ${$BORDER_COLOR};
      line-height: 24px;
      ${fontStyleMixin({
        size: 16,
        color: $FONT_COLOR
      })};

      a {
        position: absolute;
        right: 0;
        top: 0;
        padding-right: 11px;
        line-height: inherit;
        text-decoration: underline;
        ${fontStyleMixin({
          size: 11,
          color: $TEXT_GRAY
        })};

        &::after {
          position: absolute;
          right: 0;
          top:0;
          width: 11px;
          height: 100%;
          ${backgroundImgMixin({
            img: staticUrl('/static/images/icon/arrow/arrow-right-gray11x11.png'),
            size: '100% auto'
          })};
          content: '';
        }
      }

      p {
        em {
          font-style: normal;
          font-weight: bold;
        }

        &::before {
          margin-right: 2px;
          ${fontStyleMixin({
            size: 20,
            color: '#9dd287',
            weight: 'bold',
            family: 'Montserrat'
          })};
          content: 'Q.';
        }
      }

      i {
        display: inline-block;
        margin-bottom: 11px;
        padding: 0 8px;
        border: 1px solid #eee;
        font-style: normal;
        ${fontStyleMixin({
          size: 12,
          color: '#999'
        })}
        ${heightMixin(24)}
      }

      .kin-badge {
        position: relative;
        top: 1px;
        margin-left: 6px;
      }
    }

    dd {
      margin-top: 15px;
      ${fontStyleMixin({
        size: 16,
        color: $FONT_COLOR
      })};
      
      .tags {
        margin-top: 18px;

        .tag {
          margin-right: 8px;
          padding: 0;
          background-color: #f4f4f4;
          ${fontStyleMixin({
            size: 14,
            color: $TEXT_GRAY
          })};
        }
      }

      small {
        display: block;
        margin-top: 15px;
        line-height: 1.5;
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY
        })};

        .edited {
          display: inline-block;
          margin-left: 11px;
          padding: 0 7px;
          height: 18px;
          line-height: inherit;
          color: #bbb;
          background-color: #f9f9f9;
          border-radius: 9px;
        }
      }

      .tags ~ small {
        margin-top: 15px;
      }
    }

    &.answer dt p {
      font-weight: 600;

      &::before {
        color: #72a6e8;
        content: 'A.';
      }
    }

    &.check {
      padding: 30px 64px 40px 64px;
      text-align: center;

      button {
        &:first-child {
          margin-right: 10px;
        }

        &:last-child {
          margin-top: 10px;
        }
      }
    }
  }
`;

const FaqDetail: React.FC = () => {
  const dispatch = useDispatch();
  const {query: {id}} = useRouter();
  const doctalkApi = useCallAccessFunc(access => new DoctalkApi(access));
  React.useEffect(() => {
    dispatch(setLayout({
      headerDetail: 'FAQ상세',
      isNewWindow: true
    }))
  }, []);
  const [{
    pending,
    faq,
    errorCode
  }, setState] = React.useState<IStateProps>({
    pending: true,
    faq: {},
    errorCode: 0
  });

  React.useEffect(() => {
    doctalkApi.faq(id)
      .then(({data, status}) => {
        if(Math.floor(status / 100) === 4) {
          setState(curr => ({
            ...curr,
            pending: false,
            errorCode: status
          }))
        } else {
          setState({
            pending: false,
            faq: data
          })
        }
      })
  }, [id]);
  
  if (pending) {
    return <Loading/>
  }

  if (errorCode === 401) {
    return <Page401/>
  }
  
  const {
    category,
    question_title,
    question_body,
    answer,
    created_at,
    updated_at,
    region,
    age_and_gender,
    disease,
    retrieve_count,
    user: {id: userId, name},
    tags,
    asked_at,
    answered_at,
    kin_url,
    source_url
  } = faq;

  const isEdited = moment(updated_at).diff(created_at, 'second') > 1;

  return (
    <WrapperDiv>
      <dl className="question">
        <dt>
          <i>{category}</i>
          {kin_url && (
            <NaverKinBadge className="kin-badge"/>
          )}
          <p>
            <em>{region} {age_and_gender} {disease}</em> - {question_title}
          </p>          
        </dt>
        <dd>
          <p className="pre-wrap">{question_body}</p>
          {!isEmpty(tags) && (
            <div className="tags">
              {tags.map(({id, name}) => (
                <Tag
                  className="tag"
                  key={id}
                  id={id}
                  name={name}
                />
              ))}
            </div>
          )}
          <small>
            {toDateFormat(asked_at, 'YYYY.MM.DD')} · 조회 {retrieve_count}
            {isEdited && (
              <span className="edited">수정됨</span>
            )}
          </small>
        </dd>
      </dl>
      <dl className="answer">
        <dt>
          <p>{name} 한의사 답변</p>
          <Link
            href="/user/[id]/faq"
            as={`/user/${userId}/faq`}
          >
            <a>FAQ 목록보기 </a>
          </Link>
        </dt>
        <dd>
          <p className="pre-wrap">{answer}</p>
          <small>{toDateFormat(answered_at, 'YYYY.MM.DD')}</small>
        </dd>
      </dl>
      <dl className="check">
        {kin_url && (
          <NaverKinBtn url={kin_url}/>
        )}
        {source_url && (
          <SourcePageBtn url={source_url}/>
        )}
      </dl>
    </WrapperDiv>
  );
};

FaqDetail.displayName = 'FaqDetail';
export default React.memo(FaqDetail);