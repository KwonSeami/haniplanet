import * as React from 'react';
import {pushPopup} from '../../src/reducers/popup';
import FaqPopup from '../layout/popup/FaqPopup';
import {useDispatch} from 'react-redux';
import {backgroundImgMixin, fontStyleMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import {$FONT_COLOR, $BORDER_COLOR} from '../../styles/variables.types';
import styled from 'styled-components';

interface IFaqProps extends IDocTalkFaq{
  id: HashId;
}

const FaqItemLi = styled.li`
  padding: 14px 0;
  
  & ~ & {
    border-top: 1px solid ${$BORDER_COLOR};
  }

  em {
    font-style: normal;
  }

  dt, dd {
    position: relative;
    padding-left: 35px;

    &::before {
      position: absolute;
      left:0;
      top: 0;
      width: 30px;
      height: 21px;
      font-size: 0;
    }
  }

  dt {
    padding-right: 13px;
    line-height: 22px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
    ${fontStyleMixin({
      size: 15,
      color: $FONT_COLOR
    })}
    &::before {
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/icon-faq-question.png'),
        size: '100% auto'
      })}
      content: 'Q';
    }
    &::after {
      position: absolute;
      right: 0px;
      top: 0;
      width: 13px;
      height: 100%;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/arrow/arrow-right-lightgray13x13.png'),
        size: '100% auto',
      })};
      content: '';
    }

    em {
      font-weight: bold;
    }
  }
  dd {
    margin-top: 7px;
    padding-bottom: 2px;
    line-height: 19px;
    display: -webkit-box;
    -webkit-line-clamp: 2; 
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    ${fontStyleMixin({
      size: 13,
      color: '#999'
    })}
    &::before {
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/icon-faq-answer.png'),
        size: '100% auto'
      })}
      content: 'A';
    }
  }
`;
  
const MedicalTeamFaq: React.FC<IFaqProps> = ({
  id,
  region,
  age_and_gender,
  disease,
  question_title,
  question_body,
}) => {
  const dispatch = useDispatch();
  const userInfoLength = [region, age_and_gender, disease].reduce((prevValue: number, currentValue: string) => {
    return prevValue + (currentValue || []).length;
  }, 0);
  

  return (
    <FaqItemLi>
      <dl>
        <dt 
          onClick={() => {
            dispatch(pushPopup(FaqPopup, {
              faqId: id
            }))
          }}
        >
          <em>{region} {age_and_gender}/{disease}</em> - {question_title.substring(0, (28-userInfoLength))}
        </dt>
        <dd>{question_body}</dd>
      </dl>
    </FaqItemLi>
  )
};

MedicalTeamFaq.displayName = 'MedicalTeamFaq';
export default React.memo(MedicalTeamFaq);