/**
 * Convierte los campos de un registro interno a uno externo. Esa conversión
 * es quitar los campos de gestión
 * @param {object} row | Fila de datos con el formato externo
 * @returns | Fila de datos externa
 */
export const convertFieldsInternalRow2External = (row, columns) => {
  let externalRow = {};

  columns.forEach((column) => {
    externalRow[column.id] = row[column.id];
  });

  return externalRow;
};
