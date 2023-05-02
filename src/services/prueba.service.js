import axios from 'axios';
require('dotenv').config();

class PruebaService {

  getData(type) {
    return axios
      .get(process.env.VUE_APP_PRUEBA_SERVICE +'/api/prueba/' + type, {
      }).then(response => response.data)
    
  }

  saveData(type,formData) {
    return axios
      .post(
        process.env.VUE_APP_PRUEBA_SERVICE +'/api/prueba/'+ type,
         formData,
        {}
      )
      .then(response => response.data)
  }

  updateData(type,formData) {
    return axios
      .put(
        process.env.VUE_APP_PRUEBA_SERVICE +'/api/prueba/'+ type,
         formData,
        {}
      )
      .then(response => response.data)
  }

  deleteData(type,formData) {
    return axios
      .delete(
        process.env.VUE_APP_PRUEBA_SERVICE +'/api/prueba/'+ type +'/'+formData,
        {}
      )
      .then(response => response.data)
  }
 

}

export default new PruebaService();