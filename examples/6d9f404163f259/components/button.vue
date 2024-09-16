<script setup lang="ts">
type Props = {
  element: "button" | "anchor-link" | "nuxt-link";
  text?: string;
  type?: string;
  href?: string;
  target?: string;
  to?: string;
};

const { element = 'button', text = '', type = '', href = '', target = '', to = ''} = defineProps<Props>();

defineSlots<{
  icon: () => HTMLImageElement;
}>();

const emit = defineEmits<{
  (e: "onClick"): void;
}>();

const onClick = () => {
  emit("onClick");
};

// buttonタグの場合に使用する属性情報と押下時の処理
const buttonProps = {
  type: type,
  onClick,
};

// aタグの場合に使用する属性情報
const anchorProps = {
  href: href,
  target: target,
};

// NuxtLinkコンポーネントの場合に使用する属性情報
const nuxtLinkProps = {
  to: to,
  target: target,
};

const component = computed(() => {
  switch (element) {
    case "button":
      return {
        element: "button",
        props: buttonProps,
      };
    case "anchor-link":
      return {
        element: "a",
        props: anchorProps,
      };
    case "nuxt-link":
      return {
        element: resolveComponent("NuxtLink"),
        props: nuxtLinkProps,
      };
    default: {
      return {
        element: "button",
        props: buttonProps,
      };
    }
  }
});
</script>

<template>
  <component :is="component.element" v-bind="{ ...component.props }">
    <slot name="icon" />
    {{ text }}
  </component>
</template>

<style scoped></style>