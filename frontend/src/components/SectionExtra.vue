<template>
  <div class="section-extra">
    <h1 class="title">Extra</h1>
    <input type="file" id="selectFiles" />
    <div class="buttons">
      <a-button class="btn-import" type="default" @click="importFile">
        Import
      </a-button>
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

<script>
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
    const canView = ref(false);

    const importFile = () => {
      const files = document.getElementById("selectFiles").files;
      if (files.length <= 0) return;
      const fr = new FileReader();

      fr.onload = function (e) {
        var result = JSON.parse(e.target.result);
        Object.keys(result).forEach((recordId) => {
          records[recordId] = result[recordId];
        });
      };

      fr.readAsText(files.item(0));
    };

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
      importFile,
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
    margin-bottom: -10px;
  }

  input {
    font-size: 14px;
    font-weight: normal;
  }

  .buttons {
    button {
      margin-right: 10px;
    }
  }
}
</style>
