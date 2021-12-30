export const callPost = (url: string, body: any) => {
  return useFetch(url, {
    method: 'POST',
    body,
  });
};
