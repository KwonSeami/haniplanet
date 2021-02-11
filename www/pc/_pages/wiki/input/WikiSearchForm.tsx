import * as React from 'react';
import cn from 'classnames';
import union from 'lodash/union';
import isEmpty from 'lodash/isEmpty';
import ReactSlider from 'react-slider';
import useWikiDetailSearch from '../lib/useWikiDetailSearch';
import KeyWordHighlight from '../../../components/common/KeyWordHighlight';
import classNames from 'classnames';
import {BtnGroupUl, BtnUl, Button, Input, RangeLi, TagListUl, DetailSearchInput, AutoCompleteUl, SearchDetailDiv} from './style';
import {$POINT_BLUE} from '../../../styles/variables.types';


interface Props {
  clearImg: string;
  onDetailSearch: (params: any) => void;
}


const WikiSearchForm = React.memo<Props>(
  ({clearImg, onDetailSearch}) => {
    const {
      MIN_DEPEND,
      MAX_DEPEND,
      MIN_PRICE,
      MAX_PRICE,
      SHAPES,
      SOURCES,
      incluDepend,
      setIncluDepend,
      excluDepend,
      setExcluDepend,
      incluTag,
      setIncluTag,
      excluTag,
      setExcluTag,
      throttledSearchAutoCompletedWiki,
      throttledSearchAutoCompletedTag,
      autoCompletedWikis = [],
      autoCompletedTags = [],
      setAutoCompletedWiki,
      setAutoCompletedTag,
      DEFAULT_PARAMS_OF_STATE,
      params = DEFAULT_PARAMS_OF_STATE,
      setParams,
    } = useWikiDetailSearch();
    
    const {
      include_dependencies,
      exclude_dependencies,
      min_dependency_count,
      max_dependency_count,
      shapes,
      category,
      include_tags,
      exclude_tags,
      min_price,
      max_price,
    } = params;

    const autoCompleteFn = (
      value: string,
      list: Array<{name: string; chn_name: string;}>,
      focusIndex: number,
      keywordValue: string,
      onSelect: (value: any) => void
    ) => (
      value.length >= 2 && (
        <AutoCompleteUl className={cn({open: !isEmpty(list)})}>
          {(list || []).map((wiki,index) => {
            const {name, chn_name} = wiki;

            return (
              <li
                className={classNames('pointer', {
                  active: focusIndex === index
                })}
                key={name}
                onClick={() => onSelect(wiki)}
              >
                <h4>
                  <KeyWordHighlight
                    text={name}
                    keyword={keywordValue}
                    color={$POINT_BLUE}
                  />
                  <span> {chn_name}</span>
                </h4>
              </li>
            );
          })}
        </AutoCompleteUl>
      )
    );

    const autoCompleteSubmit = (value: string | string[], arrName: string) => {
      const data = params[arrName] || [];
      const values = union(
        typeof value === 'string'
          ? [
            ...data,
            value
          ]
          : [
            ...data,
            ...value
          ]
      );
      
      setParams(curr => ({
        ...curr,
        [arrName]: values
      }))
    }
    
    const autoCompleteDelete = (name: string, arrName: string) => {
      setParams(curr => ({
        ...curr,
        [arrName]: curr[arrName].filter((_name: string) => _name !== name)
      }));
    }

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
      <SearchDetailDiv className="on">
        <ul className="detail-search-area">
          <li>
            <h3>
              <span>포함 약재/처방</span>
            </h3>
            <div>
              <DetailSearchInput
                value={incluDepend}
                clearImg={clearImg}
                onChange={(value) => {
                  const _incluDepend = value.trim();

                  if(_incluDepend !== incluDepend) {
                    if (_incluDepend.length >= 2) {
                      throttledSearchAutoCompletedWiki({
                        q: _incluDepend,
                        limit: 5,
                      })
                    }

                    setIncluDepend(_incluDepend);
                  }
                }}
                onEnter={(wiki:any) => {
                  if (!!wiki) {
                    const {name, children_dependencies, doc_type} = wiki;
                  
                    const values = doc_type === 'medicine'
                      ? children_dependencies.map(({child: {name}}: any) => name)
                      : [name];

                    autoCompleteSubmit(values, 'include_dependencies')
                    setIncluDepend('');
                    setAutoCompletedWiki([]);
                  }
                }}
                autoCompleteList={autoCompletedWikis}
                autoCompleteFn={(focusIndex, keywordValue) => {
                  return autoCompleteFn(incluDepend, autoCompletedWikis, focusIndex, keywordValue, wiki => {
                    const {name, children_dependencies, doc_type} = wiki;
                    const values = doc_type === 'medicine'
                      ? children_dependencies.map(({child: {name}}: any) => name)
                      : [name];

                    autoCompleteSubmit(values, 'include_dependencies');
                    setIncluDepend('');
                    setAutoCompletedWiki([]);
                  })
                }}
              />
              <TagListUl
                tagDeleteImg={clearImg}
              >
                {!isEmpty(include_dependencies) && (
                  include_dependencies.map((name) => {
                    return (
                      <li
                        key={name}
                        onClick={() => autoCompleteDelete(name, 'include_dependencies')}
                      >
                        {name}
                      </li>
                    );
                  })
                )}
              </TagListUl>
            </div>
          </li>
          <li>
            <h3>
              <span>제외할 약재/처방</span>
            </h3>
            <div>
              <DetailSearchInput
                value={excluDepend}
                clearImg={clearImg}
                onChange={value => {
                  const _excluDepend = value.trim();

                  if (_excluDepend !== excluDepend) {
                    if(_excluDepend.length >= 2) {
                      throttledSearchAutoCompletedWiki({
                        q: _excluDepend,
                        limit: 5,
                      });
                    }

                    setExcluDepend(_excluDepend);
                  }
                }}
                onEnter={(wiki:any) => {
                  if (!!wiki) {
                    const {name, children_dependencies, doc_type} = wiki;
                  
                    const values = doc_type === 'medicine'
                      ? children_dependencies.map(({child: {name}}: any) => name)
                      : [name];

                    autoCompleteSubmit(values, 'exclude_dependencies');
                    setExcluDepend('');
                    setAutoCompletedWiki([]);
                  }
                }}
                autoCompleteList={autoCompletedWikis}
                autoCompleteFn={(focusIndex, keywordValue) => {
                  return autoCompleteFn(excluDepend, autoCompletedWikis, focusIndex, keywordValue, wiki => {
                    const {name, children_dependencies, doc_type} = wiki;
                    const values = doc_type === 'medicine'
                      ? children_dependencies.map(({child: {name}}: any) => name)
                      : [name];

                    values = values.filter((value: string) => !(include_dependencies as string[]).includes(value));
                    autoCompleteSubmit(values, 'exclude_dependencies');
                    setExcluDepend('');
                    setAutoCompletedWiki([]);
                  })
                }}
              />
              <TagListUl
                tagDeleteImg={clearImg}
              >
                {!isEmpty(exclude_dependencies) && (
                  exclude_dependencies.map((name) => {
                    return (
                      <li
                        key={name}
                        onClick={() => autoCompleteDelete(name, 'exclude_dependencies')}
                      >
                        {name}
                      </li>
                    );
                  })
                )}
              </TagListUl>
            </div>
          </li>
          <li>
            <h3>
              <span>약재 개수 선택</span>
            </h3>
            <div>
              <ul>
                <RangeLi>
                  <ReactSlider
                    className="count-slider pointer"
                    value={[min_dependency_count, max_dependency_count]}
                    max={MAX_DEPEND}
                    // @ts-ignore
                    onChange={([min, max]) => {
                      setParams(curr => ({
                        ...curr,
                        min_dependency_count: min || MIN_DEPEND,
                        max_dependency_count: max || MAX_DEPEND
                      }));
                    }}
                    // @ts-ignore
                    withBars
                  />
                </RangeLi>
                <RangeLi>
                  <Input
                    type="number"
                    min={MIN_DEPEND}
                    value={min_dependency_count}
                    onChange={({target: {value}}) => {
                      const _value = parseInt(value, 10);
                      const minVal = _value > MAX_DEPEND
                        ? MAX_DEPEND
                        : _value > max_dependency_count
                          ? max_dependency_count
                          : _value;

                      setParams(curr => ({
                        ...curr,
                        min_dependency_count: minVal
                      }));
                    }}
                  />
                  <span> 개 이상 ~</span>
                </RangeLi>
                <RangeLi>
                  <Input
                    type="number"
                    max={MAX_DEPEND}
                    value={max_dependency_count}
                    onChange={({target: {value}}) => {
                      const _value = parseInt(value, 10);
                      const maxVal = _value > 50 ? 50 : _value;

                      setParams(curr => ({
                        ...curr,
                        max_dependency_count: maxVal
                      }));
                    }}
                  />
                  <span> 개 이하</span>
                </RangeLi>
              </ul>
            </div>
          </li>
          <li>
            <h3>
              <span>제형</span>
            </h3>
            <div>
              <BtnUl>
                <li>
                  <button
                    className={cn({
                      // @ts-ignore
                      on: SHAPES.every(({value}) => shapes.includes(value))
                    })}
                    onClick={() => {
                      // @ts-ignore
                      setParams(curr => ({
                        ...curr,
                        shapes: shapes.length > 1
                          ? []
                          : SHAPES.map(({value}) => value),
                      }));
                    }}
                  >
                    전체
                  </button>
                </li>
                {SHAPES.map(({value}) => (
                  <li key={`${value}`}>
                    <button
                      className={cn({
                        on: shapes.some(shape => shape === value)
                      })}
                      onClick={() => {
                        // @ts-ignore
                        setParams(curr => ({
                          ...curr,
                          // @ts-ignore
                          shapes: !shapes.includes(value)
                            ? union([...shapes, value])
                            : shapes.filter(_value => value !== _value),
                        }));
                      }}
                    >
                      {value}
                    </button>
                  </li>
                ))}
              </BtnUl>
            </div>
          </li>
          <li>
            <h3>
              <span>출전</span>
            </h3>
            <div>
              <BtnUl>
                <li>
                  <button
                    className={cn({
                      // @ts-ignore
                      on: SOURCES.every(({value}) => category.includes(value))
                    })}
                    onClick={() => {
                      // @ts-ignore
                      setParams(curr => ({
                        ...curr,
                        category: category.length > 1
                          ? []
                          : SOURCES.map(({value}) => value),
                      }));
                    }}
                  >
                    전체
                  </button>
                </li>
                {SOURCES.map(({value}) => (
                  <li key={value}>
                    <button
                      className={cn({
                        on: category.some(shape => shape === value)
                      })}
                      onClick={() => {
                        // @ts-ignore
                        setParams(curr => ({
                          ...curr,
                          // @ts-ignore
                          category: !category.includes(value)
                            ? union([...category, value])
                            : category.filter(_value => value !== _value),
                        }));
                      }}
                    >
                      {value}
                    </button>
                  </li>
                ))}
              </BtnUl>
            </div>
          </li>

          <li>
            <h3>
              <span>포함할 태그</span>
            </h3>
            <div>
              <DetailSearchInput
                placeholder="입력하신 후 엔터를 눌러주세요."
                value={incluTag}
                clearImg={clearImg}
                onChange={value => {
                  const _incluTag = value.trim();

                  if(incluTag !== _incluTag) {
                    throttledSearchAutoCompletedTag({
                      q: _incluTag,
                      tag_type: 'tag',
                      limit: 5
                    })
                    setIncluTag(_incluTag);
                  }
                }}
                onEnter={(data) => {
                  if (!!data) {
                    const {name}:any = data;

                    autoCompleteSubmit(name, 'include_tags');
                    setIncluTag('');
                    setAutoCompletedTag([]);
                  }
                }}
                autoCompleteList={autoCompletedTags}
                autoCompleteFn={(focusIndex, keywordValue) => {
                  return autoCompleteFn(incluTag, autoCompletedTags, focusIndex, keywordValue, data => {
                    const {name} = data;
                    autoCompleteSubmit(name, 'include_tags')
                    setIncluTag('');
                    setAutoCompletedTag([]);
                  })
                }}
              />
              <TagListUl
                tagDeleteImg={clearImg}
              >
                {!isEmpty(include_tags) && (
                  include_tags.map(name => {
                    return (
                      <li
                        key={name}
                        onClick={() => autoCompleteDelete(name, 'include_tags')}
                      >
                        {name}
                      </li>
                    );
                  })
                )}
              </TagListUl>
            </div>
          </li>

          <li>
            <h3>
              <span>제외할 태그</span>
            </h3>
            <div>
              <DetailSearchInput
                placeholder="입력하신 후 엔터를 눌러주세요."
                value={excluTag}
                clearImg={clearImg}
                onChange={value => {
                  const _excluTag = value.trim();

                  if(excluTag === _excluTag) return;
                  throttledSearchAutoCompletedTag({
                    q: _excluTag,
                    tag_type: 'tag',
                    limit: 5,
                  })
                  setExcluTag(_excluTag);
                }}
                onEnter={(data) => {
                  if (!!data) {
                    const {name}:any = data;
                  
                    autoCompleteSubmit(name, 'exclude_tags');
                    setExcluTag('');
                    setAutoCompletedTag([]);
                  }
                }}
                autoCompleteList={autoCompletedTags}
                autoCompleteFn={(focusIndex, keywordValue) => {
                  return autoCompleteFn(excluTag, autoCompletedTags, focusIndex, keywordValue, data => {
                    const {name} = data;
                    autoCompleteSubmit(name, 'exclude_tags');
                    setExcluTag('');
                    setAutoCompletedTag([]);
                  })
                }}
              />
              <TagListUl
                tagDeleteImg={clearImg}
              >
                {!isEmpty(exclude_tags) && (
                  exclude_tags.map(name => {
                    return (
                      <li
                        key={name}
                        onClick={() => autoCompleteDelete(name, 'exclude_tags')}
                      >
                        {name}
                      </li>
                    );
                  })
                )}
              </TagListUl>
            </div>
          </li>

          <li>
            <h3>
              <span>가격범위</span>
            </h3>
            <div>
              <ul>
                <RangeLi>
                  <ReactSlider
                    className="count-slider pointer"
                    value={[min_price, max_price]}
                    max={MAX_PRICE}
                    // @ts-ignore
                    onChange={([min_price, max_price]) => {
                      setParams(curr => ({
                        ...curr,
                        min_price: min_price || MIN_PRICE,
                        max_price: max_price || MAX_PRICE
                      }));
                    }}
                    // @ts-ignore
                    withBars
                  />
                </RangeLi>
                <RangeLi>
                  <Input
                    type="number"
                    min={MIN_PRICE}
                    value={min_price}
                    onChange={({target: {value}}) => {
                      const _value = parseInt(value, 10);
                      const minVal = _value > MAX_PRICE
                        ? MAX_PRICE
                        : _value > max_price
                          ? max_price
                          : _value;

                      setParams(curr => ({
                        ...curr,
                        min_price: minVal
                      }));
                    }}
                    bigWidth
                  />
                  <span> 원 이상 ~</span>
                </RangeLi>
                <RangeLi>
                  <Input
                    type="number"
                    max={MAX_PRICE}
                    value={max_price}
                    onChange={({target: {value}}) => {
                      const _value = parseInt(value, 10);
                      const maxVal = _value > MAX_PRICE
                        ? MAX_PRICE
                        : _value;

                      setParams(curr => ({
                        ...curr,
                        max_price: maxVal
                      }));
                    }}
                    bigWidth
                  />
                  <span> 원 이하</span>
                </RangeLi>
              </ul>
            </div>
          </li>
        </ul>
        <BtnGroupUl>
          <li>
            <Button
              isReset
              onClick={() => {
                setParams(DEFAULT_PARAMS_OF_STATE);
              }}
            >
              초기화
            </Button>
          </li>
          <li>
            <Button
              onClick={() => {
                onDetailSearch({
                  ...params,
                  include_dependencies: params.include_dependencies.join(','),
                  exclude_dependencies: params.exclude_dependencies.join(','),
                  shapes: params.shapes.join(','),
                  category: params.category.join(','),
                  include_tags: params.include_tags.join(','),
                  exclude_tags: params.exclude_tags.join(','),
                })
              }}
            >
              검색
            </Button>
          </li>
        </BtnGroupUl>
      </SearchDetailDiv>
    );
  }
);

WikiSearchForm.displayName = 'WikiSearchForm';
export default WikiSearchForm;

