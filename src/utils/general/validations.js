/**
 * Valida si la URL es valida
 * @param pURL | URL
 * @returns Booleano
 */
export const validateHost = (pURL) => {
  if (pURL.match(/(^http[s]?:\/{2})|(^\/{1,2})/g) == null) return false;
  else return true;
};

/**
 * Formatea la URL
 * @param pURL | URL
 * @returns URL formateada
 */
export const formatterHost = (pURL) => {
  // Si en el host tenemos el / como carácter final lo elimino.
  if (pURL.match(/(\/$)/g)) pURL = pURL.slice(0, -1);

  return pURL;
};

/**
 * Formatea el path
 * @param pURL | URL
 * @returns URL formateada
 */
export const formatterPath = (pPath) => {
  // Si el path no tiene / al final se lo añado.
  if (!pPath.match(/(\/$)/g)) pPath = pPath.concat("/");

  // Si el path no tiene el / al principio se lo pongo
  if (!pPath.match(/(^\/)/g)) pPath = `/${pPath}`;

  return pPath;
};
