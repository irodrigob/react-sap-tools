/**
 * Conversión de un campo fecha a formato dd.mm.yyyy
 * @param {date} date
 * @returns Fecha en formato string
 */
export const formatDate = (date) => {
  let d = new Date(date);
  let month = d.getMonth();
  let day = d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [day, month, year].join(".");
};

/**
 * Devuelve el día previo al actual
 * @param {date} | Fecha, si no se pasa se toma la actual
 * @returns Un día menos a la fecha pasada.
 */
export function getPreviousDay(date = new Date()) {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);

  return previous;
}
