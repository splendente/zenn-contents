<script setup lang="ts">
/*
 * ボタンがクリックされたらアラートを表示する
 */
const showAlert = () => {
  window.alert("buttonタグがクリックされました");
};
</script>

<template>
  <div>
    <Button text="buttonタグ" element="button" @on-click="showAlert" />
    <Button text="aタグ" element="anchor-link" href="#" target="_blank" />
    <Button text="NuxtLinkコンポーネント" element="nuxt-link" to="#" />
  </div>
</template>
