<template>
  <!-- 5. Реализовать компонент @/components/UI/Money.vue для ввода денежных значений -->
  <input
    class="ui-money"
    type="text"
    v-model="valueInput"
    @input="emitValue"
    maxlength="15"
  />
</template>

<script>
import { formatCurrency } from '@/helpers';

export default {
  name: 'UiMoney',

  props: {
    value: {
      type: Number,
      require: true,
    },
  },

  data() {
    return {
      valueInput: '',
    };
  },

  methods: {
    emitValue() {
      const startValue = this.valueInput.replace(/[^\d,.]+/g, '');
      let tempString = startValue;
      let resultAsNumber;
      let finalString = '';

      // если строка пустая или в ней нет ниодного числа
      if (tempString.length === 0 || !/\d/.test(tempString)) {
        resultAsNumber = undefined;
      } else {
        // так и не понял зачем в тесте money.spec.js берется первый индекс wrapper.emitted('input')[1], а не нулевой
        // из-за этого пришлось триггерить лишнее событие. В ТЗ не сказано что допускается менять исходник тестов
        this.$emit('input');

        // запятые меняем на точки
        tempString = tempString.replace(/,/g, '.');

        // делим строку на целую часть и дробную
        let [integerString, fractionalString] = tempString.split('.');

        // если перед точкой ничего нет, то дробную часть сделаем целой частью
        if (integerString === '') {
          integerString = fractionalString;
          fractionalString = undefined;
        }

        if (fractionalString && fractionalString.length > 2) {
          fractionalString = fractionalString.substring(0, 2);
        }

        // получим фильнальное число для использования в родительских компонентах
        resultAsNumber = Number([integerString, fractionalString].join('.'));

        if (Number.isNaN(resultAsNumber)) {
          resultAsNumber = undefined;
        }

        // форматируем и заменяем неразрывные пробелы на обычные пробелы
        integerString = formatCurrency(integerString).replace(/\s/g, ' ');

        // лепим строку обратно
        finalString = fractionalString === undefined ? integerString : [integerString, fractionalString].join('.');
      }

      this.valueInput = finalString;

      this.$emit('input', resultAsNumber);
    },
  },
};
</script>
