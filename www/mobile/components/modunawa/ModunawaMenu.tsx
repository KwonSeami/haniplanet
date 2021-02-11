import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import queryString from 'query-string';
import {useRouter} from 'next/router';
import {CardMenuLi, CardMenuUl, SubMenuUl, SubMenuLi} from '../common/Menu';
import {BASE_URL, staticUrl} from '../../src/constants/env';
import {axiosInstance} from '@hanii/planet-apis';
import {shallowEqual, useSelector} from 'react-redux';
import {TAG_ON_MAP, TAGS} from '../../pages/modunawa';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';

const VerticalScrollDiv = styled.div`
  width: 100%;
  overflow: auto;
  white-space: nowrap;
`;

const tagBgImg = {
  '소모품/의료기기': staticUrl('/static/images/banner/img-modunawa-goods.jpg'),
  '원외탕전': staticUrl('/static/images/banner/img-modunawa-extract.jpg'),
  '원외탕전 약속상품': staticUrl('/static/images/banner/img-modunawa-promise.jpg'),
  '한약재 회사': staticUrl('/static/images/banner/img-modunawa-company.jpg'),
  '한약제제': staticUrl('/static/images/banner/img-modunawa-manufactured.jpg'),
  '인테리어': staticUrl('/static/images/banner/img-modunawa-interior.jpg'),
  '한의학 도서': staticUrl('/static/images/banner/img-modunawa-book.jpg'),
  '세무기장': staticUrl('/static/images/banner/img-modunawa-tax.jpg'),
  '기타': staticUrl('/static/images/banner/img-modunawa-etc.jpg'),
}

const ModunawaMenu = () => {
  const [tagCount, setTagCount] = React.useState([]);
  const {query: {tag: _tagQuery, order_by: _orderByQuery}} = useRouter();

  const token = useSelector(
    ({system: {session: {access}}}) => access,
    shallowEqual,
  );

  React.useEffect(() => {
    axiosInstance({baseURL: BASE_URL, token}).get('/price-comparison/count/')
      .then(({status, data: {results}}) => {
        if (status === 200) {
          setTagCount(
            results.reduce((prev, {name, stories_count}) => ({
              ...prev,
              [name]: stories_count,
            }), {})
          );
        }
      });
  }, [token]);
  const activeTab = TAGS[TAG_ON_MAP[_tagQuery as string]] || [];
  return (
    <VerticalScrollDiv>
      <CardMenuUl>
        <CardMenuLi
          key="전체"
          on={!_tagQuery}
          className={cn({on: !_tagQuery})}
        >
          <Link
            as="/modunawa"
            href="/modunawa"
            passHref
            replace
          >
            <div>
              <a>
                <p>전체</p>
                <span>{tagCount['전체']}</span>
              </a>
            </div>
          </Link>
        </CardMenuLi>
        {Object.keys(TAGS).map((tagName) => {
          const subTag = TAGS[tagName];

          const on = tagName === _tagQuery || subTag.includes(_tagQuery);
          const query = queryString.stringify({
            tag: tagName
          });

          return (
            <CardMenuLi
              key={tagName}
              on={on}
              bgImg={tagBgImg[tagName]}
              className={cn({on})}
            >
              <Link
                as={`/modunawa?${query}`}
                href={`/modunawa?${query}`}
                passHref
                replace
              >
                <div>
                  <a>
                    <p>{tagName.replace('/', `/\n`)}</p>
                    <span>{tagCount[tagName] || 0}</span>
                  </a>
                </div>
              </Link>
            </CardMenuLi>
          );
        })}
      </CardMenuUl>
      {(!isEmpty(activeTab)) && (
        <SubMenuUl>
          {activeTab.map(tagName => {
            const on = tagName === _tagQuery;
            const query = queryString.stringify({
              tag: tagName,
              order_by: _orderByQuery
            });

            return (
              <SubMenuLi
                key={tagName}
                on={on}
                className={cn({on})}
              >
                <Link
                  as={`/modunawa?${query}`}
                  href={`/modunawa?${query}`}
                  passHref
                  replace
                >
                  <a>
                    <strong>{tagName}</strong>
                    <span>{tagCount[tagName] || 0}</span>
                  </a>
                </Link>
              </SubMenuLi>
            );
          })}
        </SubMenuUl>
      )}
    </VerticalScrollDiv>
  );
};

export default React.memo(ModunawaMenu);