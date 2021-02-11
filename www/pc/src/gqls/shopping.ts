import gql from 'graphql-tag';

export const SOBS = gql`
  query SOBS(
    $offset: Int
    $limit: Int
    $q: String
    $tag_name: String
    $order_by: SobsOrderByEnum
    $query: SobsQueryEnum
  ) {
    goods_categories {
      tag {
        name
      }
      children {
        tag {
          name
        }
      }
      null_text
    }
    sobs (
      offset: $offset,
      limit: $limit,
      q: $q,
      tag_name: $tag_name,
      order_by: $order_by,
      query: $query
    ) {
      nodes {
        id
        title
        is_follow
        images
        is_sold_out
        products {
          price
          capacity
          sale_price
          sale_start_at
          sale_end_at
        }
        goods {
          manufacturer
          is_expose_card_price
        }
      }
      total_count
    }
  }
`;

export const SOB = gql`
  query SOB($id: String!) {
    sob (id: $id){
      title
      body
      images
      is_sold_out
      is_follow
      body_images {
        image
      }
      tags {
        goods_categories {
          notice_html
        }
      }
      products {
        id
        name
        price
        capacity
        sale_price
        sale_start_at
        sale_end_at
      }
      goods {
        detail_name
        origin
        manufacturer
        max_amount
        min_amount
        volume
        delivery_notice
        payment_notice
        refund_notice
        as_notice
        service_center
        delivery_fee
        delivery_fee_free_over
        unit_price
        is_expose_card_price
      }
      descriptions {
        id
        title
        description
      }
    }
  }
`;

export const GOODS_CATEGORY = gql`
  query GoodsCategory {
    sobs_count
    goods_categories {
      id
      goods_count
      tag {
        name
      }
      children {
        id
        goods_count
        tag {
          name
          id
        }
      }
    }
  }
`;


export const MY_MERCHANT_UIDS = gql`
  query MyMerchantUids($limit: Int
    $offset: Int
    $start_at: Date!
    $end_at: Date!
    $story_extend_to: IStoryExtendToEnum
    $track_progresses: [IDeliveryTrackProgressEnum]
    $apply_statuses: [StoryApplyStatusEnum]
  ) {
    my_merchant_uids (
      limit: $limit
      offset: $offset
      start_at: $start_at
      end_at: $end_at
      story_extend_to: $story_extend_to
    ) {
      count
      nodes {
        merchant_uid
        created_at
        applies (track_progresses: $track_progresses, apply_statuses: $apply_statuses){
          id
          merchant_uid
          quantity
          price
          status
          is_able_to_cancel
          story {
            id
            title
            images
            extend_to
          }
          track {
            track_id
            progress
            carrier {
              carrier_id
            }
          }
        }
      }
    }
  }
`

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
          images
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
`;

export const MY_ADDRESS = gql`
  query MyAddress ($limit: Int, $offset: Int) {
    my_addresses (limit: $limit, offset: $offset){
      count
      nodes {
        id
        name
        phone
        zonecode
        road_address
        jibun_address
        address_detail
        can_receive_on_weekend
        request
      }
    }
  }
`;

