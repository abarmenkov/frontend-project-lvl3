export default (data) => {
  const parsedXml = new DOMParser().parseFromString(data, 'application/xml');
  const parseError = parsedXml.querySelector('parsererror');
  if (parseError) throw new Error('notValidRss');

  const feed = {
    title: parsedXml.querySelector('channel title').textContent,
    description: parsedXml.querySelector('channel description').textContent,
  };

  const posts = Array.from(parsedXml.querySelectorAll('item'))
    .map((item) => (
      {
        title: item.querySelector('title').textContent,
        description: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
      }
    ));
  return [feed, posts];
};
