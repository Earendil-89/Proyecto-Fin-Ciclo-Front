import axios from 'axios';
require('dotenv').config();

const SERVICE = 'http://localhost:9099';

class ClabtoolService {

  getData(type) {
    return axios
      .get(SERVICE +'/api/clabtool/' + type, {
      }).then(response => response.data)
    
  }

  saveData(type,formData) {
    return axios
      .post(
        SERVICE +'/api/clabtool/'+ type,
         formData,
        {}
      )
      .then(response => response.data)
  }

  updateData(type,formData) {
    return axios
      .put(
        SERVICE +'/api/clabtool/'+ type,
         formData,
        {}
      )
      .then(response => response.data)
  }

  deleteData(type,formData) {
    return axios
      .delete(
        SERVICE +'/api/clabtool/'+ type +'/'+formData,
        {}
      )
      .then(response => response.data)
  }
 

}

export default new ClabtoolService();