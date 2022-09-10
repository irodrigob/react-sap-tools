export const extractObjectPath = (obj) => {
  const result = {};

  const recursivePathCalculation = (source, rootPath = [], target = result) => {
    Object.keys(source).forEach((sKey) => {
      if (source.hasOwnProperty(sKey)) {
        const path = rootPath.slice();
        path.push(sKey);

        const value = source[sKey];
        if (value !== null && typeof value === "object") {
          recursivePathCalculation(value, path, (target[sKey] = {}));
        } else {
          target[sKey] = path.join(".");
        }
      }
    });

    /*for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const path = rootPath.slice();
        path.push(key);

        const value = source[key];
        if (value !== null && typeof value === "object") {
          recursivePathCalculation(value, path, (target[key] = {}));
        } else {
          target[key] = path.join(".");
        }
      }
    }*/
  };
  recursivePathCalculation(obj);

  return result;
};
