import Vue from 'vue';
import Vuex from 'vuex';
import { formatDate, formatCurrency } from '@/helpers';
import api from '@/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({
    data: [],
    isLoading: false,
    isCached: false,
  }),

  mutations: {
    setState(state, value) {
      Object.entries(value).forEach(([key, data]) => {
        if (!Array.isArray(state[key]) && state[key] && typeof state[key] === 'object') {
          state[key] = {
            ...state[key],
            ...data,
          };
        } else {
          state[key] = data;
        }
      });
    },
  },

  actions: {
    clearCache({ commit }) {
      commit('setState', { isCached: false });
      localStorage.removeItem('cachedData');
    },

    async load({ state, commit, dispatch }, params = {}) {
      commit('setState', { isLoading: true });

      try {
        // 8. нужно реализовать кэш на стороне клиента с возможностью «сброса» и повторной загрузки данных через api
        // для упрощения будем в localStorage хранить
        if (state.isCached) {
          const data = localStorage.getItem('cachedData');

          if (data) {
            commit('setState', { data: JSON.parse(data) });
          } else {
            dispatch('clearCache');
          }
        } else {
          const { data } = await api.getPayments(params);

          if (Array.isArray(data)) {
            // трансформация данных
            data.forEach((item) => {
              // 4. реализовать форматирование значений в столбцах
              // вероятно текущей команде привычно использовать luxon
              item.dateFormatted = formatDate(item.date);
              item.moneyFormatted = formatCurrency(item.money);
            });

            commit('setState', { data });

            localStorage.setItem('cachedData', JSON.stringify(data));
            commit('setState', { isCached: true });
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-alert
        alert(e?.message);
      } finally {
        commit('setState', { isLoading: false });
      }
    },
  },
});
