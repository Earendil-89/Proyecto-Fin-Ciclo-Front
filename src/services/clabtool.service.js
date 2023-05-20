import axios from 'axios';
require('dotenv').config();

const SERVICE = 'http://localhost:9099';

class ClabtoolService {

  getData(type) {
    let user = JSON.parse(localStorage.getItem('user'));
    return axios
      .get(SERVICE +'/api/clabtool/' + type, {
        headers: {
          Authorization: 'Bearer ' + user.accessToken
        }
      }).then(response => response.data)
  }

  saveData(type,formData) {
    let user = JSON.parse(localStorage.getItem('user'));
    return axios
      .post(
        SERVICE +'/api/clabtool/'+ type,
         formData,
        {
          headers: {
            Authorization: 'Bearer ' + user.accessToken
          }
        }
      )
      .then(response => response.data)
  }

  updateData(type,formData) {
    let user = JSON.parse(localStorage.getItem('user'));
    return axios
      .put(
        SERVICE +'/api/clabtool/'+ type,
         formData,
        {
          headers: {
            Authorization: 'Bearer ' + user.accessToken
          }
        }
      )
      .then(response => response.data)
  }

  deleteData(type,formData) {
    let user = JSON.parse(localStorage.getItem('user'));
    return axios
      .delete(
        SERVICE +'/api/clabtool/'+ type +'/'+formData,
        {
          headers: {
            Authorization: 'Bearer ' + user.accessToken
          }
        }
      )
      .then(response => response.data)
  }
}

export default new ClabtoolService();