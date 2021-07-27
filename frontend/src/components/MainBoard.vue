<template>
  <div class="main-board">
    <SectionStory />

    <PanelRole />
    <PanelReply />
    <PanelEmo />

    <SectionExtra />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, toRefs } from "vue";
import { nanoid } from "nanoid";
import PanelRole from "./PanelRole.vue";
import PanelReply from "./PanelReply.vue";
import PanelEmo from "./PanelEmo.vue";
import SectionStory from "./SectionStory.vue";
import SectionExtra from "./SectionExtra.vue";
</script>

<style lang="scss" scoped>
.main-board {
  @include sizeWH(100%, 100%);
  padding: 0.1rem 2.5rem;
  position: relative;
  text-align: left;
}
</style>
