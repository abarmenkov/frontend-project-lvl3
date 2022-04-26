import * as yup from 'yup';

export default (url, urlsList, i18n) => {
  yup.setLocale({
    string: {
      url: i18n.t('form.errors.notValidUrl'),
    },
    mixed: {
      required: i18n.t('form.errors.required'),
      notOneOf: i18n.t('form.errors.notUniqueUrl'),
    },
  });

  const schema = yup
    .string()
    .required()
    .url()
    .notOneOf(urlsList);

  return schema.validate(url);
};
