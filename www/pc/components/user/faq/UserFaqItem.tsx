import * as React from 'react';
import styled from "styled-components";
import {FaqItemDiv, FAQButtonWrapper} from "../../faq/common";
import {$BORDER_COLOR, $GRAY, $FONT_COLOR, $TEXT_GRAY, $THIN_GRAY} from "../../../styles/variables.types";
import {fontStyleMixin} from "../../../styles/mixins.styles";
import {staticUrl} from "../../../src/constants/env";
import {toDateFormat} from "../../../src/lib/date";
import classNames from 'classnames';
import Tag from '../../UI/tag/Tag';
import moment from 'moment';
import NaverKinBtn from '../../faq/Button/NaverKinBtn';
import SourcePageBtn from '../../faq/Button/SourcePageBtn';

const FaqItemSimpleDiv = styled.li`
  position: relative;
  padding: 25px 28px;
  border-top: 1px solid ${$BORDER_COLOR};
  transition: border 0.4s;
  cursor: pointer;

  &:hover {
    border-top-color: ${$GRAY};

    &::after {
      opacity: 1;
    }
  }

  &::after {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 40px;
    opacity: 0;
    transition: all 0.4s;
    background-color: #f9f9f9;
    background-image: url(${staticUrl('/static/images/icon/arrow/icon-story-unfold-arrow.png')});
    background-size: 13px 6px;
    background-position: center;
    background-repeat: no-repeat;
    content: '';
  }
  
  p {
    position: relative;
    margin-left: -26px;
    padding-left: 26px;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ${fontStyleMixin({
      size: 16,
      color: $FONT_COLOR
    })};

    &::before {
      position: absolute;
      left: 0;
      top: 0;
      color: inherit;
      line-height: inherit;
      content: 'Q.';
      ${fontStyleMixin({
        size: 20,
        weight: 'bold',
        family: 'Montserrat'
      })}
    }

    em {
      font-style: normal;
      font-weight: bold;
    }
  }

  small {
    display: block;
    margin-top: 6px;
    line-height: 1.5;
    ${fontStyleMixin({
      size: 12,
      color: $TEXT_GRAY
    })};
    
    span {
      position: relative;
      & ~ span {
        margin-left: 10px;

        &::before {
          position: absolute;
          left: -10px;
          top: 0;
          width: 10px;
          text-align: center;
          content: '·';
          color: ${$THIN_GRAY};
        }
      }

      &.category {
        color: #90b0d7;
      }

      &.kin-url {
        color: #6dc057;
      }

      &.edited {
        display: inline-block;
        padding: 0 7px;
        height: 18px;
        margin-left: 4px;
        line-height: inherit;
        color: #bbb;
        background-color: #f9f9f9;
        border-radius: 9px;

        &::before {
          display: none;
        }
      }
    }
  }
`;

const FaqItemDetailDiv = styled(FaqItemDiv)`
  margin-bottom: 25px;
  border: 1px solid ${$BORDER_COLOR};
  border-top-color: ${$GRAY};

  dl {
    & ~ dl {
      border-top: 1px solid ${$BORDER_COLOR};
    }
  }
  
  dt.title {
    padding: 25px 47px 25px 56px;

    &::before {
      top: 25px;
      left: 28px;
    }
    
    button {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 40px;
      transform: rotate(180deg);
      background-color: #f9f9f9;
      background-image: url(${staticUrl('/static/images/icon/arrow/icon-story-unfold-arrow.png')});
      background-size: 13px 6px;
      background-position: center;
      background-repeat: no-repeat;
      font-size: 0;
    }

    &.answer {
      padding-bottom: 0;
    }
  }

  dd {
    padding: 27px 28px 29px 28px;
    border-top: 1px solid ${$BORDER_COLOR};
  }

  .answer ~ dd {
    margin-top: 7px;
    padding-top: 0;
    padding-left: 54px;
    border-top: 0;
  }

  em {
    font-weight: bold;
  }

  .faq-button-wrapper {
    height: 80px;
    border-top: 1px solid ${$BORDER_COLOR};
  }
`;

interface IProps extends IDocTalkFaq {
  user: {
    id: HashId;
    name: string;
    avatar: string;
  };
  updated_at?: string;
  created_at: string;
  tags: ITag[];
  retrieve_count: string;
}

const UserFaqItem: React.FC<IProps> = ({
  region,
  age_and_gender,
  disease,
  question_title,
  question_body,
  answer,
  updated_at,
  created_at,
  category,
  retrieve_count,
  user,
  tags,
  asked_at,
  answered_at,
  kin_url,
  source_url
}) => {
  const [isDetail, setIsDetail] = React.useState(false);
  const isEdited = moment(updated_at).diff(created_at, 'second') > 1;
  const {name} = user;

  return (
    <li>
      {!isDetail ? (
        <FaqItemSimpleDiv
          onClick={() => setIsDetail(curr => !curr)}
          className={classNames({
            active: isDetail
          })}
        >
          <p>
            <em>{region} {age_and_gender} {disease}</em> - {question_title}
          </p>
          <small>
            <span>{toDateFormat(asked_at, 'YYYY.MM.DD')}</span>
            <span>조회수 {retrieve_count}</span>
            <span className="category">{category}</span>
            {kin_url && (
              <span className="kin-url">네이버 지식iN</span>
            )}
            {isEdited && (
              <span className="edited">수정됨</span>
            )}
          </small>
        </FaqItemSimpleDiv>
      ) : (
        <FaqItemDetailDiv>
          <dl>
            <dt 
              className="title"
            >
              <em>{region} {age_and_gender} {disease}</em> - {question_title}
              <small>
                <span>{toDateFormat(asked_at, 'YYYY.MM.DD')}</span>
                <span>조회수 {retrieve_count}</span>
                <span className="category">{category}</span>
                {kin_url && (
                  <span className="kin-url">네이버 지식iN</span>
                )}
                {isEdited && (
                  <span className="edited">수정됨</span>
                )}
              </small>
              <button 
                type="button"
                className="pointer"
                onClick={() => setIsDetail(false)}
              >
                닫기
              </button>
            </dt>
            <dd>
              <pre>{question_body}</pre>
              {tags && (
                <div className="tags">
                  {tags.map(({name, id}) => (
                    <Tag 
                      name={name} 
                      id={id}
                    />
                  ))}
                </div>
              )}
            </dd>
          </dl>
          <dl>
            <dt className="title answer">
              {name} 한의사 답변
              <small>{toDateFormat(answered_at, 'YYYY.MM.DD')}</small>
            </dt>
            <dd>
              <pre>{answer}</pre>
            </dd>
          </dl>
          <FAQButtonWrapper className="faq-button-wrapper">
            {kin_url && (
              <NaverKinBtn url={kin_url}/>
            )}
            {source_url && (
              <SourcePageBtn url={source_url}/>
            )}
          </FAQButtonWrapper>
        </FaqItemDetailDiv>
      )}
    </li>
  )
};


UserFaqItem.displayName = 'UserFaqItem';
export default React.memo(UserFaqItem);
