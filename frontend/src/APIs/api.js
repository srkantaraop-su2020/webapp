import axios from 'axios';
export const authenticateUser = async (user) => {
  try {
    const res = await axios.post('http://localhost:8080/v1/user/login', user);
    return res.data;
  }     
  catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const createUser = async(user) => {
  try{
    const res = await axios.post('http://localhost:8080/v1/user',user);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const getUser = async(userName) => {
  try{
    const res = await axios.get('http://localhost:8080/v1/user?userName='+userName, {withCredentials: true} );
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const updateUser = async(user, userName) => {
  try{
    const res = await axios.put('http://localhost:8080/v1/user?userName='+userName,user);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const logoutUser = async() => {
  try{
    const res = await axios.put('http://localhost:8080/v1/user/logout');
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}