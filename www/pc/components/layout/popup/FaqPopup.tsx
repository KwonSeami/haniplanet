import * as React from 'react';
import Loading from '../../common/Loading';
import Alert, {StyledButton} from '../../common/popup/Alert';
import {TitleDiv} from '../../common/popup/base/TitlePopup';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $BORDER_COLOR, $WHITE} from '../../../styles/variables.types';
import {FaqItemDiv, FAQButtonWrapper} from '../../faq/common';
import Tag from '../../UI/tag/Tag';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import DoctalkApi from '../../../src/apis/DoctalkApi';
import {toDateFormat} from '../../../src/lib/date';
import isEmpty from 'lodash/isEmpty';
import {under} from '../../../src/lib/numbers';
import NaverKinBtn from '../../faq/Button/NaverKinBtn';
import SourcePageBtn from '../../faq/Button/SourcePageBtn';

const StyleAlert = styled(Alert)`
  .modal-body {
    width: 680px;
    padding-bottom: 0;

    ${TitleDiv} {
      padding: 24px 45px 24px 20px;
      border-bottom: 1px solid ${$BORDER_COLOR};

      h2 {
        position: relative;
        padding-left: 18px;
        line-height: 1.22;
        ${fontStyleMixin({
          size: 15,
          color: $FONT_COLOR,
          weight: '600'
        })}

        &::before {
          position: absolute;
          left: 0;
          top: 50%;
          width: 11px;
          height: 5px;
          background-color: ${$FONT_COLOR};
          transform: translateY(-50%);
          content: '';
        }
      }
    }
  }

  ${StyledButton} {
    display: none;
  }
`;

const FaqWrapperDiv = styled.div`
  .faq-item-div-wrapper {
    max-height: 403px;
    margin-bottom: 1px solid ${$BORDER_COLOR};
    overflow-y: scroll;
    scrollbar-arrow-color : ${$WHITE};
    scrollbar-base-color: ${$WHITE};
    scrollbar-Face-Color: #ccc;
    scrollbar-Track-Color: ${$WHITE};
    scrollbar-DarkShadow-Color: ${$WHITE};
    scrollbar-Shadow-Color: ${$WHITE};
    scrollbar-3dLight-Color: ${$WHITE};
    scrollbar-Highlight-Color: ${$WHITE};
  
    &::-webkit-scrollbar {
      width:7px;
      height: 7px;
      background-color: transparent;
    }
  
    &::-webkit-scrollbar-track {
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      background-color: transparent;
    }
  
    &::-webkit-scrollbar-thumb {
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      background-color: ${$BORDER_COLOR};
    }

    & > div {
      padding: 20px 14px 20px 25px;
      & ~ div {
        border-top: 1px solid ${$BORDER_COLOR};
      }
  
      dt {
        padding-bottom: 20px;
  
        &.answer {
          padding-bottom: 0;
        }
      }
  
      dd {
        padding-top: 20px;
        border-top: 1px solid ${$BORDER_COLOR};
      }
  
      .answer ~ dd {
        margin-top: 7px;
        padding: 0;
        padding-left: 26px;
        border-top: 0;
      }
    }
  }

  .faq-button-wrapper {
    border-top: 1px solid ${$BORDER_COLOR};
    border-radius: 0 0 8px 8px;
  }

  em {
    font-weight: bold;
  }
`;

interface IStateProps {
  pending: boolean;
  faq: IDocTalkFaq;
}

const FaqPopup = ({
  faqId, 
  id,
  closePop
}) => {
  const doctalkApi = useCallAccessFunc(access => new DoctalkApi(access));
  const [{pending, faq}, setState] = React.useState<IStateProps>({
    pending: true,
    faq: {} as IDocTalkFaq,
  });

  React.useEffect(() => {
    doctalkApi.faq(faqId)
      .then(({data}) => setState({pending: false, faq: data}))
  }, [faqId]);

  const {
    region,
    age_and_gender,
    disease,
    question_title,
    question_body,
    asked_at,
    tags,
    user,
    answered_at,
    retrieve_count,
    answer,
    category,
    kin_url,
    source_url
  } = faq;

  return (
    <StyleAlert
      id={id}
      closePop={closePop}
      title="FAQ 상세보기"
    >
      {pending ? (
        <Loading/>
      ) : (
        <FaqWrapperDiv>
          <div className="faq-item-div-wrapper">
            <FaqItemDiv>
              <dl>
                <dt className="title">
                  <em>{region} {age_and_gender} {disease}</em> - {question_title}
                  <small>
                    <span>{toDateFormat(asked_at, 'YYYY.MM.DD')}</span>
                    <span>조회 {under(retrieve_count, 999)}</span>
                    <span className="category">{category}</span>
                    {kin_url && (
                      <span className="kin-url">네이버 지식iN</span>
                    )}
                  </small>
                </dt>
                <dd>
                  <pre>{question_body}</pre>
                  {!isEmpty(tags) && (
                    <div className="tags">
                      {tags.map(({id, name}) => (
                        <Tag 
                          id={id}
                          name={name}
                        />
                      ))}
                    </div>
                  )}
                </dd>
              </dl>
            </FaqItemDiv>
            <FaqItemDiv>
              <dl>
                <dt className="title answer">
                  {user.name}한의사 답변
                  <small>{toDateFormat(answered_at, 'YYYY.MM.DD')}</small>
                </dt>
                <dd>
                  <pre>{answer}</pre>
                </dd>
              </dl>
            </FaqItemDiv>
          </div>
          {(kin_url || source_url) && (
            <FAQButtonWrapper className="faq-button-wrapper">
              {kin_url && (
                <NaverKinBtn url={kin_url}/>
              )}
              {source_url && (
                <SourcePageBtn url={source_url}/>
              )}
            </FAQButtonWrapper>
          )}
        </FaqWrapperDiv>
      )}
    </StyleAlert>
  )
};

FaqPopup.displayName = 'FaqPopup';
export default React.memo(FaqPopup);