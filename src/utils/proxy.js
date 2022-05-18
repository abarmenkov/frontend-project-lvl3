export default (url, base = 'https://allorigins.hexlet.app/get') => {
  const newUrl = new URL(base);
  const searchUrl = encodeURI(url);
  newUrl.searchParams.set('disableCache', 'true');
  newUrl.searchParams.set('url', searchUrl);
  return newUrl;
};
