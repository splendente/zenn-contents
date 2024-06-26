---
title: "Nuxt v3.12 からは NuxtRouteAnnouncer でアクセシビリティ改善に取り組もう"
emoji: "📣"
type: "tech"
topics:
  - "nuxtjs"
  - "nuxt3"
  - "アクセシビリティ"
  - "a11y"
published: true
---

## はじめに

先日、Nuxt v3.12 がリリースされました。
リリースノートの中に `<NuxtRouteAnnouncer />` という気になるコンポーネントに関する記述があったため、調べてみることにしました。

https://nuxt.com/docs/api/components/nuxt-route-announcer

## 公式サイトの翻訳

まず、`<NuxtRouteAnnouncer />` の概要を理解するために日本語訳をしようと思います。
以下、公式サイトの日本語訳です。

:::message
このコンポーネントは Nuxt v3.12 以上から利用することができます。
:::

### 使い方

`<NuxtRouteAnnouncer/>` を `app.vue` または `layouts/` に追加するとページタイトルの変更を支援技術に知らせることでアクセシビリティを向上させることができます。これにより、スクリーンリーダーを利用するユーザーに対して、ナビゲーションの変更を確実に知らせることができます。

```vue
<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

### Slots

カスタム HTML またはコンポーネントをルートアナウンサーのデフォルトのスロットとして渡すことができます。

```vue
  <template>
    <NuxtRouteAnnouncer>
      <template #default="{ message }">
        <p>{{ message }} was loaded.</p>
      </template>
    </NuxtRouteAnnouncer>
  </template>
```

### Props

- `atomic`: スクリーンリーダーが変更のみを読み上げるか、コンテンツ全体を読み上げるかを制御します。更新時に全てのコンテンツを読み上げる場合は true を設定し、変更のみを読み上げる場合は false を設定します。(初期値 `false`)
- `politeness`: スクリーンリーダーによる読み上げの緊急度を設定します。: `off` (読み上げを無効)、`polite` (ユーザーがアイドル状態になるまで待つ)、または `assertive` (現在の読み上げを中止し、即座に読み上げられる)。 (初期値 `polite`)

> このコンポーネントは任意です。
> 完全なカスタマイズを実現するためには、[ソースコード](https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/components/nuxt-route-announcer.ts)に基づいてカスタムの設定を実装できます。

> [`useRouteAnnouncer` コンポーザブル](https://nuxt.com/docs/api/composables/use-route-announcer)を使用して
> これにより、カスタムのメッセージを読み上げるように設定できます。

## アクセシビリティについて

なぜ、アクセシビリティを考慮する必要があるのでしょうか？
`<NuxtRouteAnnouncer />` を追加し、ページのタイトルが変更された時に変更内容が読み上げられるとどんな良いことがあるのでしょうか？

ページタイトルに限らず、アプリ内のコンテンツを一度読み込みを終えた後にアプリ内のコンテンツが更新された際に読み上げが行われないとスクリーンリーダーを使用するユーザーはコンテンツの変更に気づくことができません。

もし、変更内容がユーザーにとって重要な情報であった場合でも読み上げが行われなければ、新しい情報に気づくことはできず、古い情報のままアプリを操作してしまう可能性があります。

アプリ内のコンテンツが更新された時に、ユーザーに対して変更内容を通知することでこれらの課題を解決することができます。

ただし、更新された内容が全て重要な情報であるとは限りません。

ユーザーにとって重要な変更を必要なタイミングで通知することでアクセシビリティを向上させることができます。

`<NuxtRouteAnnouncer />` は、ページのタイトルの変更を通知する機能です。

ページタイトル以外のコンテンツが変更した時に通知を行いたい場合は、該当要素に `aria-live` や `aria-atomic` を設定してください。

https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Attributes/aria-live

https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Attributes/aria-atomic

## 検証

実際に `NuxtRouteAnnouncer` を設定した状態でスクリーンリーダーを使用してページタイトルの変更を読み上げてみようと思います。

### 事前準備

Nuxt v3.12 のプロジェクトを用意します。
環境構築について本記事では触れません。
新規でプロジェクトを作成する際は、公式サイトを参照してください。

https://nuxt.com/docs/getting-started/installation#new-project

検証時に使用した v3.12.2 では、`app.vue` に `<NuxtRouteAnnouncer />` が追加された状態でプロジェクトが作成されました。

```vue
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
```

もし、`<NuxtRouteAnnouncer />` が `app.vue` に存在しない場合や `layouts/` に記述したい場合はご自身で `<NuxtRouteAnnouncer />` を追加してください。

今回、検証時には `app.vue` とは別にページ用のファイルを作成するため、 `<NuxtWelcome />` を `<NuxtPage />` に変更します。

```vue
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
```

次に `pages/index.vue` を作成し、下記の内容を記述します。

```vue
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
})
</script>

<template>
  <div>
    <button type="button" @click="handleClickButton">名前を取得する</button>
  </div>
</template>
```

最後にボタンをクリックした時にユーザー情報を1.5秒後に返すAPIを作成します。
`server/api/user.ts` を作成し、次の内容を追加します。

```typescript
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
```

事前準備は以上です。
処理の概要を説明すると、「名前を取得する」というボタンを押すとページタイトルが「loading...」に変更され、1.5秒後に「home」というページタイトルへ再度変更されるという処理を実装しました。

### NuxtRouteAnnouncer で変更を読み上げる

事前準備を終えた状態でアプリを起動し、スクリーンリーダーをオンにした状態でアプリへアクセスし、ボタンを押してみます。

....。

いつまで待っても変更内容が読み上げられません。
理由は当然と言えば当然なのですが、`<NuxtRouteAnnouncer />` の `politeness` という props の初期値が `off` だからです。

`politeness` という props を設定することで読み上げのタイミングを変更することができます。
この `politeness` は最終的に `aria-live` 属性に設定されます。

https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Attributes/aria-live

`politeness` に設定することができる値は、以下の3つの内いずれかです。

- `assertive` - 即座に通知されます
- `polite` - 読み上げ中の文章を読み終えたタイミングやユーザーの操作が中断し、アイドル状態になったタイミングで読み上げを行います
- `off` - 対象の要素にユーザー自身がフォーカスしない限り、読み上げが行われない

これらの値は、`aria-live` で設定できる値と同様です。
`<NuxtRouteAnnouncer />` の実装を追うと上記の3つで型定義されていることが分かりますね。

https://github.com/nuxt/nuxt/blob/c87ca8607cf5dde72979c44abbd0da818d608078/packages/nuxt/src/app/composables/route-announcer.ts#L6-L11

変更があったらすぐに通知を行うために `assertive` を設定してみます。

```vue
<NuxtRouteAnnouncer politeness="assertive" />
```

ボタンを押した直後に「loading...」と通知されます。

![](/images/nuxt-route-announcer-verification/loading.png)

そして、1.5 秒後に「home」と読み上げられました。

![](/images/nuxt-route-announcer-verification/home.png)

### 読み上げ内容を変更する

`atomic` という props を設定することで読み上げの内容を変更することができます。
これは、`aria-atomic` に相当する機能です。
この `atomic` は最終的に `aria-atomic` 属性に設定されます。

https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Attributes/aria-atomic

`atomic` に設定することができる値は、`true` または `false` です。
デフォルトの値は、`false` になっています。

値が `true` の場合、読み上げはライブリージョン領域を全て読み上げます。
逆に `false` の場合、変更箇所のみが読み上げられます。

`app.vue` を次のように変更します。

```vue
<template>
  <div>
    <NuxtRouteAnnouncer politeness="assertive">
      <template #default="{ message }">
        <p>ページタイトルが変更されました。</p>
        <span>{{ message }}</span>
      </template>
    </NuxtRouteAnnouncer>
    <NuxtPage />
  </div>
</template>
```

デフォルト値は `false` になっているため、ページタイトルが変更された際に「home」もしくは「loading...」だけが読み上げられます。

次に値を `true` に変更し、読み上げの対象がライブリージョン領域の全体になっていることを確認します。

```vue
<NuxtRouteAnnouncer :atomic="true" politeness="assertive">
```

ボタンを押した直後に「ページタイトルがに変更されました。loading...」と通知されます。

![](/images/nuxt-route-announcer-verification/loading-with-text.png)

そして、1.5 秒後に「ページタイトルがに変更されました。home」と読み上げられました。

![](/images/nuxt-route-announcer-verification/home-with-text.png)

## まとめ

以上が、`<NuxtRouteAnnouncer />` コンポーネントについてでした。
ページタイトルが変更された時にユーザーに通知を行いたい場合はぜひ`<NuxtRouteAnnouncer />`を活用し、アクセシビリティを向上させていきましょう。

## おまけ

せっかくなので `<NuxtRouteAnnouncer />` の使い方だけでなく、`<NuxtRouteAnnouncer />` がどのようにページタイトルの読み上げを実現しているのか、実装を簡単に追ってみようと思います。

`packages/nuxt/src/app/components/nuxt-route-announcer.ts` に `<NuxtRouteAnnouncer />` のソースコードがあります。

特に注目したい点が `return` 箇所です。

https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/components/nuxt-route-announcer.ts#L24-L46

h関数を使用して、`span` タグを生成していることが分かります。

実際にアプリを起動した状態で DevTools を使用して確認すると、確かに `span` タグが生成されています。

![](/images/nuxt-route-announcer-verification/span.png)

`span` タグには、`props` で指定した `atomic` と `politeness` の値が、`aria-atomic` と `aria-live` の値として指定されています。

つまり、この `span` タグ内のコンテンツが変更された時に、ユーザーに対して通知が行われるという仕組みです。

ページタイトルと聞くと `title` タグのことかな？と想像してしまうのですが、読み上げの対象となるライブリージョン領域は、コンテンツ内に存在しているんですね。

推測にはなってしまいますが、`title` タグ自体に `aria-atomic` や `aria-live` などの `WAI-ARIA` を直接指定することができないため、上記のような実装を行なっているのではないかと思います。
