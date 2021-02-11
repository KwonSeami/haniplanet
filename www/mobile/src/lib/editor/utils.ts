import isEmpty from 'lodash/isEmpty';
import has from 'lodash/has';
import uniq from 'lodash/uniq';
import ScrapApi from '../../apis/ScrapApi';

export const urlExtractor = (body: string) =>
  uniq((typeof(body) === 'string' ? body : JSON.stringify(body))
    .match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gi));

const getUrlCardByKey = (url: string, methods: any) => {
  const {getValues, setValue} = methods;
  const {externalData, excludedUrlList} = getValues();

  ScrapApi.urlScrap({url: url})
    .then(({data: {result}}) => {
      if (result.id) {
        setValue('externalData', {
          ...externalData,
          url_card: result
        });
        setValue('excludedUrlList', [...excludedUrlList, url]);
      }
    })
    .catch(e => console.error(e));
};

export const embedUrlCard = methods => {
  const {getValues, setValue} = methods;
  const {externalData, body, excludedUrlList} = getValues();
  const {url_card} = externalData;

  if (!((url_card || {}).url)) {
    const urls = urlExtractor(body) || [];

    // 존재하는 URL에 대해서만 Exclude
    setValue('excludedUrlList', excludedUrlList.filter(url => urls.includes(url)));

    if (!isEmpty(urls) && !urls.every(i => excludedUrlList.includes(i))) {
      // Exclude된 URL이 아닐 경우 지워진 URL의 다음 URL을 선택
      const url = [
        ...urls.slice(urls.indexOf(excludedUrlList[excludedUrlList.length - 1]) || 0, urls.length),
        ...urls.slice(0, urls.indexOf(excludedUrlList[excludedUrlList.length - 1]))
      ].filter(value =>
        !excludedUrlList.includes(value) && value
      )[0];

      url && getUrlCardByKey(url, methods);
    }
  } else if (has(url_card, 'url') && !has(url_card, 'id')) {
    const url = (url_card || {} as any).url;

    url && getUrlCardByKey(url, methods);
  }
};
