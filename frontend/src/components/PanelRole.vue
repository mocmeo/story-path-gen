<template>
  <div class="panel-role">
    <div class="wrapper">
      <label for="role">Pick role:</label>
      <a-select
        default-value="girl"
        style="width: 120px"
        @change="handleRoleChange"
      >
        <a-select-option v-for="(role, i) in roles" :value="role" :key="i">{{
          role
        }}</a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useRecord from "../composables/useRecord";

export default defineComponent({
  name: "PanelRole",

  setup() {
    const { selectedRole } = useRecord();
    const roles = ["prompt", "scene", "girl", "jenny", "joshua"];

    const handleRoleChange = (value: string) => {
      console.log(value);
      selectedRole.value = value;
    };

    return {
      roles,
      handleRoleChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.panel-role {
  position: relative;

  .wrapper {
    @include position(absolute, $top: 0.25rem, $right: 210px);
    @include textMixin(#212121, 16px, normal);

    label {
      margin-right: 0.1rem;
    }
  }
}
</style>
