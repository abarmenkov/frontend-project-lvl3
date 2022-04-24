import axios from 'axios';
import proxify from './proxy.js';

export default (url) => axios.get(proxify(url));
