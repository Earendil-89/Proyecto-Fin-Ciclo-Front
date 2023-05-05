import axios from 'axios';
require('dotenv').config();

class ClabtoolService {

  getData(type) {
    return axios
      .get("http://localhost:9099" +'/api/clabtool/' + type, {
      }).then(response => response.data)
    
  }

  saveData(type,formData) {
    return axios
      .post(
        process.env.VUE_APP_CLABTOOL_SERVICE +'/api/clabtool/'+ type,
         formData,
        {}
      )
      .then(response => response.data)
  }

  updateData(type,formData) {
    return axios
      .put(
        process.env.VUE_APP_CLABTOOL_SERVICE +'/api/clabtool/'+ type,
         formData,
        {}
      )
      .then(response => response.data)
  }

  deleteData(type,formData) {
    return axios
      .delete(
        process.env.VUE_APP_CLABTOOL_SERVICE +'/api/clabtool/'+ type +'/'+formData,
        {}
      )
      .then(response => response.data)
  }
 

}

export default new ClabtoolService();