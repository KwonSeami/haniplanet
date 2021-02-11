import * as React from 'react';
import cn from 'classnames';
import {toDateFormat} from "../../../src/lib/date";
import Link from "next/link";
import {staticUrl} from "../../../src/constants/env";
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import DoctalkApi from '../../../src/apis/DoctalkApi';
import NaverKinBadge from '../../faq/NaverKinBadge';

interface IFaqItemProps extends IDocTalkFaq {
  id: HashId;
  category: string;
  created_at: string;
  onDelete: (pkId: HashId) => void;
}

const FaqItem: React.FC<IFaqItemProps> = ({
  id,
  index,
  category,
  region,
  age_and_gender,
  disease,
  created_at,
  question_title,
  onDelete,
  kin_url
}) => {
  const doctalkApi = useCallAccessFunc(access => new DoctalkApi(access));
  
  return (
    <li>
      <div className="table">
        <div className="left">
          <p className="number">{index + 1}</p>
        </div>
        <div>
          <p className="cate">{category}</p>
        </div>
        <div>
          <p className="date">{toDateFormat(created_at, 'YYYY.MM.DD')}</p>
        </div>
        <div>
          <p className="title">
            {kin_url && (
              <NaverKinBadge className="kin-badge"/>
            )}
            <em>{region} {age_and_gender} {disease}</em> - {question_title}
          </p>
        </div>
        <div className="right">
          <div className="btns">
            <Link
              href="/user/faq/[id]/edit"
              as={`/user/faq/${id}/edit`}
            >  
              <a 
                className={cn('btn', {
                  'btn--disabled': kin_url
                })}
                onClick={(e) => {
                  if (kin_url) {
                    e.preventDefault();
                    return null;
                  }

                  if(!confirm('해당 내용 수정 시 네이버 지식인에 수정사항이 재반영되지 않습니다.\n네이버 지식인에서 수정내용 재반영이 필요한 경우 닥톡 서비스 운영팀으로 연락드려주시기 바랍니다.')) {
                    e.preventDefault();
                  }
                }}
              >
                수정
              </a>  
            </Link>
            <span
              className={cn('btn', 'btn--icon', {
                'btn--disabled': kin_url
              })}
              onClick={() => {
                if (kin_url) {
                  return null;
                }

                if(confirm('해당 내용 삭제 시, 네이버 지식인에서는 삭제가 반영되지 않습니다.\n네이버 지식인에서의 삭제가 필요한 경우는 닥톡 서비스 운영팀으로 연락드려주시기 바랍니다.')) {
                  if(confirm('삭제하시겠습니까?')) {
                    doctalkApi.deleteFaq(id)
                      .then(() => onDelete(id))
                  }
                }
              }}
            >
              <img 
                src={staticUrl('/static/images/icon/icon-trash18x18.png')}
                alt="삭제"
              />
            </span>
          </div>
        </div>
      </div>
    </li>
  )
};

FaqItem.displayName = 'FaqItem';
export default React.memo(FaqItem);