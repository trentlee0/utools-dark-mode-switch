<template>
  <Setting />
</template>

<script setup lang="ts">
import Setting from '@/components/Setting.vue'
import { useDark } from '@vueuse/core'

useDark()
</script>

<style lang="css">
* {
  margin: 0;
  padding: 0;
  background: var(--el-bg-color);
}
</style>
