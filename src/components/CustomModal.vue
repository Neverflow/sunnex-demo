<template>
  <div class="modal" v-show="props.visible" @click.self="close">
    <div class="modal-mask"></div>
    <div
      class="modal-container"
      :class="{ 'modal-fade-enter-active': props.visible }"
    >
      <div class="modal-header">
        <h3>{{ props.title }}</h3>
        <button class="modal-close" @click="close">×</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ title: string; visible: boolean }>();
const emit = defineEmits<{ (e: "update:visible", value: boolean): void }>();

const close = () => {
  emit("update:visible", false);
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.modal-container {
  position: relative;
  width: 500px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  animation: modal-fade-enter 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-close {
  border: none;
  background-color: transparent;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s ease-out;
}

.modal-close:hover {
  color: #f00;
}

.modal-fade-enter-active {
  animation: modal-fade-enter 0.3s ease-out;
}

@keyframes modal-fade-enter {
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
