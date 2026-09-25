export const get_CHECK_IN_Values = (obj: object | Array<string>) =>
  (Array.isArray(obj) ? obj : Object.values(obj))
    .map((v) => `'${v}'`)
    .join(',');
