<template>
  <div class="section-extra">
    <h1 class="title">Extra</h1>
    <div class="buttons">
      <a-button class="btn-import" type="default">Import</a-button>
      <a-button class="btn-export" type="primary" @click="exportFile">
        Export
      </a-button>
      <a-button class="btn-export" type="primary" @click="showViewModal">
        View all
      </a-button>
    </div>

    <ModalViewAll v-if="canView" @close="canView = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import useRecord from "../composables/useRecord";
import ModalViewAll from "./ModalViewAll.vue";

export default defineComponent({
  name: "SectionExtra",

  components: {
    ModalViewAll,
  },

  setup() {
    const { records } = useRecord();
    const canView = ref<boolean>(false);

    const exportFile = () => {
      let text = JSON.stringify(records);
      let filename = "story.json";
      let element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:application/json;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    const showViewModal = () => {
      canView.value = true;
    };

    return {
      exportFile,
      canView,
      showViewModal,
    };
  },
});
</script>

<style lang="scss" scoped>
.section-extra {
  margin-top: 140px;

  .title {
    font-weight: bold;
  }
  .buttons {
    margin-top: -20px;

    button {
      margin-right: 10px;
    }
  }
}
</style>
