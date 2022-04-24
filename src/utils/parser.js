export default (xml) => {
  const parsedXml = new DOMParser().parseFromString(xml, 'application/xml');
  const parseError = parsedXml.querySelector('parsererror');
  if (parseError) throw new Error('form.errors.notValidRss');
  return parsedXml;
};
