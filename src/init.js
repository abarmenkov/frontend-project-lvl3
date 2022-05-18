import i18next from 'i18next';
import _ from 'lodash';
import axios from 'axios';
import fetchData from './utils/fetchData.js';
import initView from './view.js';
import ru from './locales/ru.js';
import validateUrl from './utils/validator.js';
import getFeedAndPosts from './utils/parser.js';
import updatePosts from './utils/updater.js';

export default () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[type="submit"]'),
    feedbackContainer: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modal: document.querySelector('#modal'),
    spanSpinner: document.createElement('span'),
    spanLoading: document.createElement('span'),
  };

  const initialState = {
    rssForm: {
      state: 'filling',
      error: null,
      valid: true,
    },
    feeds: [],
    posts: [],
    uiState: {
      visitedPosts: new Set(),
      modalId: null,
    },
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const watchedState = initView(initialState, elements, i18n);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.rssForm.state = 'filling';
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const urlsList = watchedState.feeds.map((feed) => feed.url);
    validateUrl(url, urlsList, i18n)
      .then((validUrl) => {
        watchedState.rssForm.error = null;
        watchedState.rssForm.state = 'processing';
        return fetchData(validUrl);
      })
      .then(({ data }) => {
        const [feed, posts] = getFeedAndPosts(data.contents);
        const newFeed = { ...feed, id: _.uniqueId(), url };
        const newPosts = posts.map((post) => ({ ...post, id: _.uniqueId(), feedId: newFeed.id }));
        watchedState.feeds = [newFeed, ...watchedState.feeds];
        watchedState.posts = [...newPosts, ...watchedState.posts];
        watchedState.rssForm.state = 'success';
      })
      .catch((err) => {
        watchedState.rssForm.valid = err.name !== 'ValidationError';
        if (err.name === 'ValidationError') {
          watchedState.rssForm.error = err.message;
        } else if (err.NotValidRss) {
          watchedState.rssForm.error = 'form.errors.notValidRss';
        } else if (axios.isAxiosError(err)) {
          watchedState.rssForm.error = 'form.errors.networkProblems';
        }
        watchedState.rssForm.state = 'filling';
      });
  });

  elements.postsContainer.addEventListener('click', ({ target }) => {
    if (target.closest('a')) {
      const { id } = target.dataset;
      watchedState.uiState.visitedPosts.add(id);
    }
    if (target.closest('button')) {
      const { id } = target.dataset;
      watchedState.uiState.visitedPosts.add(id);
      watchedState.uiState.modalId = id;
    }
  });

  setTimeout(() => updatePosts(watchedState), 5000);
};
