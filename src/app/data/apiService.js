//apiService.js
import axios from 'axios';


const API_URL = 'https://localhost:44390/api/products';

export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};
