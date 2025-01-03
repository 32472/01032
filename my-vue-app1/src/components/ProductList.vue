<template>
  <div class="app">
    <h1 class="title">商品管理系统</h1>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-message">
      <span>{{ errorMessage }}</span>
    </div>

    <!-- 加载中效果 -->
    <div v-if="loading" class="loading">
      <span>加载中...</span>
      <div class="spinner"></div>
    </div>

    <!-- 仓库选择 -->
    <div v-if="!loading" class="warehouse-select">
      <label for="warehouse-select">选择仓库:</label>
      <select id="warehouse-select" v-model="selectedWarehouseId" @change="fetchProducts">
        <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
          {{ warehouse.name }}
        </option>
      </select>
    </div>

    <!-- 显示商品列表 -->
    <div v-if="!loading && products.length > 0" class="product-list">
      <table class="product-table">
        <thead>
          <tr>
            <th>商品名称</th>
            <th>供应商</th>
            <!-- <th>仓库名称</th>
            <th>仓库ID</th> -->
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.supplier }}</td>
            <!-- <td>{{ getWarehouseName(product.warehouseId) }}</td> -->
            <!-- <td>{{ product.warehouseId }}</td> -->
            <td>
              <button class="delete-btn" @click="deleteProduct(product.id)">删除</button>
              <button class="transfer-btn" @click="selectTransferWarehouse(product)">转移仓库</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 添加商品 -->
    <div v-if="!loading" class="add-product">
      <h3>添加新商品</h3>
      <form @submit.prevent="addProduct" class="add-product-form">
        <div class="input-group">
          <label for="product-name">商品名称:</label>
          <input type="text" id="product-name" v-model="newProduct.name" required />
        </div>

        <div class="input-group">
          <label for="product-supplier">供应商:</label>
          <input type="text" id="product-supplier" v-model="newProduct.supplier" required />
        </div>

        <div class="input-group">
          <label for="product-warehouse-id">仓库ID:</label>
          <input type="number" id="product-warehouse-id" v-model="newProduct.warehouseId" required />
        </div>

        <button type="submit" class="submit-btn">添加商品</button>
      </form>
    </div>

    <!-- 转移仓库弹窗 -->
    <div v-if="showTransferModal" class="modal">
      <div class="modal-content">
        <h3>选择目标仓库</h3>
        <select v-model="transferWarehouseId">
          <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
            {{ warehouse.name }}
          </option>
        </select>
        <button @click="transferProduct" class="transfer-btn">确认转移</button>
        <button @click="closeTransferModal" class="cancel-btn">取消</button>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'App',
  setup() {
    const products = ref([]); // 商品列表数据
    const warehouses = ref([]); // 仓库列表数据
    const selectedWarehouseId = ref(2); // 默认选中仓库ID为2
    const loading = ref(false); // 加载状态
    const errorMessage = ref(''); // 错误信息
    const newProduct = ref({
      name: '',
      supplier: '',
      warehouseId: null,
    }); // 新商品数据
    const showTransferModal = ref(false); // 是否显示转移仓库弹窗
    const transferWarehouseId = ref(null); // 转移到的目标仓库ID
    const productToTransfer = ref(null); // 当前要转移的商品

    // 获取商品列表
    const fetchProducts = async () => {
      loading.value = true; // 开始加载
      errorMessage.value = ''; // 清除旧的错误信息

      try {
        const warehouseId = selectedWarehouseId.value; // 使用当前选择的仓库ID
        const response = await axios.get(`http://101.200.120.14:9090/api/products/${warehouseId}/products`);
        if (response.status === 200) {
          products.value = response.data; // 将数据赋值给商品列表
        } else {
          errorMessage.value = '获取商品列表失败，服务器返回错误'; // 错误处理
        }
      } catch (error) {
        console.error('获取商品列表失败', error);
        errorMessage.value = '获取商品列表失败，请稍后再试'; // 捕获异常
      } finally {
        loading.value = false; // 加载结束
      }
    };

    // 获取所有仓库列表
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get('http://101.200.120.14:9090/api/warehouses/all');
        if (response.status === 200) {
          warehouses.value = response.data; // 将数据赋值给仓库列表
        }
      } catch (error) {
        console.error('获取仓库列表失败', error);
      }
    };

    // 获取仓库名称
    const getWarehouseName = (warehouseId) => {
      const warehouse = warehouses.value.find((wh) => wh.id === warehouseId);
      return warehouse ? warehouse.name : '未知仓库';
    };

    // 添加商品
    const addProduct = async () => {
      if (!newProduct.value.name || !newProduct.value.supplier || !newProduct.value.warehouseId) {
        errorMessage.value = '请填写所有字段'; // 表单验证
        return;
      }

      try {
        const response = await axios.post('http://101.200.120.14:9090/api/products/add', newProduct.value);
        if (response.status === 201) {
          // 成功后清空输入框并重新加载商品列表
          newProduct.value.name = '';
          newProduct.value.supplier = '';
          newProduct.value.warehouseId = null;
          fetchProducts();
        } else {
          errorMessage.value = '添加商品失败';
        }
      } catch (error) {
        console.error('添加商品失败', error);
        errorMessage.value = '添加商品失败，请稍后再试';
      }
    };

    // 删除商品
    const deleteProduct = async (productId) => {
      try {
        const response = await axios.delete(`http://101.200.120.14:9090/api/products/${productId}`);
        if (response.status === 200) {
          // 成功删除后重新加载商品列表
          fetchProducts();
        } else {
          errorMessage.value = '删除商品失败';
        }
      } catch (error) {
        console.error('删除商品失败', error);
        errorMessage.value = '删除商品失败，请稍后再试';
      }
    };

    // 显示转移仓库弹窗
    const selectTransferWarehouse = (product) => {
      productToTransfer.value = product;
      transferWarehouseId.value = product.warehouseId; // 默认当前商品的仓库ID
      showTransferModal.value = true;
    };

    // 关闭转移仓库弹窗
    const closeTransferModal = () => {
      showTransferModal.value = false;
    };

    // 执行转移仓库操作
    const transferProduct = async () => {
      if (!transferWarehouseId.value || transferWarehouseId.value === productToTransfer.value.warehouseId) {
        errorMessage.value = '请选择不同的目标仓库'; // 检查是否选择了有效的目标仓库
        return;
      }

      try {
        const response = await axios.put(`http://101.200.120.14:9090/api/products/transfer/${productToTransfer.value.id}?newWarehouseId=${transferWarehouseId.value}`);
        
        if (response.status === 200) {
          fetchProducts(); // 转移成功后重新加载商品列表
          closeTransferModal(); // 关闭弹窗
        } else {
          errorMessage.value = '转移仓库失败';
        }
      } catch (error) {
        console.error('转移仓库失败', error);
        errorMessage.value = '转移仓库失败，请稍后再试';
      }
    };

    // 初始化数据
    onMounted(() => {
      fetchWarehouses(); // 获取所有仓库
      fetchProducts(); // 获取商品列表
    });

    return {
      products,
      warehouses,
      selectedWarehouseId,
      loading,
      errorMessage,
      newProduct,
      showTransferModal,
      transferWarehouseId,
      productToTransfer,
      fetchProducts,
      addProduct,
      deleteProduct,
      selectTransferWarehouse,
      closeTransferModal,
      transferProduct,
      getWarehouseName
    };
  }
};
</script>

<style scoped>
/* 样式 */
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  font-size: 24px;
}

.error-message {
  color: red;
  font-size: 14px;
}

.loading {
  text-align: center;
}

.warehouse-select {
  margin-bottom: 20px;
}

.product-list {
  margin-top: 20px;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th, .product-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.add-product {
  margin-top: 30px;
}

.input-group {
  margin-bottom: 10px;
}

.submit-btn,
.delete-btn,
.transfer-btn {
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.submit-btn:hover,
.delete-btn:hover,
.transfer-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #e53935;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}

input, select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
}
</style>
