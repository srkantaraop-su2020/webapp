import axios from 'axios';
let ip = window.location.hostname;
export const authenticateUser = async (user) => {
  try {
    const res = await axios.post('https://'+ip+':8080/v1/user/login', user);
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
    console.log("IP addres: "+ip)
    const res = await axios.post('https://'+ip+':8080/v1/user',user);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const getUser = async(userName) => {
  try{
    const res = await axios.get('https://'+ip+':8080/v1/user?userName='+userName, {withCredentials: true} );
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const updateUser = async(user, userName) => {
  try{
    const res = await axios.put('https://'+ip+':8080/v1/user?userName='+userName,user);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const logoutUser = async() => {
  try{
    const res = await axios.put('https://'+ip+':8080/v1/user/logout');
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const getBooks = async() => {
  try{
    const res = await axios.get('https://'+ip+':8080/v1/book');
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const createBook = async(book) => {
  try{
    const res = await axios.post('https://'+ip+':8080/v1/book',book);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const createAuthor = async(author) => {
  try{
    const res = await axios.post('https://'+ip+':8080/v1/author',author);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const deleteBook = async(bookId) => {
  try{
    const res = await axios.delete('https://'+ip+':8080/v1/book/'+bookId);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const updateBook = async(book) => {
  try{
    const res = await axios.put('https://'+ip+':8080/v1/book', book);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const updateAuthor = async(author) => {
  try{
    const res = await axios.put('https://'+ip+':8080/v1/author/'+author.bookId, author);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const getBookById = async(bookId) => {
  try{
    const res = await axios.get('https://'+ip+':8080/v1/book/'+bookId);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const addItemToCart = async(item) => {
  try{
    const res = await axios.post('https://'+ip+':8080/v1/addToCart', item);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const getCartItemsByBuyerId = async(buyerId) => {
  try{
    const res = await axios.get('https://'+ip+':8080/v1/getCartItems/'+buyerId);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const updateCartItem = async(cartId, item) => {
  try{
    const res = await axios.put('https://'+ip+':8080/v1/updateCartItem/'+cartId, item);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const getImagesOfBook = async(sellerId, bookId) => {
  try{
    const res = await axios.get('https://'+ip+':8080/v1/images/seller/'+sellerId+'/book/'+bookId);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const deleteImage = async(fileName, bookId) => {
  try{
    const res = await axios.delete('https://'+ip+':8080/v1/image/fileName/'+fileName+'/bookId/'+bookId);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}

export const resetPassword = async(user) => {
  try{
    const res = await axios.post('https://'+ip+':8080/v1/resetPassword',user);
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
  }
}