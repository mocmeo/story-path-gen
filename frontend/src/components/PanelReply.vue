<template>
  <div class="panel-reply">
    <div class="wrapper">
      <label for="reply">Reply:</label>
      <a-select
        default-value="normal"
        style="width: 120px"
        @change="handleReplyChange"
      >
        <a-select-option value="normal">Normal</a-select-option>
        <a-select-option value="decision">Decision</a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useRecord from "../composables/useRecord";

export default defineComponent({
  name: "PanelReply",

  setup() {
    const { selectedReply } = useRecord();

    const handleReplyChange = (value: string) => {
      selectedReply.value = value;
    };

    return {
      handleReplyChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.panel-reply {
  position: relative;

  .wrapper {
    @include position(absolute, $top: 0.25rem, $right: 0);
    @include textMixin(#212121, 16px, normal);

    label {
      margin-right: 0.1rem;
    }
  }
}
</style>
