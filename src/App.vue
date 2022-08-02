<template>
  <Setting />
</template>

<script setup lang="ts">
import Setting from '@/components/Setting.vue'
import {useDark} from '@vueuse/core'

useDark()
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
</style>
