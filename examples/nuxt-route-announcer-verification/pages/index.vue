<script setup lang="ts">
/**
 * @typedef ユーザー情報
 * @property {string} name - 名前
 * @property {number} age - 年齢
 */
 type User = {
  user: {
    name: string;
    age: number;
  }
}
const loading = ref<boolean>(false);
const name = ref<string>('');

/*
 * ボタンがクリックされたらユーザー情報を取得する
 */
const handleClickButton = async () => {
  loading.value = true;

  const { data } = await useFetch<User>('/api/user');

  if (data.value?.user?.name) {
    name.value = data.value.user.name;
  }

  loading.value = false;
}

useHead({
  title: () => loading.value
    ? 'loading...'
    : 'home'
});
</script>

<template>
  <div>
    <button type="button" @click="handleClickButton">名前を取得する</button>
  </div>
</template>
