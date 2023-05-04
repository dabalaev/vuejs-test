import { DateTime } from 'luxon';

export const formatDate = (value) => {
  const result = DateTime.fromISO(value).toFormat('dd.LL.yyyy');

  if (result === 'Invalid DateTime') {
    return '';
  }

  return result;
};

const currencyFormatter = new Intl.NumberFormat('ru-RU');
export const formatCurrency = (value) => {
  try {
    if (value) {
      return currencyFormatter.format(value).replace(',', '.');
    }

    return '';
  } catch {
    return '';
  }
};
