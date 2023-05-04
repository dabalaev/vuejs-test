<template>
  <div class="data-table">
    <div class="data-table__filter">
      <ui-money v-model="moneyFilter" />
    </div>

    <!-- 2. реализовать компонент @/components/DataTable.vue -->
    <div v-if="currentPageData" class="data-table__grid-table">
      <div class="data-table__grid-table-row data-table__grid-table-row--head" key="head" :style="gridStyle">
        <div
            v-for="column in columns"
            :key="column.label"
        >
            {{ column.label }}
        </div>
      </div>
      <div class="data-table__grid-table-row" v-for="item in currentPageData" :key="item.id" :style="gridStyle">
        <div
            v-for="column in columns"
            :key="column.label"
            :data-name="column.label"
        >
            {{ item[column.prop] }}
        </div>
      </div>
    </div>

    <div class="data-table__paginator">
      <ui-pagination
        v-model="page"
        :pages="pageCount"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTable',

  props: {
    rows: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    page: 1,
    pageSize: 4,
    moneyFilter: 0,
  }),

  computed: {
    gridStyle() {
      return {
        'grid-template-columns': this.columns.map((o) => o.width).join(' '),
      };
    },

    // 6. реализовать простой фильтр для таблицы
    // money меньше или равно пользовательскому условию
    // TODO фильтрацию по хорошему нужно на бэк перенести для этого всё готово
    filteredData() {
      if (this.moneyFilter > 0) {
        return this.rows.filter((o) => o.money <= this.moneyFilter);
      }

      return this.rows;
    },

    currentPageData() {
      return this.filteredData.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    },

    pageCount() {
      return Math.ceil(this.filteredData.length / this.pageSize);
    },
  },

  watch: {
    moneyFilter() {
      // при пользовании фильтром, возвращаем пользователя на первую страницу
      this.page = 1;
    },
  },
};
</script>
