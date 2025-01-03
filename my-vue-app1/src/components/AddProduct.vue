<template>
  <div>
    <h3>添加商品</h3>
    <el-form :model="newProduct" label-width="100px">
      <el-form-item label="商品名称">
        <el-input v-model="newProduct.name" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item label="商品数量">
        <el-input-number v-model="newProduct.quantity" min="1" label="数量" />
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input-number v-model="newProduct.price" min="0" label="价格" />
      </el-form-item>
      <el-button @click="submitForm" type="primary">添加商品</el-button>
    </el-form>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AddProduct',
  emits: ['addProduct'],
  setup(props, { emit }) {
    const newProduct = ref({
      name: '',
      quantity: 1,
      price: 0,
    });

    const submitForm = () => {
      if (!newProduct.value.name || newProduct.value.quantity <= 0 || newProduct.value.price <= 0) {
        alert('请填写完整的商品信息');
        return;
      }
      emit('addProduct', newProduct.value);
      newProduct.value = { name: '', quantity: 1, price: 0 };  // 重置表单
    };

    return {
      newProduct,
      submitForm,
    };
  },
};
</script>
