import axios from 'axios';

const baseURL = process.env.VUE_APP_API_URL;

/**
 * @var {Axios}
 */
const instance = axios.create({
  baseURL,
});

/**
 * Load payments data.
 *
 * @param {Object} params
 * @returns {Promise}
 */
const getPayments = async (params = {}) => {
  // 7. Нужно реализовать механизм быстрого переключения между api и этими данными через параметры окружения
  if (baseURL.includes('localhost')) {
    // TODO в идеале отказаться от мокового импорта, но так как библиотек для имитации бэка подключать нельзя, то пока так
    const { default: getMockData } = await import('@/mocks/getPayments');
    return getMockData(params);
  }

  return instance.request({
    method: 'get',
    url: '/api/v1/payments',
    params,
  });
};

export default {
  instance,
  getPayments,
};
