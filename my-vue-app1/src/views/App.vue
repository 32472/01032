<template>
  <div class="app">
    <h1>商品管理系统</h1>

    <!-- 显示商品列表 -->
    <ProductList
      :products="products"
      :warehouses="warehouses"
      @delete-product="deleteProduct"
      @transfer-product="openTransferForm"
    />

    <!-- 仓库转移表单 -->
    <TransferForm
      v-if="transferFormVisible"
      :product="productToTransfer"
      :warehouses="warehouses"
      @transfer="transferProduct"
      @cancel="cancelTransfer"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import ProductList from "../components/ProductList.vue";
import TransferForm from "../components/TransferForm.vue";

export default {
  components: {
    ProductList,
    TransferForm,
  },
  setup() {
    const products = ref([]);
    const warehouses = ref([]);
    const transferFormVisible = ref(false);
    const productToTransfer = ref(null);

    // 获取商品列表
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/products");
        if (response.status === 200) {
          products.value = response.data;
        }
      } catch (error) {
        console.error("获取商品列表失败", error);
      }
    };

    // 获取仓库列表
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/warehouses");
        if (response.status === 200) {
          warehouses.value = response.data;
        }
      } catch (error) {
        console.error("获取仓库列表失败", error);
      }
    };

    // 删除商品
    const deleteProduct = async (productId) => {
      try {
        const response = await axios.delete(
          `http://localhost:8081/api/products/${productId}`
        );
        if (response.status === 200) {
          fetchProducts();
        }
      } catch (error) {
        console.error("删除商品失败", error);
      }
    };

    // 打开仓库转移表单
    const openTransferForm = (product) => {
      productToTransfer.value = product;
      transferFormVisible.value = true;
    };

    // 取消转移表单
    const cancelTransfer = () => {
      transferFormVisible.value = false;
      productToTransfer.value = null;
    };

    // 转移商品
    const transferProduct = async ({ productId, warehouseId }) => {
      try {
        const response = await axios.put(
          `http://localhost:8081/api/products/transfer/${productId}`,
          { warehouseId }
        );
        if (response.status === 200) {
          fetchProducts();
          cancelTransfer();
        }
      } catch (error) {
        console.error("转移商品失败", error);
      }
    };

    // 初始化数据
    onMounted(() => {
      fetchProducts();
      fetchWarehouses();
    });

    return {
      products,
      warehouses,
      transferFormVisible,
      productToTransfer,
      deleteProduct,
      openTransferForm,
      cancelTransfer,
      transferProduct,
    };
  },
};
</script>

<style scoped>
.app {
  padding: 20px;
}
</style>
