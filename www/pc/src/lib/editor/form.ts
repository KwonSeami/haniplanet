import isEmpty from 'lodash/isEmpty';

const isValidForm = ({title}: any) => {
  if (!title) {
    alert('제목을 입력해주세요');
    return false;
  }

  return true;
};

export const createSendForm = (data: any) => {
  const {
    title,
    open_range,
    user_types,
    user_expose_type,
    externalData,
    attachments,
    body,
    menu_tag_id,
    is_notice = false,
    category = '글'
  } = data as any;
  const {tags, url_card, dictList} = externalData;
  const {file, image} = attachments;

  if (!isValidForm(data)) {
    return null;
  } else {
    const form: any = {
      title,
      body,
      body_type: 'froala',
      user_types,
      open_range,
      user_expose_type,
      wikis: [],
      is_notice,
      category,
    };

    form.file_uids = file.reduce((prev, curr) => curr.uid ? [...prev, curr.uid] : prev, []);
    form.image_uids = image.reduce((prev, curr) => curr.uid ? [...prev, curr.uid] : prev, []);
    form.tag_ids = tags.map(({id}) => id);
    form.url_card = url_card?.id || '';

    if (!!menu_tag_id) {
      form.menu_tag_id = menu_tag_id;
    }

    for (const {code} of dictList) {
      form.wikis = [...form.wikis, code];
    }

    return form;
  }
};
