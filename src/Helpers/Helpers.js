export const ApiFetch = (Adress, Method, Body, Callback) => {
  return new Promise((resolve, reject) => {
    fetch(Adress, { body: JSON.stringify(Body), method: Method })
      .then((JSONResponse) => {
        JSONResponse.json()
          .then((Response) => {
            if ('error' in Response) {
              reject(Response.error);
            } else {
              Callback(Response);
              resolve(Response);
            }
          })
          .catch((JsonError) => {});
      })
      .catch((FetchError) => {
        console.log(FetchError);
      });
  });
};
