export const paginationFeedReduxStore = (fetchTime: any = '2020-04-27T03:03:02.525Z') => ({
  "system": {
    "session": {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTg4MDQyOTgyLCJqdGkiOiJlNDJlMjJjMjI5OTg0ZDlmYmJkMDAxNjc4MTM0OGYxNCIsInVpZCI6Ijk3OTAzYTJmLTBhYzktNDcwZi1iNDI3LTU3MWM5NTllMzViZiJ9.6H4k3QHuldm81CVJcxXsKBFKw-6Xt0LimH3cOckU6oY"
    }
  },
  "feed": {
    "/meetup/": {
      "error": {},
      "pending": false,
      "ids": [
        "pvu6O2-0",
        "WXuxRb-1",
        "4KuapJ-2",
        "AKumZO-3",
        "bzuxaO-4",
        "N4u5Mn-5",
        "PauRPA-6",
        "GKum8k-7",
        "qbur6x-8",
        "kNuWkb-9",
        "Q3uRrm-10",
        "dkuQJD-11",
        "AKumdO-12",
        "WXuxLz-13",
        "3KuADr-14",
        "eYuQm3-15",
        "pvu6ZX-16",
        "O9uM4Y-17",
        "dkuQ36-18",
        "4KuaGz-19"
      ],
      "count": 290,
      "next": "https://api.huplanet.kr/meetup/?category=&limit=20&meetup_status=&offset=20&place=&q=",
      "previous": null,
      "fetchTime": fetchTime,
    }
  },
  "orm": {
    "story": {
      "items": [
        "pvu6O2",
        "WXuxRb",
        "4KuapJ",
        "AKumZO",
        "bzuxaO",
        "N4u5Mn",
        "PauRPA",
        "GKum8k",
        "qbur6x",
        "kNuWkb",
        "Q3uRrm",
        "dkuQJD",
        "AKumdO",
        "WXuxLz",
        "3KuADr",
        "eYuQm3",
        "pvu6ZX",
        "O9uM4Y",
        "dkuQ36",
        "4KuaGz"
      ],
      "itemsById": {
        "pvu6O2": {
          "id": "pvu6O2",
          "title": "ㅁㄴㄹㅇ",
          "user": {
            "id": "nqUKK4",
            "name": "doc0002"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "wJwcd99p"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "deadline",
            "capacity": 111,
            "participate_count": 1,
            "coordinates": null,
            "address": null,
            "detail_address": null,
            "receipt_range": [
              "2020-04-24T09:26:00Z",
              "2020-04-27T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-29T02:11:00Z",
              "2020-04-30T03:45:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": true,
            "online_note": "asdff\r\nasdf\r\nasdf\r\nasdf\r\nasdfa\r\nsdfa\r\nsdfsa\r\ndfa\r\nf",
            "course_period": null,
            "onclass_build_status": "done",
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": null,
            "products": [
              {
                "id": "pQCvn",
                "name": "gks",
                "text": "",
                "price": 12,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-04-24T18:26:03.914501+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "WXuxRb": {
          "id": "WXuxRb",
          "title": "ㄴㅇㄹㄴㅇㄹ",
          "user": {
            "id": "PRUl4",
            "name": "김성구"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "qDmcpMM1"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "ongoing",
            "capacity": 111,
            "participate_count": 0,
            "coordinates": [
              127.0347727,
              37.4849717
            ],
            "address": "서울 강남구 강남대로 238",
            "detail_address": "ㅁㄴㅇㄹ",
            "receipt_range": [
              "2020-04-24T02:41:00Z",
              "2020-05-31T14:59:00Z"
            ],
            "progress_range": [
              "2020-06-05T02:22:00Z",
              "2020-06-05T13:22:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": false,
            "online_note": null,
            "course_period": null,
            "onclass_build_status": null,
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": {
              "id": 2,
              "name": "서울/강남구"
            },
            "products": [
              {
                "id": "WPC9P",
                "name": "한ㅇ의사",
                "text": "",
                "price": 0,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-04-24T11:40:13.149416+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "4KuapJ": {
          "id": "4KuapJ",
          "title": "213",
          "user": {
            "id": "nqUKK4",
            "name": "doc0002"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "6mecYBBw"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 123,
            "participate_count": 1,
            "coordinates": null,
            "address": null,
            "detail_address": null,
            "receipt_range": [
              "2020-04-10T05:44:00Z",
              "2020-04-13T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-14T02:11:00Z",
              "2020-04-14T13:22:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": true,
            "online_note": "123231231",
            "course_period": 312,
            "onclass_build_status": "done",
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": null,
            "products": [
              {
                "id": "bWCL7",
                "name": "312",
                "text": "",
                "price": 33,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": "beyondback"
              }
            ]
          },
          "created_at": "2020-04-10T14:44:05.196497+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "AKumZO": {
          "id": "AKumZO",
          "title": "세미나 제목",
          "user": {
            "id": "lqUqLO",
            "name": "임용빈"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "8lpcmrrW"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 123,
            "participate_count": 1,
            "coordinates": [
              128.5536122,
              35.892775
            ],
            "address": "대구 북구 3공단로 3",
            "detail_address": "상세 주소",
            "receipt_range": [
              "2020-04-08T07:57:00Z",
              "2020-04-11T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-12T02:22:00Z",
              "2020-04-15T13:22:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": false,
            "online_note": null,
            "course_period": 90,
            "onclass_build_status": null,
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": {
              "id": 40,
              "name": "대구/북구"
            },
            "products": [
              {
                "id": "vjC78",
                "name": "123",
                "text": "",
                "price": 0,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": "asdf32sa"
              }
            ]
          },
          "created_at": "2020-04-08T16:42:38.512922+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "bzuxaO": {
          "id": "bzuxaO",
          "title": "213",
          "user": {
            "id": "nqUKK4",
            "name": "doc0002"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "QQ4c8xxd"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 978,
            "participate_count": 0,
            "coordinates": null,
            "address": null,
            "detail_address": null,
            "receipt_range": [
              "2020-04-07T05:58:00Z",
              "2020-04-07T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-09T14:23:00Z",
              "2020-04-17T23:12:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": true,
            "online_note": "321",
            "course_period": null,
            "onclass_build_status": "done",
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": null,
            "products": [
              {
                "id": "OjC29",
                "name": "32",
                "text": "",
                "price": 23,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-04-07T14:58:19.412816+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "N4u5Mn": {
          "id": "N4u5Mn",
          "title": "학생 세미나",
          "user": {
            "id": "kKUXm5",
            "name": "정유석"
          },
          "tags": [
            {
              "id": "aBSLLW",
              "name": "test",
              "is_follow": false,
              "m2m_id": "2jocvxxE"
            },
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "11OSb33p"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 123,
            "participate_count": 0,
            "coordinates": [
              127.0396503,
              37.495772
            ],
            "address": "서울 강남구 논현로 340",
            "detail_address": "301호",
            "receipt_range": [
              "2020-01-11T03:00:00Z",
              "2020-03-27T03:00:00Z"
            ],
            "progress_range": [
              "2020-04-30T22:20:00Z",
              "2020-05-31T10:50:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": false,
            "online_note": null,
            "course_period": null,
            "onclass_build_status": null,
            "category": "취미/소모임",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-club.png",
            "region": {
              "id": 5,
              "name": "서울/송파구"
            },
            "products": [
              {
                "id": "ndCnq",
                "name": "한의사",
                "text": "",
                "price": 0,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              },
              {
                "id": "ZnCYb",
                "name": "학생",
                "text": "",
                "price": 0,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "student"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-04-03T13:16:49.653390+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "PauRPA": {
          "id": "PauRPA",
          "title": "312",
          "user": {
            "id": "ORUDWQ",
            "name": "임용빈"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "xdYcGvvG"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 132,
            "participate_count": 0,
            "coordinates": [
              127.0002841,
              37.641282
            ],
            "address": "서울 강북구 4.19로32길 15-6",
            "detail_address": "32",
            "receipt_range": [
              "2020-04-02T09:10:00Z",
              "2020-04-02T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-03T02:11:00Z",
              "2020-04-03T13:22:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": false,
            "online_note": null,
            "course_period": null,
            "onclass_build_status": null,
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": {
              "id": 14,
              "name": "서울/강북구"
            },
            "products": [
              {
                "id": "EeCb5",
                "name": "231",
                "text": "",
                "price": 231,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-04-02T18:10:07.859545+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "GKum8k": {
          "id": "GKum8k",
          "title": "231",
          "user": {
            "id": "ORUDWQ",
            "name": "임용빈"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "34kh1wwG"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 123,
            "participate_count": 0,
            "coordinates": [
              128.5536122,
              35.892775
            ],
            "address": "대구 북구 3공단로 3",
            "detail_address": "123",
            "receipt_range": [
              "2020-04-02T09:02:00Z",
              "2020-04-02T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-03T02:11:00Z",
              "2020-04-03T13:22:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": false,
            "online_note": null,
            "course_period": null,
            "onclass_build_status": null,
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": {
              "id": 40,
              "name": "대구/북구"
            },
            "products": [
              {
                "id": "PzCBW",
                "name": "123",
                "text": "",
                "price": 3,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-04-02T18:02:10.683843+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "qbur6x": {
          "id": "qbur6x",
          "title": "123",
          "user": {
            "id": "ORUDWQ",
            "name": "임용빈"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "9jkcOdP3"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 231,
            "participate_count": 0,
            "coordinates": [
              128.5536122,
              35.892775
            ],
            "address": "대구 북구 3공단로 3",
            "detail_address": "123",
            "receipt_range": [
              "2020-04-02T08:58:00Z",
              "2020-04-02T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-03T02:11:00Z",
              "2020-04-03T13:22:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": false,
            "online_note": null,
            "course_period": null,
            "onclass_build_status": null,
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": {
              "id": 40,
              "name": "대구/북구"
            },
            "products": [
              {
                "id": "wzCPw",
                "name": "123",
                "text": "",
                "price": 123,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-04-02T17:58:35.185526+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "kNuWkb": {
          "id": "kNuWkb",
          "title": "123",
          "user": {
            "id": "PRUl4",
            "name": "김성구"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "ed3cvNJ5"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 12,
            "participate_count": 1,
            "coordinates": [
              127.0196641,
              37.5223765
            ],
            "address": "서울 강남구 압구정로 102",
            "detail_address": "sad",
            "receipt_range": [
              "2020-04-02T08:10:00Z",
              "2020-04-14T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-15T02:22:00Z",
              "2020-04-24T11:22:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": false,
            "online_note": null,
            "course_period": null,
            "onclass_build_status": null,
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": {
              "id": 2,
              "name": "서울/강남구"
            },
            "products": [
              {
                "id": "YNC3m",
                "name": "dfs",
                "text": "",
                "price": 123,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-04-02T17:10:38.918719+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "Q3uRrm": {
          "id": "Q3uRrm",
          "title": "31",
          "user": {
            "id": "ORUDWQ",
            "name": "임용빈"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "KzdcQaYD"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 23,
            "participate_count": 0,
            "coordinates": [
              126.8145115,
              37.0811972
            ],
            "address": "경기 화성시 우정읍 3.1만세로 1",
            "detail_address": "31",
            "receipt_range": [
              "2020-04-02T03:58:00Z",
              "2020-04-02T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-03T02:11:00Z",
              "2020-04-03T13:22:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": false,
            "online_note": null,
            "course_period": null,
            "onclass_build_status": null,
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": {
              "id": 119,
              "name": "경기/화성시"
            },
            "products": [
              {
                "id": "M8Cl9",
                "name": "31",
                "text": "",
                "price": 31,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-04-02T12:58:52+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "dkuQJD": {
          "id": "dkuQJD",
          "title": "uunmvgzp",
          "user": {
            "id": "WMUMMr",
            "name": "WMUMMr"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "pO5cbNAq"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 11,
            "participate_count": 3,
            "coordinates": null,
            "address": null,
            "detail_address": null,
            "receipt_range": [
              "2020-04-02T03:55:00Z",
              "2020-04-02T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-03T03:34:00Z",
              "2020-04-03T03:34:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": false,
            "online_note": "uunmvgzp",
            "course_period": null,
            "onclass_build_status": null,
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": null,
            "products": [
              {
                "id": "j2Cnn",
                "name": "uunmvgzp",
                "text": "",
                "price": 0,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-04-02T12:55:02.275168+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "AKumdO": {
          "id": "AKumdO",
          "title": "123",
          "user": {
            "id": "nqUKK4",
            "name": "doc0002"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "G72iKJZJ"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 123,
            "participate_count": 0,
            "coordinates": [
              126.8340001,
              35.17621
            ],
            "address": "광주 광산구 2순환로 2474",
            "detail_address": "213",
            "receipt_range": [
              "2020-04-01T09:31:00Z",
              "2020-04-01T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-02T03:33:00Z",
              "2020-04-02T03:35:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": false,
            "online_note": "",
            "course_period": null,
            "onclass_build_status": null,
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": {
              "id": 8,
              "name": "광주/광산구"
            },
            "products": [
              {
                "id": "2NCN2",
                "name": "123",
                "text": "",
                "price": 123,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-04-01T18:31:47.136421+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "WXuxLz": {
          "id": "WXuxLz",
          "title": "ㅁㄴㄹ",
          "user": {
            "id": "ORUOO5",
            "name": "doc0005"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "YnBcj2zL"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 12,
            "participate_count": 0,
            "coordinates": [
              127.0440534,
              37.4813361
            ],
            "address": "서울 강남구 양재천로 163",
            "detail_address": "ㅁㅇㄴㄹ",
            "receipt_range": [
              "2020-04-07T08:04:00Z",
              "2020-04-16T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-17T02:11:00Z",
              "2020-04-20T04:33:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": false,
            "online_note": "",
            "course_period": null,
            "onclass_build_status": null,
            "category": "취미/소모임",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-club.png",
            "region": {
              "id": 2,
              "name": "서울/강남구"
            },
            "products": [
              {
                "id": "aoCWq",
                "name": "ㅁㄴㅇㄹ",
                "text": "",
                "price": 0,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              },
              {
                "id": "3nC79",
                "name": "ㄹㄷㄹ",
                "text": "",
                "price": 3,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-04-01T17:05:49.422958+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "3KuADr": {
          "id": "3KuADr",
          "title": "testestes",
          "user": {
            "id": "kKUXm5",
            "name": "정유석"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "kpXcBN6P"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 234,
            "participate_count": 2,
            "coordinates": null,
            "address": null,
            "detail_address": null,
            "receipt_range": [
              "2020-04-01T03:02:00Z",
              "2020-04-22T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-23T16:01:00Z",
              "2020-04-23T19:04:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": true,
            "online_note": "sadf",
            "course_period": 432,
            "onclass_build_status": "done",
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": null,
            "products": [
              {
                "id": "4ZC7x",
                "name": "gs",
                "text": "",
                "price": 1000,
                "sale_price": 900,
                "sale_start_at": "2020-03-26T01:48:04Z",
                "sale_end_at": "2020-04-03T01:48:14Z",
                "user_types": [
                  "doctor"
                ],
                "band_slug": "callbacktest"
              },
              {
                "id": "97CLw",
                "name": "gsd",
                "text": "",
                "price": 1000,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "student"
                ],
                "band_slug": "callbacktest"
              }
            ]
          },
          "created_at": "2020-04-01T12:03:04+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "eYuQm3": {
          "id": "eYuQm3",
          "title": "취소 테스트",
          "user": {
            "id": "DbUKKL",
            "name": "정유석"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "zEKcJlQp"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 32,
            "participate_count": 2,
            "coordinates": null,
            "address": null,
            "detail_address": null,
            "receipt_range": [
              "2020-03-31T11:57:00Z",
              "2020-04-17T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-17T16:01:00Z",
              "2020-04-17T20:05:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": true,
            "online_note": "sadfsad",
            "course_period": 2341,
            "onclass_build_status": "done",
            "category": "취미/소모임",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-club.png",
            "region": null,
            "products": [
              {
                "id": "AlCzk",
                "name": "asdf",
                "text": "",
                "price": 0,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": "callbacktest"
              },
              {
                "id": "eaCMz",
                "name": "sadf",
                "text": "",
                "price": 0,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "student"
                ],
                "band_slug": "callbacktest"
              }
            ]
          },
          "created_at": "2020-03-31T20:57:43.216522+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "pvu6ZX": {
          "id": "pvu6ZX",
          "title": "ㅎㄷㅎㄷㅎㅂ",
          "user": {
            "id": "nqUKK4",
            "name": "doc0002"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "6mecYBvw"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "end",
            "capacity": 10,
            "participate_count": 1,
            "coordinates": [
              127.0347727,
              37.4849717
            ],
            "address": "서울 강남구 강남대로 238",
            "detail_address": "102휴",
            "receipt_range": [
              "2020-03-31T05:44:00Z",
              "2020-04-03T14:59:00Z"
            ],
            "progress_range": [
              "2020-04-04T01:00:00Z",
              "2020-04-05T03:00:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": false,
            "online_note": "",
            "course_period": null,
            "onclass_build_status": null,
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": {
              "id": 2,
              "name": "서울/강남구"
            },
            "products": [
              {
                "id": "2NC7w",
                "name": "0",
                "text": "",
                "price": 1000,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              },
              {
                "id": "pQCMn",
                "name": "1",
                "text": "",
                "price": 1000,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "student"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-03-31T17:13:55.655026+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "O9uM4Y": {
          "id": "O9uM4Y",
          "title": "마음고생 줄이는 인테리어 꿀팁) 할인률 정상 테스트",
          "user": {
            "id": "1pUb8a",
            "name": "정윤재"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "Eklcw5YM"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "deadline",
            "capacity": 999,
            "participate_count": 4,
            "coordinates": null,
            "address": null,
            "detail_address": null,
            "receipt_range": [
              "2020-03-31T05:54:00Z",
              "2020-04-30T14:59:00Z"
            ],
            "progress_range": [
              "2020-05-01T02:11:00Z",
              "2020-05-01T02:15:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": true,
            "online_note": "할인률 결제 테스트입니다.",
            "course_period": 50,
            "onclass_build_status": "done",
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/story/images/af113637-44fc-455a-becb-77c653fd4427.png",
            "region": null,
            "products": [
              {
                "id": "97CLl",
                "name": "한의사",
                "text": "",
                "price": 1000,
                "sale_price": 100,
                "sale_start_at": "2020-03-31T06:02:34Z",
                "sale_end_at": "2020-03-31T14:59:00Z",
                "user_types": [
                  "doctor"
                ],
                "band_slug": "sblinterior"
              },
              {
                "id": "aoCWj",
                "name": "한의대생",
                "text": "",
                "price": 1000,
                "sale_price": 100,
                "sale_start_at": "2020-03-31T06:03:01Z",
                "sale_end_at": "2020-03-31T14:59:00Z",
                "user_types": [
                  "student"
                ],
                "band_slug": "sblinterior"
              }
            ]
          },
          "created_at": "2020-03-31T14:57:56+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "dkuQ36": {
          "id": "dkuQ36",
          "title": "촉이온다의 경영론 2부 : 뉴로마케팅 아이큐",
          "user": {
            "id": "1pUb8a",
            "name": "정윤재"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "qDmcpMR9"
            }
          ],
          "images": [
            {
              "id": 0,
              "image": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/story/images/50569349-e18f-43e0-99dd-d663627a3bac.png"
            }
          ],
          "extension": {
            "partial": true,
            "status": "ongoing",
            "capacity": 999,
            "participate_count": 10,
            "coordinates": null,
            "address": null,
            "detail_address": null,
            "receipt_range": [
              "2020-03-31T02:59:00Z",
              "2021-03-31T14:59:00Z"
            ],
            "progress_range": [
              "2021-04-01T02:11:00Z",
              "2021-04-02T02:15:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": true,
            "online_note": "A 촉이온다의 경영론 2부 : 뉴로마케팅 아이큐\r\n\r\n1-1.강의소개(100자이내)\r\nA 촉이온다의 경영 3부작 중 2부! `그로스 아이큐`를 통해 한의사가 한의원에서 접할 수 있는 경영이론의 총론을 정리하고 이후 적용의 틀을 세울 수 있는 강의입니다",
            "course_period": 50,
            "onclass_build_status": "done",
            "category": "교육/강연",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-lecture.png",
            "region": null,
            "products": [
              {
                "id": "eaCMW",
                "name": "한의사",
                "text": "",
                "price": 0,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": "grossIQ"
              },
              {
                "id": "4ZC7b",
                "name": "한의대생",
                "text": "",
                "price": 0,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "student"
                ],
                "band_slug": "grossIQ"
              }
            ]
          },
          "created_at": "2020-03-31T12:03:25+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        },
        "4KuaGz": {
          "id": "4KuaGz",
          "title": "마음고생 줄이는 인테리어 꿀팁",
          "user": {
            "id": "DbUKKL",
            "name": "정유석"
          },
          "tags": [
            {
              "id": "54S4A6",
              "name": "세미나/모임",
              "is_follow": false,
              "m2m_id": "YnBcj2z4"
            }
          ],
          "images": [],
          "extension": {
            "partial": true,
            "status": "ongoing",
            "capacity": 500,
            "participate_count": 1,
            "coordinates": null,
            "address": null,
            "detail_address": null,
            "receipt_range": [
              "2020-03-31T02:24:00Z",
              "2020-06-26T14:59:00Z"
            ],
            "progress_range": [
              "2020-07-01T01:00:00Z",
              "2020-07-01T08:00:00Z"
            ],
            "is_cancelled": false,
            "is_online_meetup": true,
            "online_note": "온라인",
            "course_period": null,
            "onclass_build_status": "done",
            "category": "스터디",
            "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/images/static/meetup-study.png",
            "region": null,
            "products": [
              {
                "id": "KmCXa",
                "name": "인테리아",
                "text": "",
                "price": 180000,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "doctor"
                ],
                "band_slug": null
              },
              {
                "id": "AlCzr",
                "name": "학새",
                "text": "",
                "price": 180000,
                "sale_price": null,
                "sale_start_at": null,
                "sale_end_at": null,
                "user_types": [
                  "student"
                ],
                "band_slug": null
              }
            ]
          },
          "created_at": "2020-03-31T11:26:26.401107+09:00",
          "my_apply": null,
          "applies": null,
          "is_follow": false
        }
      }
    },
    "tag": {
      "items": [],
      "itemsById": {
        "54S4A6": {
          "id": "54S4A6",
          "name": "세미나/모임",
          "is_follow": false,
          "m2m_id": "YnBcj2z4"
        },
        "aBSLLW": {
          "id": "aBSLLW",
          "name": "test",
          "is_follow": false,
          "m2m_id": "2jocvxxE"
        }
      }
    },
    "tagList": {},
    "storyHasTag": {
      "sortByStory": {
        "pvu6O2": [
          "54S4A6"
        ],
        "WXuxRb": [
          "54S4A6"
        ],
        "4KuapJ": [
          "54S4A6"
        ],
        "AKumZO": [
          "54S4A6"
        ],
        "bzuxaO": [
          "54S4A6"
        ],
        "N4u5Mn": [
          "aBSLLW",
          "54S4A6"
        ],
        "PauRPA": [
          "54S4A6"
        ],
        "GKum8k": [
          "54S4A6"
        ],
        "qbur6x": [
          "54S4A6"
        ],
        "kNuWkb": [
          "54S4A6"
        ],
        "Q3uRrm": [
          "54S4A6"
        ],
        "dkuQJD": [
          "54S4A6"
        ],
        "AKumdO": [
          "54S4A6"
        ],
        "WXuxLz": [
          "54S4A6"
        ],
        "3KuADr": [
          "54S4A6"
        ],
        "eYuQm3": [
          "54S4A6"
        ],
        "pvu6ZX": [
          "54S4A6"
        ],
        "O9uM4Y": [
          "54S4A6"
        ],
        "dkuQ36": [
          "54S4A6"
        ],
        "4KuaGz": [
          "54S4A6"
        ]
      },
      "sortByTag": {
        "54S4A6": [
          "pvu6O2"
        ],
        "aBSLLW": [
          "N4u5Mn"
        ]
      }
    },
    "band": {
      "items": [],
      "itemsById": {}
    },
    "bandHasTimeline": {
      "sortByBand": {},
      "sortByTimeline": {}
    },
    "timeline": {
      "items": [],
      "itemsById": {}
    },
    "user": {
      "items": [],
      "itemsById": {
        "lqUqLO": {
          "id": "lqUqLO",
          "avatar": null,
          "name": "임용빈",
          "nick_name": "xeHlzB",
          "user_type": "doctor",
          "auth_id": "meis1***",
          "email": "meis1541@naver.com",
          "gender": null,
          "phone": "01000000000",
          "birth": "2000-11-22T00:00:00Z",
          "zonecode": null,
          "road_address": null,
          "jibun_address": null,
          "address_detail": null,
          "is_save_search": true,
          "is_sms_receive": true,
          "is_email_receive": true,
          "is_regular": true,
          "password_updated_at": "2019-06-12T03:53:12.761050Z",
          "password_warned_at": "2020-04-08T07:45:50.813767Z",
          "rested_at": null,
          "status": "active",
          "searched": [],
          "alarm_count": 11,
          "is_proxy_join": false,
          "point": 180,
          "withdrawal_ongoing_points": 0,
          "doctor_number": null,
          "student_number": null,
          "school": null,
          "is_streamer": false,
          "is_doctalk_doctor": false,
          "is_admin": false,
          "hospital_slug": null,
          "signed_onclass_count": 0,
          "managing_onclass_count": 0,
          "signed_moa_count": 1,
          "managing_moa_count": 0,
          "ongoing_member_moa_count": 0,
          "ongoing_moa_count": 0,
          "reqStatus": 200
        },
        "nqUKK4": {
          "id": "nqUKK4",
          "name": "doc0002"
        },
        "PRUl4": {
          "id": "PRUl4",
          "name": "김성구"
        },
        "kKUXm5": {
          "id": "kKUXm5",
          "name": "정유석"
        },
        "ORUDWQ": {
          "id": "ORUDWQ",
          "name": "임용빈"
        },
        "WMUMMr": {
          "id": "WMUMMr",
          "name": "WMUMMr"
        },
        "ORUOO5": {
          "id": "ORUOO5",
          "name": "doc0005"
        },
        "DbUKKL": {
          "id": "DbUKKL",
          "name": "정유석"
        },
        "1pUb8a": {
          "id": "1pUb8a",
          "name": "정윤재"
        }
      }
    },
    "userFollowList": {
      "sortByFollower": {},
      "sortByFollowee": {}
    },
    "userList": {},
    "member": {
      "items": [],
      "itemsById": {}
    },
    "memberList": {}
  }
});
