<template>
  <div class="main-board">
    <h1 class="title">Story:</h1>
    <div class="section-story">
      <button class="btn-add" v-if="!isAdding" @click="toggleAdd">Add</button>
      <template v-else>
        <button class="btn-cancel" @click="toggleAdd">Cancel</button>
        <input type="text" @keyup.enter="enterText" v-model="textVal" />
      </template>

      <div class="last">Last: {{ lastLine }}</div>
      <table class="normal" v-if="selectedReply === 'normal'">
        <tr>
          <th>Content</th>
          <th>Role</th>
        </tr>
        <template v-if="!isEmpty(currentLine)">
          <tr @click="moveForward(currentLine.id)">
            <td>{{ currentLine.text }}</td>
            <td>{{ currentLine.role }}</td>
          </tr>
        </template>
      </table>
      <table class="decision" v-else>
        <tr>
          <th>Option (A,B,C)</th>
          <th>Role</th>
        </tr>
      </table>
    </div>

    <div class="section-role">
      <label for="role">Pick role:</label>
      <select name="role" id="role" v-model="selectedRole">
        <option value="girl">Girl</option>
        <option value="jenny">Jenny</option>
        <option value="boy">Boy</option>
      </select>
    </div>

    <div class="section-reply">
      <label for="reply">Reply:</label>
      <select name="reply" id="reply" v-model="selectedReply">
        <option value="normal">Normal</option>
        <option value="decision">Decision</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive } from "vue";
import { nanoid } from "nanoid";
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
const roles = ["girl", "jenny", "boy"];
const isAdding = ref<boolean>(false);
const textVal = ref<string>("");
const selectedRole = ref<string>("girl");
const selectedReply = ref<string>("normal");
const index = ref<string>("-1");

const lastLine = computed(() => {
  const prevId = index.value;
  return records[prevId].text;
});

const indexAft = computed(() => {
  return records[index.value].next;
});

const currentLine = computed(() => {
  if (indexAft.value) {
    return records[indexAft.value];
  }
  return {};
});

const toggleAdd = () => {
  isAdding.value = !isAdding.value;
};

const moveForward = (nodeId: string) => {
  index.value = nodeId;
};

const enterText = () => {
  const nowId = nanoid();
  const prevId = index.value;

  records[prevId] = {
    ...records[prevId],
    next: nowId,
  };
  records[nowId] = {
    id: nowId,
    role: selectedRole.value,
    text: textVal.value,
    prev: prevId,
    next: null,
    options: [],
  };

  textVal.value = "";
  isAdding.value = !isAdding.value;
};
</script>

<style lang="scss" scoped>
.main-board {
  @include sizeWH(100%, 100%);
  padding: 0.1rem 1rem;
  position: relative;
  text-align: left;

  .title {
    @include textMixin(#212121, 0.4rem, bold);
    margin-bottom: 0.1rem;
  }

  .section-story {
    @include flexCenter(column);
    align-items: flex-start;

    .btn-add {
      @include textMixin(#fff, 0.19rem, normal);
      border-radius: 0.05rem;
      padding: 0.08rem 0.15rem;
      background: #1976d2;
      margin-bottom: 0.1rem;
    }

    .btn-cancel {
      @include textMixin(#1976d2, 0.19rem, normal);
      background: #fff;
      border-radius: 0.05rem;
      padding: 0.08rem 0.15rem;
      border: #1976d2 solid 0.01rem;
      margin-bottom: 0.1rem;
    }

    input {
      @include sizeWH(80%, 0.4rem);
      @include textMixin(#212121, 0.19rem, normal);
      padding-left: 0.1rem;
      margin-bottom: 0.2rem;
    }

    table {
      @include textMixin(#212121, 0.2rem, normal);
      margin-top: 0.1rem;

      th {
        font-weight: bold;
      }

      td,
      th {
        border: #000 solid 0.01rem;
        height: 0.35rem;
        padding-left: 0.05rem;

        &:first-child {
          width: 9.6rem;
        }
        &:nth-child(2) {
          width: 1rem;
        }
      }
    }

    .last {
      @include textMixin(#000, 0.2rem, normal);
      margin-top: 0.1rem;
    }
  }

  .section-role {
    @include position(absolute, $top: 0.25rem, $left: 7.7rem);
    @include textMixin(#212121, 0.21rem, normal);

    label {
      margin-right: 0.1rem;
    }
  }

  .section-reply {
    @include position(absolute, $top: 0.25rem, $left: 9.9rem);
    @include textMixin(#212121, 0.21rem, normal);

    label {
      margin-right: 0.1rem;
    }
  }
}
</style>
