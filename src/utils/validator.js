import * as yup from 'yup';

export default (url, addedUrls, i18n) => {
  yup.setLocale({
    string: {
      url: i18n.t('form.errors.notValidUrl'),
    },
    mixed: {
      required: i18n.t('form.errors.required'),
      notOneOf: i18n.t('form.errors.notUniqUrl'),
    },
  });

  const schema = yup
    .string()
    .required()
    .url()
    .notOneOf(addedUrls);

  return schema.validate(url);
};
