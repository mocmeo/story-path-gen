<template>
  <div class="main-board">
    <h1 class="title">Storylines:</h1>
    <div class="section-story">
      <a-button class="btn-back" type="primary" @click="moveBackward">
        Back
      </a-button>

      <div class="panel-adder" v-if="!isAdding">
        <a-button type="primary" :disabled="disabledAdd" @click="toggleAdd">
          Add
        </a-button>
        <a-button type="dashed" v-if="!isAdding" :disabled="disabledAdd">
          Add old
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
          <th>Action</th>
        </tr>
        <template v-if="!isEmpty(currentLine)">
          <tr>
            <td @click="moveForward(currentLine.id)">
              <span>{{ currentLine.text }}</span>
            </td>
            <td>{{ currentLine.role }}</td>
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
          <th>Action</th>
        </tr>
        <tr v-for="option in records[index].options" :key="option.id">
          <td @click="moveForward(option.id)">{{ option.text }}</td>
          <td>{{ option.role }}</td>
          <td>
            <EditOutlined @click="showEditModal(option)" />
            <CloseOutlined @click="clearNode(option.id)" />
          </td>
        </tr>
      </table>
    </div>

    <div class="section-role">
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

    <div class="section-reply">
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

    <ModalEdit
      v-if="showEdit"
      :record="selectedRecord"
      @close="closeEditModal"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive } from "vue";
import { nanoid } from "nanoid";
import { EditOutlined, CloseOutlined } from "@ant-design/icons-vue";
import ModalEdit from "./ModalEdit.vue";
import isEmpty from "lodash/isEmpty";

const records = reactive<Record<string, any>>({
  "-1": {
    id: "-1",
    role: "",
    text: "<null>",
    prev: null,
    next: null,
    options: [],
  },
});

const visible = ref<boolean>(false);
const roles = ["prompt", "scene", "girl", "jenny", "joshua"];
const isAdding = ref<boolean>(false);
const textVal = ref<string>("");
const selectedRole = ref<string>("girl");
const selectedReply = ref<string>("normal");
const index = ref<string>("-1");

const selectedRecord = ref<Record<string, any>>({});
const showEdit = ref<boolean>(false);

// ------- COMPUTED VALUES ----------
const indexAft = computed(() => {
  return records[index.value].next;
});

const currentLine = computed(() => {
  if (indexAft.value) {
    return records[indexAft.value];
  }
  return {};
});

const lastLine = computed(() => {
  const prevId = index.value;
  return records[prevId].text;
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

// ------- FUNCTIONS -------------
const moveForward = (nodeId: string) => {
  index.value = nodeId;
};

const moveBackward = () => {
  if (index.value === "-1") return;
  index.value = records[index.value].prev;
};

const toggleAdd = () => {
  if (disabledAdd.value) return;
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
    text: textVal.value,
    prev: prevId,
    next: null,
    options: [],
  };

  records[prevId].options.push(newRecord);
  records[nowId] = newRecord;
};

const handleReplyChange = (value: string) => {
  selectedReply.value = value;
};

const handleRoleChange = (value: string) => {
  selectedRole.value = value;
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

const showEditModal = (record: any) => {
  selectedRecord.value = record;
  showEdit.value = true;
};

const closeEditModal = () => {
  showEdit.value = false;
  console.log(records);
};
</script>

<style lang="scss" scoped>
.main-board {
  @include sizeWH(100%, 100%);
  padding: 0.1rem 3rem;
  position: relative;
  text-align: left;

  .title {
    @include textMixin(#212121, 32px, bold);
    margin-bottom: 0.1rem;
  }

  .section-story {
    @include flexCenter(column);
    position: relative;
    align-items: flex-start;

    .panel-adder {
      @include flexCenter(row);

      button {
        margin-right: 0.1rem;
      }
    }

    .btn-back {
      @include position(absolute, $top: 0rem, $right: 0);
    }

    .btn-cancel {
      margin-bottom: 0.1rem;
    }

    table {
      @include textMixin(#212121, 19px, normal);
      box-shadow: 0 0 20px rgb(0 0 0 / 8%);
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
        &:nth-child(2) {
          width: 15%;
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
      @include textMixin(#000, 20px, normal);
      margin-top: 0.1rem;
    }

    .input {
      font-weight: normal;
    }
  }

  .section-role {
    position: relative;

    .wrapper {
      @include position(absolute, $top: 0.25rem, $right: 220px);
      @include textMixin(#212121, 16px, normal);

      label {
        margin-right: 0.1rem;
      }
    }
  }

  .section-reply {
    position: relative;

    .wrapper {
      @include position(absolute, $top: 0.25rem, $right: 0);
      @include textMixin(#212121, 16px, normal);

      label {
        margin-right: 0.1rem;
      }
    }
  }
}
</style>
