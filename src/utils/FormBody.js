const formBody = (obj) => {
  const formBody = Object.entries(obj)
    .map(
      ([key, value]) =>
        encodeURIComponent(key) + '=' + encodeURIComponent(value),
    )
    .join('&');
  return formBody;
};

export {formBody};
