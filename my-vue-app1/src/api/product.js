import axios from 'axios';

const API_URL = 'http://localhost:8081/api/products';

export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("获取商品数据失败", error);
  }
};

export const deleteProduct = async (productId) => {
  try {
    await axios.delete(`${API_URL}/${productId}`);
  } catch (error) {
    console.error("删除商品失败", error);
  }
};

export const transferProduct = async (productId, warehouseId) => {
  try {
    await axios.put(`${API_URL}/transfer/${productId}`, { warehouseId });
  } catch (error) {
    console.error("转移商品失败", error);
  }
};
