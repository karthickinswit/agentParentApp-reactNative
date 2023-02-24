import Variables from '../utils/variables';
import axios from 'axios';

let myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('authentication-token', Variables.TOKEN);

export async function activeChats() {
  console.log('inner call');
  // return ApiRequest(
  //   Variables.API_URL + Variables.ACTIVE_CHATS,
  //   'GET',
  //   myHeaders,
  // );
  // var request = new XMLHttpRequest();
  // var url = Variables.API_URL + Variables.ACTIVE_CHATS;
  // request.onreadystatechange = e => {
  //   if (request.readyState !== 4) {
  //     return;
  //   }

  //   if (request.status === 200) {
  //     console.log('success', JSON.stringify(request.response));
  //     return JSON.stringify(request.response);
  //   } else {
  //     console.warn('error');
  //   }
  // };
  // console.log('Actichat URL', url);
  // request.open('GET', Variables.API_URL + Variables.ACTIVE_CHATS);
  // request.setRequestHeader('authentication-token', Variables.TOKEN);
  // request.setRequestHeader('Content-Type', 'application/json');
  // request.send();
  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + Variables.ACTIVE_CHATS;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success', data.response);
        resolve(data.response);
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}

// class AllAppApis {
//   activeChats = async () => {
//     console.log('AllApi');
//     fetch(Variables.API_URL + Variables.ACTIVE_CHATS, {
//       crossDomain: true,
//       headers: myHeaders,
//     }).then(response => {
//       return response.json;
//     });
//     // const activate = await response.json();
//     // console.log('data in api.js', activate);
//     // return activate;
//   };

//   closedChats = async () => {
//     const response = await fetch(Variables.CLOSED_CHATS, {
//       crossDomain: true,
//       headers: myHeaders,
//     });
//     const closeddata = await response.json();
//     return closeddata;
//   };
// }

// export default AllAppApis;

function ApiRequest(url, method, header) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = e => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      console.log('success', request.responseText);
      return request.responseText;
    } else {
      console.warn('error');
    }
  };

  request.open(method);
  request.setRequestHeader(header);
  request.send();
}
