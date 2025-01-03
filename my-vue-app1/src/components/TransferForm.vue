<template>
  <div v-if="product" class="transfer-form">
    <h3>转移商品到新仓库</h3>
    <form @submit.prevent="onTransfer">
      <div class="input-group">
        <label for="new-warehouse">选择目标仓库:</label>
        <select v-model="selectedWarehouseId" required>
          <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
            {{ warehouse.name }}
          </option>
        </select>
      </div>
      <button type="submit">转移</button>
      <button type="button" @click="onCancel">取消</button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    product: Object,
    warehouses: Array,
  },
  data() {
    return {
      selectedWarehouseId: this.product?.warehouseId || null,
    };
  },
  methods: {
    onTransfer() {
      this.$emit("transfer", {
        productId: this.product.id,
        warehouseId: this.selectedWarehouseId,
      });
    },
    onCancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
.transfer-form {
  padding: 20px;
  background-color: #f4f4f4;
}

.input-group {
  margin-bottom: 10px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
