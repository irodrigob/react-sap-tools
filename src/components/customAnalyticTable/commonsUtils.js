import { INTERNAL_FIELD_PATTERN } from "./constants";
/**
 * Convierte los campos de un registro interno a uno externo. Esa conversión
 * es quitar los campos de gestión
 * @param {object} row | Fila de datos con el formato externo
 * @returns | Fila de datos externa
 */
export const convertFieldsInternalRow2External = (row) => {
  let externalRow = {};

  for (const key in row) {
    // Los campos que comiencen por "__" son internos de objeto y no voy a copiarlo.
    if (key.indexOf(INTERNAL_FIELD_PATTERN) === -1) externalRow[key] = row[key];
  }

  return externalRow;
};
