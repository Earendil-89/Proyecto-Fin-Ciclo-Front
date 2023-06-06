import axios from 'axios';

class AuthService {
  login(user) {
    return axios
      .post('http://localhost:9098/api/auth/signin', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  get() {
    let user = JSON.parse(localStorage.getItem('user'));
    return axios
      .get('http://localhost:9098/api/auth/user', {
        headers: {
          Authorization: 'Bearer ' + user.accessToken
        }
      })
      .then(response => response.data);
  }

  setPassword(data) {
    let user = JSON.parse(localStorage.getItem('user'));
    return axios
      .put('http://localhost:9098/api/auth/password', data, {
        headers: {
          Authorization: 'Bearer ' + user.accessToken
        }
      })
      .then(response => response.data);
  }

  updateUser(data) {
    let user = JSON.parse(localStorage.getItem('user'));
    return axios
    .put('http://localhost:9098/api/auth/user', data, {
      headers: {
        Authorization: 'Bearer ' + user.accessToken
      }
    })
    .then(response => response.data);
  }

  signup(data) {
    let user = JSON.parse(localStorage.getItem('user'));
    return axios
      .post('http://localhost:9098/api/auth/signup', data, {
        headers: {
          Authorization: 'Bearer ' + user.accessToken
        } 
      })
      .then(response => response.data);
  }

  delete(id) {
    let user = JSON.parse(localStorage.getItem('user'));
    return axios
      .delete('http://localhost:9098/api/auth/user/' + id, {
        headers: {
          Authorization: 'Bearer ' + user.accessToken
        } 
      })
      .then(response => response.data);
  }

  logout() {
    localStorage.removeItem('user');
  }
}

export default new AuthService();
