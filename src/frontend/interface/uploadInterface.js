//uploadInterface.js
//This file contains methods for uploading the bulk import file

const axios = require('axios');
const FormData = require('form-data');

/*
 * upload the bulk import file
 * form: multipart/formdata such as created by `const form = new FormData();`
 * sessionId: string, id of the current session
 */
async function upload(form, sessionId){
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  const res = await axios.post('/upload/user/'.concat(sessionId), form, config);
  console.log(res.data);
  return res.data;
};

//export functions above for use by other modules
export {upload};