export default class SystemFormatters {
  /**
   * Formateo del host
   * @param pURL | URL a formatear
   * @returns URL formateada
   */
  formatterHost(pURL: string): string {
    // Si en el host tenemos el / como carácter final lo elimino.
    if (pURL.match(/(\/$)/g)) pURL = pURL.slice(0, -1);

    return pURL;
  }
  formatterPath(pPath: string): string {
    // Si el path no tiene / al final se lo añado.
    if (!pPath.match(/(\/$)/g)) pPath = pPath.concat("/");

    // Si el path no tiene el / al principio se lo pongo
    if (!pPath.match(/(^\/)/g)) pPath = `/${pPath}`;

    return pPath;
  }
}
