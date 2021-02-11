import * as React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {MY_ADDRESS} from '../../../src/gqls/shopping';
import {IAddress} from '../../../src/@types/shopping';
import Alert from '../../common/popup/Alert';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import Loading from '../../common/Loading';
import {NoContent} from '../../community/common';
import {AddressPopupWrapper} from '../../shopping/style/order';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';


const StyleAlert = styled(Alert)`
  .modal-body {
    width: 680px;
    padding: 21px 25px 35px;

    .popup-title {
      position: relative;
      padding: 0;
      padding-bottom: 27px;
      border-bottom: 1px solid ${$FONT_COLOR};
  
      h2 {
        position: relative;
        padding-left: 18px;
        ${fontStyleMixin({
          size: 15,
          weight: 'bold',
        })};
  
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          width: 11px;
          height: 5px;
          background-color: ${$FONT_COLOR};
        }
      }

      span {
        top: -6px;
        right: 0;
      }
    }
  }
`;

interface IProps {
  onSelect: (data: IAddress) => void;
}

const PAGE_SIZE = 5;

const AddressPopup: React.FC<IProps> = ({
  id,
  closePop,
  onSelect
}) => {
  const variables = {
    limit: PAGE_SIZE,
    offset: 0
  }
  const {
    loading,
    data: {my_addresses} = {my_addresses},
    fetchMore
  } = useQuery(MY_ADDRESS, {
    variables
  });
  
  const {
    nodes,
    count
  } = my_addresses || {};


  return (
    <StyleAlert
      id={id}
      closePop={closePop}
      title="배송지 목록" 
      isButtonShow={false}      
    >
      <AddressPopupWrapper>
        <div className="content-frame">
          {loading 
          ? <Loading/> 
          : isEmpty(nodes) 
            ? <NoContent>배송지 목록이 없습니다.</NoContent>
            : (
              <ul>
                {nodes.map((props) => {
                  const {
                    id: addressId,
                    name,
                    phone,
                    zonecode,
                    road_address,
                    jibun_address,
                    address_detail,
                  }:IAddress = props;

                  return (
                    <li key={addressId}>
                      <h2>{name}</h2>
                      <p>
                        <span>[{zonecode}]</span>&nbsp;
                        {road_address || jibun_address} {address_detail}
                      </p>
                      <p>{phone}</p>
                      <button
                        type="button"
                        onClick={() => {
                          onSelect && onSelect(props);
                          closePop(id);
                        }}
                      >
                        선택
                      </button>
                    </li>
                  )
                })}
              </ul>
          )}
        </div>
        {(!isEmpty(nodes) && count > nodes.length) && (
          <footer>
            <button 
              onClick={() => {
                fetchMore({
                  variables: {
                    ...variables,
                    offset: nodes.length
                  },
                  updateQuery: (prev, {fetchMoreResult}) => {
                    const {
                      my_addresses: {
                        nodes,
                        ...rest
                      }
                    } = fetchMoreResult || {} as any;

                    if(isEmpty(nodes)) return prev;

                    const {
                      my_addresses: {
                        nodes: prevNodes,
                      }
                    } = prev as any;

                    return {
                      my_addresses: {
                        nodes: [
                          ...prevNodes,
                          ...nodes
                        ],
                        ...rest
                      }
                    }
                  }
                })
              }}
            >
              더보기
              <img src={staticUrl('/static/images/icon/arrow/icon-profile-shortcut.png')}/>
            </button>
          </footer>
        )}
      </AddressPopupWrapper>
    </StyleAlert>
  )
};

AddressPopup.displayName = 'AddressPopup';
export default React.memo(AddressPopup);