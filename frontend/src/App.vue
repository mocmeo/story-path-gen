<template>
  <div class="main">
    <MainBoard />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MainBoard from "@/components/MainBoard.vue";

export default defineComponent({
  name: "App",
  components: {
    MainBoard,
  },
});
</script>

<style lang="scss">
#app {
  @include sizeWH(100%, 100%);
  @include textMixin(#fff, 30px, bold);
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: relative;
}
</style>
