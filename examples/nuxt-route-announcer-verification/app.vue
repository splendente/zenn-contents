<template>
  <div>
    <!-- MEMO:propsの値を変更することで読み上げの内容と通知のタイミングを変更することができます。 -->
    <NuxtRouteAnnouncer>
      <template #default="{ message }">
        <p>ページタイトルが<span>{{ message }}</span>に変更されました。</p>
      </template>
    </NuxtRouteAnnouncer>
    <NuxtPage />
  </div>
</template>
