
import { endpoint } from './constants.js';
import toastr from 'toastr';

export const generateRandomID = () => {
  const randomNumber =  Math.floor(Math.random() * 300);
  const currentTime = Date.now().valueOf();

  return currentTime + randomNumber;
}

export const chunks = function(array, size) {
  let results = [];
  while (array.length > 0)
    results.push(array.splice(0, size));
  return results;
};

export const setupToastr = () => {
  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-bottom-right",
    preventDuplicates: true,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "3000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
  }
}

export const uploadFiles = (files, responseHandler) => {
  const data = new FormData();
  files.forEach(file => {
    data.append("fileToUpload[]", file);
  });

  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        responseHandler(JSON.parse(request.response));
      } else {
        responseHandler(null);
      }
    }
  };

  request.open('POST', endpoint());
  request.setRequestHeader("id", generateRandomID());
  request.send(data);
};
