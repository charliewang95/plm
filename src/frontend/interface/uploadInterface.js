//uploadInterface.js
//This file contains methods for uploading the bulk import file

const axios = require('axios');
const FormData = require('form-data');

/*
 * upload the bulk import file
 * form: multipart/formdata such as created by `const form = new FormData();`
 * sessionId: string, id of the current session
 */
async function upload(form, sessionId, callback){
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  try{
    const res = await axios.post('/upload/user/'.concat(sessionId), form, config);
    console.log(res.data);
    callback(res);
  } catch(e) {
        console.log('there was an error');
        console.log(e);
        //TODO: different error message for different types of error
        if (e.response.status == 400 || e.response.status == 500)
          callback(e.response);
        else {
          console.log(e.response);
          throw e;
        }
  }
};

//export functions above for use by other modules
export {upload};