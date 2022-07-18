import Moment from 'moment';

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

export function TableSorter(Feeld) {
  return (a, b) => {
    if (
      Moment(a[Feeld], 'DD.MM.YYYY hh:mm:ss').unix() >
      Moment(b[Feeld], 'DD.MM.YYYY hh:mm:ss').unix()
    ) {
      return 1;
    }
    if (
      Moment(a[Feeld], 'DD.MM.YYYY hh:mm:ss').unix() <
      Moment(b[Feeld], 'DD.MM.YYYY hh:mm:ss').unix()
    ) {
      return -1;
    }
    if (
      Moment(a[Feeld], 'DD.MM.YYYY hh:mm:ss').unix() ==
      Moment(b[Feeld], 'DD.MM.YYYY hh:mm:ss').unix()
    ) {
      return 0;
    }

    if (a[Feeld] > b[Feeld]) {
      return 1;
    }
    if (a[Feeld] < b[Feeld]) {
      return -1;
    }
    if (a[Feeld] == b[Feeld]) {
      return 0;
    }
    if (a[Feeld].length == 0) {
      return 1;
    }
    if (b[Feeld].length == 0) {
      return -1;
    }
    if (a[Feeld].length == 0 && b[Feeld].length == 0) {
      return 0;
    }

    if (a[Feeld].toLowerCase() < b[Feeld].toLowerCase()) {
      return -1;
    }
    if (a[Feeld].toLowerCase() > b[Feeld].toLowerCase()) {
      return 1;
    }
    if (a[Feeld].toLowerCase() == b[Feeld].toLowerCase()) {
      return 0;
    }
  };
}
