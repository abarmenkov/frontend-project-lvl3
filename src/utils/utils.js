export default (xmlDom) => {
  const feed = {
    title: xmlDom.querySelector('channel title').textContent,
    description: xmlDom.querySelector('channel description').textContent,
  };

  const posts = Array.from(xmlDom.querySelectorAll('item'))
    .map((item) => (
      {
        title: item.querySelector('title').textContent,
        description: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
      }
    ));
  return [feed, posts];
};
