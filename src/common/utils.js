/* eslint-disable import/prefer-default-export */

export const applyFilters = (filters, csvDetails) => {
  filters.forEach((filter) => {
    if (filter.type === 'filter') {
      const { column, filter: filterType, text } = filter?.value || {};
      // eslint-disable-next-line no-param-reassign
      csvDetails = csvDetails?.filter((row) => {
        if (column && row?.[column]) {
          const value = row[column];
          const filterText = text;
          switch (filterType) {
            case 'is equal to':
              return value === filterText;
            case 'is not equal to':
              return value !== filterText;
            case 'includes':
              return value.includes(filterText);
            case 'does not include':
              return !value.includes(filterText);
            default:
              return true;
          }
        }
        return true;
      });
    }
    if (filter?.type === 'sort') {
      const { column, order } = filter?.value || {};
      return csvDetails?.sort((a, b) => {
        const valueA = a?.[column];
        const valueB = b?.[column];

        if (order === 'ascending') {
          if (valueA < valueB) {
            return -1;
          }
          if (valueA > valueB) {
            return 1;
          }
          return 0;
        }
        if (order === 'descending') {
          if (valueA > valueB) {
            return -1;
          }
          if (valueA < valueB) {
            return 1;
          }
          return 0;
        }

        return 0;
      });
    }
    if (filter?.type === 'slice') {
      const { fromIndex, toIndex } = filter?.value || {};
      // eslint-disable-next-line no-param-reassign
      csvDetails = csvDetails?.slice(
        parseInt(fromIndex, 10),
        parseInt(toIndex, 10),
      );
    }
  });
  return csvDetails;
};
