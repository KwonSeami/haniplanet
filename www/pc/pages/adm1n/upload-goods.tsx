import * as React from 'react';
import loginRequired from "../../hocs/loginRequired";
import adminRequired from "../../hocs/adminRequired";
import * as XLSX from 'xlsx';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import { BASE_URL } from "../../src/constants/env";
import { useSelector } from "react-redux";
import { axiosInstance } from "@hanii/planet-apis";
import { fontStyleMixin } from '../../styles/mixins.styles';
import { $BORDER_COLOR, $FONT_COLOR, $GRAY, $WHITE } from '../../styles/variables.types';

const Div = styled.div`
  .header-box {
    height: 160px;
    background-color: #f3f5f7;
    overflow: hidden;

    h2 {
      width: 1125px;
      margin: 80px auto 0;
      ${fontStyleMixin({
  size: 30,
  weight: '300',
})};
    }
  }

  .admin-wrapper {
    margin: 0 auto 150px;
    max-width: 1125px;
    overflow: hidden;

    .upload-box {
      margin: 25px 0 30px;

      li {
        display: inline-block;
        vertical-align: top;

        & ~ li {
          margin-left: 20px;
        }

        label {
          display: inline-block;
          width: 100px;
          padding: 5px 0 6px;
          text-align: center;
          ${fontStyleMixin({
  size: 14,
  color: $GRAY
})};
          border-radius: 2px;
          border: 1px solid ${$BORDER_COLOR};
          transition: all 0.3s;

          &:hover {
            color: ${$WHITE};
            border-color: ${$FONT_COLOR};
            background-color: ${$FONT_COLOR};
          }
        }

        input[type="file"] {
          display: none;
        }
      }
    }

    .table-box {
      h3 {
        font-size: 18px;
        margin-bottom: 10px;
      }

      > div {
        width: 100%;
        overflow-x: scroll;
        border: 1px solid ${$BORDER_COLOR};
        border-top: 2px solid ${$FONT_COLOR};
        box-sizing: border-box;

        table {
          width: 100%;
          border-color: ${$BORDER_COLOR};
          border-style: hidden;

          th, td {
            white-space: nowrap;
          }
          
          th {
            padding: 12px 10px;
            font-size: 14px;
          }

          td {
            padding: 10px;

            ul {
              li {
                display: inline-block;
                vertical-align: middle;
                max-height: 500px;
                overflow: hidden;

                img {
                  display: inline-block;
                  vertical-align: middle;
                  width: 220px;
                  max-width: inherit;
                }

                & ~ li img {
                  margin-left: 5px;
                }
              }
            }

            button {
              vertical-align: middle;
              margin-right: 5px;
              padding: 2px 5px;
              border-radius: 2px;
              border: 1px solid ${$BORDER_COLOR};
              background-color: ${$WHITE};
            }

            p {
              display: inline-block;
              vertical-align: middle;
            }

            &.td-images {
              white-space: normal;

              ul {
                white-space: nowrap;
              }
            }

            .requested {
              display: block;
              margin-top: 10px;
              white-space: normal;
              
              blockquote {
                margin: 0;
              }
            }
          }
        }
      }

      > button {
        display: inline-block;
        width: 100px;
        margin-top: 20px;
        padding: 5px 0 6px;
        text-align: center;
        ${fontStyleMixin({
  size: 14,
  color: $GRAY
})};
        border-radius: 2px;
        border: 1px solid ${$BORDER_COLOR};
        transition: all 0.3s;

        &:hover {
          color: ${$WHITE};
          border-color: ${$FONT_COLOR};
          background-color: ${$FONT_COLOR};
        }
      }
    }
  }
`;

const Button = styled.button`
`;

const UploadGoods = () => {
  const { access } = useSelector(({ system: { session: { access } } }) => ({
    access,
  }));
  const [row, setRow] = React.useState({});
  const [canSubmit, setCanSubmit] = React.useState(true);
  const [bodyImageMap, setBodyImageMap] = React.useState({});
  const [imagesMap, setImagesMap] = React.useState({});
  const [resultMap, setResultMap] = React.useState({});

  console.log(row);
  return (
    <Div>
      <div className="header-box">
        <h2>상품 업로드하기</h2>
      </div>
      <div className="admin-wrapper">
        <ul className="upload-box">
          <li>
            <div>
              <label
                htmlFor="ex-file"
                className="pointer"
              >
                엑셀 업로드
              </label>
              <input
                type="file"
                id="ex-file"
                onChange={event => {
                  const input = event.target;
                  const reader = new FileReader();

                  reader.onload = function () {
                    const fileData = reader.result;
                    const wb = XLSX.read(fileData, { type: 'binary' });
                    const _row = {};

                    wb.SheetNames.forEach(function (sheetName) {
                      const rowArr = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
                      _row[sheetName] = rowArr;
                    })

                    setRow(_row);
                    setCanSubmit(true);
                  };

                  reader.readAsBinaryString(input.files[0]);
                }}
              />
            </div>
          </li>
          <li>
            <div>
              <label
                htmlFor="ex-img"
                className="pointer"
              >
                이미지 업로드
              </label>
              <input
                type="file"
                id="ex-img"
                onChange={e => {
                  for (let i = 0, len = e.target.files.length; i < len; i++) {
                    const file = e.target.files[i];
                    const name = file.name;
                    const [firstColumnValue, fileIndex] = name.split('-');
                    const reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onload = () => {
                      const callback = (idxSeek: number) => curr => {
                        const order = Number(fileIndex[idxSeek]);
                        const newArr = [
                          ...(curr[firstColumnValue] || []),
                          { file, result: reader.result, order: !Number.isNaN(order) ? order : 0 }
                        ];
                        newArr.sort(({ order: prevOrder }, { order: nextOrder }) => {
                          if (prevOrder > nextOrder) {
                            return 1;
                          }
                          if (prevOrder < nextOrder) {
                            return -1;
                          }
                          // a must be equal to b
                          return 0;
                        });

                        return {
                          ...curr,
                          [firstColumnValue]: newArr,
                        };
                      };
                      if (['B', 'b'].includes(fileIndex[0])) {
                        setBodyImageMap(callback(1));
                      } else {
                        setImagesMap(callback(0));
                      }
                    };
                  }
                }}
                multiple
              />
            </div>
          </li>
        </ul>
        {!isEmpty(row) && (
          <div className="table-box">
            {Object.keys(row).map((sheetName) => {
              return (
                <>
                  <h3>시트명: {sheetName}</h3>
                  <div>
                    <table border="1">
                      <tr key="-1">
                        {Object.keys(row[sheetName][1]).map((head) => {
                          return (
                            <th key={head}>{head}</th>
                          )
                        })}
                        <th key="body_image">본문 이미지</th>
                        <th key="images">상품 이미지</th>
                        <th key="result">요청 결과</th>
                      </tr>
                      {row[sheetName].slice(1).map((excelRow, _idx) => {
                        const firstColumnValue = excelRow[Object.keys(excelRow)[0]];
                        const idx = _idx + 1; // slice 했기 때문에 원래의 idx 를 찾도록 함
                        const res = resultMap[firstColumnValue];
                        const status = res ? res.status : null;

                        return (
                          <tr key={idx}
                              style={{ backgroundColor: status ? status === 201 ? '#7da877' : '#ee5c5c' : 'transparent' }}>
                            {Object.keys(excelRow).map((head) => {
                              const cell = excelRow[head];
                              return (
                                <td key={head}>
                                  <input type="text" value={cell} onChange={e => setRow(curr => ({
                                    ...curr,
                                    [sheetName]: curr[sheetName].map((_row, _rowIdx) => idx === _rowIdx
                                      ? { ..._row, [head]: e.target.value }
                                      : _row)
                                  }))}/>
                                </td>
                              )
                            })}
                            <td key="body_image">
                              {bodyImageMap[firstColumnValue] && (
                                <ul>
                                  {bodyImageMap[firstColumnValue].map(({ result }, idx) => (
                                    <li>
                                      <img src={result} alt=""/>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </td>
                            <td key="images" className="td-images">
                              {imagesMap[firstColumnValue] && (
                                <ul>
                                  {imagesMap[firstColumnValue].map(({ result }, idx) => (
                                    <li key={idx}>
                                      <img src={result} alt=""/>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </td>
                            <td key="result" className="td-result">
                              <button
                                className="pointer"
                                onClick={() =>
                                  setRow(curr => ({
                                    ...curr,
                                    [sheetName]: curr[sheetName].filter((_, _idx) => idx !== _idx)
                                  }))
                                }
                              >
                                삭제
                              </button>
                              {resultMap[firstColumnValue] ? (
                                <p className="requested">
                                  요청함
                                  <blockquote>
                                    {JSON.stringify(resultMap[firstColumnValue])}
                                  </blockquote>
                                </p>
                              ) : (
                                <p>요청 없음</p>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </table>
                  </div>
                  {(canSubmit || true) && (
                    <Button
                      className="pointer"
                      onClick={() => {
                        const [keyMap, ...data] = row[sheetName];
                        data.forEach((excelRow, idx) => {
                          const form = new FormData();

                          Object.keys(excelRow).forEach((key) => {
                            const bodyKey = keyMap[key];
                            if (bodyKey) {
                              let value = excelRow[key];
                              if (key.includes(', 구분')) {
                                String(value).split(',').forEach(val => {
                                  form.append(bodyKey, val.trim());
                                });
                              } else if (key.includes('개행 구분')) {
                                String(value).split('\n').forEach(val => {
                                  form.append(bodyKey, val.trim());
                                });
                              } else {
                                form.append(bodyKey, value);
                              }
                            }
                          });

                          const firstColumnValue = excelRow[Object.keys(excelRow)[0]];

                          const bodyImage = bodyImageMap[firstColumnValue];
                          const images = imagesMap[firstColumnValue];

                          if (bodyImage && bodyImage.length) {
                            bodyImage.map(({ file }) => {
                              form.append('body_image', file);
                            })
                          }

                          if (images && images.length) {
                            images.map(({ file }) => {
                              form.append('image', file)
                            })
                          }

                          axiosInstance({
                            baseURL: BASE_URL,
                            token: access,
                            errorCallback: () => {
                            }
                          }).post(
                            '/shopping/goods/',
                            form
                          )
                            .then(res => setResultMap(curr => ({ ...curr, [firstColumnValue]: res })))
                            .catch(err => setResultMap(curr => ({ ...curr, [firstColumnValue]: err.response })));
                        })
                        setCanSubmit(false);
                      }}
                    >
                      일괄 생성
                    </Button>
                  )}
                </>
              )
            })}

          </div>
        )}
      </div>
    </Div>
  );
};

export default loginRequired(adminRequired(UploadGoods));
