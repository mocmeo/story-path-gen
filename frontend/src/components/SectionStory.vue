<template>
  <div class="section-story">
    <h1 class="title">Storylines:</h1>

    <a-button
      class="btn-back"
      type="primary"
      :disabled="isAdding"
      @click="moveBackward"
    >
      Back
    </a-button>

    <div class="panel-adder" v-if="!isAdding">
      <a-button type="primary" :disabled="disabledAdd" @click="toggleAdd">
        Add
      </a-button>
      <a-button
        type="dashed"
        v-if="!isAdding"
        :disabled="disabledAdd || disabledAddOld"
        @click="showAddOldModal"
      >
        Add old
      </a-button>
      <a-button
        type="danger"
        :disabled="disabledOverride"
        @click="toggleOverride"
      >
        Override
      </a-button>
    </div>

    <template v-else>
      <a-button class="btn-cancel" @click="toggleAdd">Cancel</a-button>
      <a-input
        class="input"
        placeholder="Enter"
        @keyup.enter="enterText"
        v-model:value="textVal"
      />
    </template>

    <div class="last">Last: {{ lastLine }}</div>
    <table class="normal" v-if="selectedReply === 'normal'">
      <tr>
        <th>Content</th>
        <th>Role</th>
        <th>Emotion</th>
        <th>Action</th>
      </tr>
      <template v-if="!isEmpty(currentLine)">
        <tr>
          <td @click="moveForward(currentLine.id)">
            <span>{{ currentLine.text }}</span>
          </td>
          <td>{{ currentLine.role }}</td>
          <td>{{ currentLine.emotion }}</td>
          <td>
            <EditOutlined @click="showEditModal(currentLine)" />
            <CloseOutlined @click="clearNode(currentLine.id)" />
          </td>
        </tr>
      </template>
    </table>
    <table class="decision" v-else>
      <tr>
        <th>Option (A,B,C)</th>
        <th>Role</th>
        <th>Emotion</th>
        <th>Action</th>
      </tr>
      <tr v-for="option in records[index].options" :key="option.id">
        <td @click="moveForward(option.id)">{{ option.text }}</td>
        <td>{{ option.role }}</td>
        <td>{{ option.emotion }}</td>
        <td>
          <EditOutlined @click="showEditModal(option)" />
          <CloseOutlined @click="clearNode(option.id)" />
        </td>
      </tr>
    </table>

    <teleport to="body">
      <ModalEdit
        v-if="showEdit"
        :record="selectedRecord"
        @close="closeEditModal"
      />

      <ModalAddOld
        v-if="showAddOld"
        @close="closeAddOldModal"
        @confirm="confirmAddOld"
        :recordId="index"
        :allRecords="records"
      />
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { EditOutlined, CloseOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref, computed } from "vue";
import { nanoid } from "nanoid";
import isEmpty from "lodash/isEmpty";
import ModalEdit from "./ModalEdit.vue";
import ModalAddOld from "./ModalAddOld.vue";
import useRecord from "../composables/useRecord";

const { records, selectedRecord, selectedReply, selectedRole, selectedEmo } =
  useRecord();

const isAdding = ref<boolean>(false);
const textVal = ref<string>("");
const index = ref<string>("-1");

const showEdit = ref<boolean>(false);
const showAddOld = ref<boolean>(false);

// ------- COMPUTED VALUES ----------
const indexAft = computed(() => {
  return records[index.value]?.next || {};
});

const currentLine = computed(() => {
  if (indexAft.value) {
    return records[indexAft.value];
  }
  return {};
});

const lastLine = computed(() => {
  const prevId = index.value;
  return records[prevId]?.text || "";
});

const disabledAdd = computed(() => {
  // alrdy added reply
  if (!isEmpty(currentLine.value)) {
    return true;
  }
  if (selectedRole.value !== "girl" && selectedReply.value === "decision") {
    return true;
  }
  return false;
});

const disabledOverride = computed(() => {
  if (selectedRole.value !== "girl" && selectedReply.value === "decision") {
    return true;
  }
  return false;
});

const disabledAddOld = computed(() => {
  if (selectedReply.value === "decision") return true;
});

// ------- FUNCTIONS -------------
const displayReplyMode = () => {
  const options = records[index.value].options;
  if (options.length > 0) {
    selectedReply.value = "decision";
  } else {
    selectedReply.value = "normal";
  }
};

const moveForward = (nodeId: string) => {
  index.value = nodeId;
  displayReplyMode();
};

const moveBackward = () => {
  if (index.value === "-1") return;
  const prevId = records[index.value].prev;
  if (prevId) {
    index.value = prevId;
    displayReplyMode();
  }
};

const toggleAdd = () => {
  if (disabledAdd.value) return;
  isAdding.value = !isAdding.value;
};

const toggleOverride = () => {
  if (disabledOverride.value) return;
  isAdding.value = !isAdding.value;
};

const enterText = () => {
  const prevId = index.value;
  const nowId = nanoid();

  if (selectedReply.value === "normal") {
    enterNormalReply(prevId, nowId);
  } else {
    enterOptions(prevId, nowId);
  }

  textVal.value = "";
  isAdding.value = !isAdding.value;
};

const enterNormalReply = (prevId: string, nowId: string) => {
  records[prevId].next = nowId;
  records[nowId] = {
    id: nowId,
    role: selectedRole.value,
    emotion: selectedEmo.value,
    text: textVal.value,
    prev: prevId,
    next: null,
    options: [],
  };
};

const enterOptions = (prevId: string, nowId: string) => {
  const newRecord = {
    id: nowId,
    role: selectedRole.value,
    emotion: selectedEmo.value,
    text: textVal.value,
    prev: prevId,
    next: null,
    options: [],
  };

  records[prevId].options.push(newRecord);
  records[nowId] = newRecord;
};

const clearNode = (nodeId: string) => {
  if (records[nodeId].prev) {
    index.value = records[nodeId].prev;
  }
  delete records[nodeId];
  if (selectedReply.value === "decision") {
    records[index.value].options = records[index.value].options.filter(
      (record: any) => record.id !== nodeId
    );
  }
};

const showAddOldModal = () => {
  showAddOld.value = true;
};

const closeAddOldModal = () => {
  showAddOld.value = false;
};

const confirmAddOld = (chosenId: string) => {
  console.log(chosenId);
  const prevId = index.value;
  const nowId = chosenId;

  records[prevId].next = nowId;
  records[nowId] = {
    ...records[nowId],
    prev: prevId,
  };
  closeAddOldModal();
};

const showEditModal = (record: any) => {
  selectedRecord.value = record;
  showEdit.value = true;
};

const closeEditModal = () => {
  showEdit.value = false;
};
</script>

<style lang="scss" scoped>
.section-story {
  @include flexCenter(column);
  position: relative;
  align-items: flex-start;

  .title {
    font-weight: bold;
  }

  .panel-adder {
    @include flexCenter(row);

    button {
      margin-right: 0.1rem;
    }
  }

  .btn-back {
    @include position(absolute, $top: 0.5rem, $right: 0);
  }

  .btn-cancel {
    margin-bottom: 0.1rem;
  }

  table {
    @include textMixin(#212121, 19px, normal);
    box-shadow: rgba(53, 144, 255, 0.25) 0px 1px 9px 0px;
    margin-top: 0.1rem;
    th {
      font-weight: bold;
      color: #707a8a;
      padding: 0 0.1rem;
    }
    td,
    th {
      border-right: #f0f0f0 solid 0.01rem;
      height: 40px;
      padding: 0 0.1rem;

      &:first-child {
        width: 90%;
      }
      &:nth-child(2),
      &:nth-child(3) {
        width: 15%;
        text-transform: capitalize;
      }
      &:nth-child(3) {
        width: 10%;
      }
    }

    td {
      border-top: #f0f0f0 solid 0.01rem;

      span {
        margin-right: 10px;
      }
    }
  }

  .last {
    @include textMixin(rgb(119, 108, 108), 20px, normal);
    margin-top: 0.1rem;
  }

  .input {
    font-weight: normal;
  }
}
</style>
