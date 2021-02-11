import gql from 'graphql-tag';

export const MY_APPLIES = gql`
  query MyApplies (
    $limit: Int
    $offset: Int
    $merchant_uid: String
  ) {
    my_applies (
      limit: $limit
      offset: $offset
      merchant_uid: $merchant_uid
    ) {
      count
      nodes {
        id
        merchant_uid
        quantity
        price
        status
        story {
          id
          title
        }
        payment {
          created_at
        }
        track {
          progress
        }
      }
    }
  }
`;

export const MY_APPLY = gql`
  query MyApply($merchant_uid: String) {
    my_applies(merchant_uid: $merchant_uid) {
      nodes {
        id
        merchant_uid
        quantity
        price
        created_at
        status
        sale_price
        sale_perc
        is_able_to_cancel
        address {
          zonecode
          road_address
          jibun_address
          address_detail 
          can_receive_on_weekend
          request
          phone
        }
        product {
          name
          text
          price
        }
        story {
          id
          title
          images
          extend_to
        }
        payment {
          pay_method
        }
        shinhan {
          card_name
        }
        track {
          track_id
          delivery_fee
          progress
          carrier {
            carrier_id
            name
            tel
          }
        }
        cancels {
            price
            reason
        }
      }
    }
  }
`
