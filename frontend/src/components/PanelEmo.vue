<template>
  <div class="panel-emos">
    <div class="wrapper">
      <label for="reply">Emos:</label>
      <a-select
        default-value="happy"
        style="width: 120px"
        @change="handleEmoChange"
      >
        <a-select-option value="happy">Happy</a-select-option>
        <a-select-option value="neutral">Neutral</a-select-option>
        <a-select-option value="sad">Sad</a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useRecord from "../composables/useRecord";

export default defineComponent({
  name: "PanelEmo",

  setup() {
    const { selectedEmo } = useRecord();

    const handleEmoChange = (value: string) => {
      selectedEmo.value = value;
    };

    return {
      handleEmoChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.panel-emos {
  position: relative;

  .wrapper {
    @include position(absolute, $top: 80px, $right: 0);
    @include textMixin(#212121, 16px, normal);

    label {
      margin-right: 0.1rem;
    }
  }
}
</style>
