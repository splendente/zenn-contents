export default defineEventHandler(async() => {
  // ユーザー情報を定義
  const user = {
    name: 'John',
    age: 18
  };

  // 値の返却までに1.5秒待機
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    user
  }
});