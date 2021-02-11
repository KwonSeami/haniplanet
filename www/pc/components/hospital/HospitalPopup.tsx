import * as React from 'react';
import {PopupProps} from '../common/popup/base/Popup';
import styled from 'styled-components';
import {TitleDiv} from '../common/popup/base/TitlePopup';
import {fontStyleMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import {$FONT_COLOR, $TEXT_GRAY, $GRAY, $BORDER_COLOR, $POINT_BLUE, $WHITE} from '../../styles/variables.types';
import { staticUrl } from '../../src/constants/env';
import Button from '../inputs/Button/ButtonDynamic';
import Confirm from '../common/popup/Confirm';
import SearchBaseInput from '../inputs/Input/SearchBaseInput';
import Radio, { Span } from '../UI/Radio/Radio';
importimport Link from 'next/link';

const StyledConfirm = styled(Confirm)`
  .modal-body {
    width: 680px;

    ${TitleDiv} h2 {
      position: relative;
      padding: 8px 0 9px 41px;
      ${fontStyleMixin({
        size: 15,
        weight: 'bold'
      })}

      &::after {
        content: '';
        position: absolute;
        top: 16px;
        left: 25px;
        width: 11px;
        height: 5px;
        background-color: ${$FONT_COLOR};
      }
    }
  }
`;

const HospitalPopupDiv = styled.div`
  .hospital-search-top {
    position: relative;
    padding: 10px 15px 10px 110px;
    border-bottom: 1px solid ${$BORDER_COLOR};

    h2 {
      position: absolute;
      left: 15px;
      top: 22px;
      font-size: 13px;
    }
  }

  .search-result {
    padding: 0 15px;

    h3 {
      padding: 26px 0 7px;
      ${fontStyleMixin({
        size: 15,
        weight: 'bold'
      })}

      span {
        ${fontStyleMixin({
          size: 15,
          weight: 'bold',
          color: $POINT_BLUE
        })}
      }
    }
  }

  ul {
    max-height: 490px;
    overflow-y: auto;
    border-bottom: 1px solid ${$BORDER_COLOR};

    li {
      position: relative;
      border-top: 1px solid ${$BORDER_COLOR};

      & > a {
        display: block;
        position: absolute;
        top: 50%;
        right: 20px;
        z-index: 1;
        margin-top: -26px;

        img {
          width: 54px;
        }
      }
    }
  }
`;

const StyledSearchBaseInput = styled(SearchBaseInput)`
  position: relative;
  height: 40px;
  box-sizing: border-box;
  border: 1px solid ${$BORDER_COLOR};

  input {
    width: 100%;
    height: 38px;
    padding: 0 40px 0 10px;
    font-size: 14px;
  }

  img {
    width: 36px;
    position: absolute;
    right: -2px;
    top: 2px;
  }
`;

const StyledRadio = styled(Radio)`
  position: relative;

  label {
    width: 100%;
    padding: 20px 90px 20px 176px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 14,
      color: $GRAY
    })}
  }

  ${Span} {
    margin: -12px 20px 0;
    top: 50%;
  }

  .hospital-img {
    position: absolute;
    width: 91px;
    height: 73px;
    left: 65px;
    top: 50%;
    margin-top: -38px;
    ${backgroundImgMixin({
      img: staticUrl("/static/images/graphic/img-complete.png")
    })}
  }

  h2 {
    padding-bottom: 5px;
    ${fontStyleMixin({
      size: 18,
      weight: '600'
    })}

    .keyword {
      ${fontStyleMixin({
        weight: '600',
        color: $POINT_BLUE
      })}
    }
  }
`;

const NoContentText = styled.p`
  padding: 37px 25px;
  border-top: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;
  text-align: center;
  background-color: #f5f7f9;
  ${fontStyleMixin({
    size: 14,
    color: $TEXT_GRAY
  })}

  img {
    display: block;
    margin: auto;
    width: 25px;
    padding-bottom: 8px;
  }
`;

const HospitalPopup: React.FC<PopupProps> = React.memo(({id, closePop}) => {
  const [query, setQuery] = React.useState('');
  const [isSearched, setIsSearched] = React.useState(false);
  const [count, setCount] = React.useState(10);

  return (
    <StyledConfirm
      id={id}
      closePop={closePop}
      title="한의원 검색"
    >
      <HospitalPopupDiv>
        <div className="hospital-search-top">
          <h2>근무지</h2>
          <StyledSearchBaseInput
            placeholder="키워드를 입력해주세요."
            searchBtn={
              <img
                src={staticUrl('/static/images/icon/icon-search.png')}
                alt="통합검색"
              />
            }
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.persist();
              setQuery(e.target.value);
            }}
          />
        </div>
        {isSearched && (
          // count는 임시
          <div className="search-result">
            {!!count ? (
              <>
                <h3>검색결과 <span>{count}</span></h3>
                <ul>
                  <li>
                    <StyledRadio>
                      {/* TODO: 임시 이미지 넣어놨습니다. 배경이미지 props로 바꿔주세요 */}
                      <div className="hospital-img" />
                      <h2>
                        <span className="keyword">한의원</span> 명
                      </h2>
                      {`인천 여수구 ㄴ어린어라니ㅓㅇ리넝라ㅓ닝러니;런러;나ㅓㅇㄹ;넝라ㅣㄴ;ㅓㄹㄴ;얼;`}
                    </StyledRadio>
                    <a
                      href="1"
                      target="_blank"
                    >
                      <img
                        src={staticUrl("/static/images/icon/arrow/icon-arrow-link.png")}
                        alt="바로가기"
                      />
                    </a>
                  </li>
                  <li>
                    <StyledRadio>
                      <div className="hospital-img" />
                      <h2>
                        <span className="keyword">한의원</span> 명
                      </h2>
                      {`인천 여수구 ㄴ어린어라니ㅓㅇ리넝라ㅓ닝러니;런러;나ㅓㅇㄹ;넝라ㅣㄴ;ㅓㄹㄴ;얼;`}
                    </StyledRadio>
                    <a
                      href="1"
                      target="_blank"
                    >
                      <img
                        src={staticUrl("/static/images/icon/arrow/icon-arrow-link.png")}
                        alt="바로가기"
                      />
                    </a>
                  </li>
                </ul>
              </>
            ) : (
              <NoContentText>
                <img
                  src={staticUrl("/static/images/icon/icon-no-content.png")}
                  alt="작성된 글이 없습니다."
                />
                등록된 한의원이 없습니다.<br/>
                재직중 등록은 사전에 한의원이 등록되어 있어야 가능합니다.
              </NoContentText>
            )}
          </div>
        )}
      </HospitalPopupDiv>
    </StyledConfirm>
  );
});

export default HospitalPopup;
