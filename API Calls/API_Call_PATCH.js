let mainURL = 'https://f1-api.netlify.app/.netlify/functions'
const axios = require('axios');


async function callAPI_PATCH(data, subURL) {
    axios.patch(`${mainURL}${subURL}`, data)
  .then(response => {
    // handle success
    console.log(response.data, "THIS ONE");
  })
  .catch(error => {
    // handle error
    console.log(error.data);
  })

}

module.exports = {callAPI_PATCH}