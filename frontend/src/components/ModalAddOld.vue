<template>
  <div class="modal">
    <div class="dialog">
      <div class="header">
        <div>Add old line</div>
        <button class="btn-close" @click="$emit('close')">
          <img src="../assets/close.png" alt="" />
        </button>
      </div>

      <div class="container">
        <template v-if="recordIds.length > 0">
          <p>Pick one:</p>

          <div class="lines">
            <div
              v-for="recordId in recordIds"
              :key="recordId"
              :class="['line', { selected: selectedId === recordId }]"
              @click="selectedId = recordId"
            >
              <span>{{ allRecords[recordId].role }}:</span>
              <span>{{ allRecords[recordId].text }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="empty">It's empty here, bro!</div>
        </template>
      </div>

      <div class="footer">
        <a-button type="primary" @click="$emit('confirm', selectedId)">
          Confirm
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    recordId: { type: String, required: true },
    allRecords: { type: Object, required: true },
  },

  setup(props) {
    const selectedId = ref<string>("-1");

    const recordIds = computed(() => {
      return Object.keys(props.allRecords).filter(
        (recordId) => recordId !== props.recordId && recordId !== "-1"
      );
    });

    return {
      recordIds,
      selectedId,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal {
  @include position(fixed, 0, 0, 0, 0, $z-index: 3);
  @include flexCenter(row);

  background: rgba(0, 0, 0, 0.65);
  font-size: 0.36rem;

  .dialog {
    @include sizeWH(720px, 500px);
    border-radius: 0.03rem;
    background: #fff;
    position: relative;

    .header {
      @include sizeWH(100%, 60px);
      @include textMixin(#262626, 22px, bold);
      border-bottom: #e8e8e8 solid 0.01rem;
      padding: 0.1rem 0.2rem;
    }

    .btn-close {
      @include position(absolute, $top: 0.1rem, $right: 0.15rem);
      @include sizeWH(0.25rem, 0.25rem);
      background: none;

      img {
        @include sizeWH(100%, 100%);
      }
    }

    .container {
      @include flexCenter(column);
      align-items: flex-start;
      padding: 0.1rem 0.3rem;

      p {
        @include textMixin(#212121, 18px, normal);
      }

      .empty {
        @include textMixin(#212121, 18px, normal);
      }

      .lines {
        @include flexCenter(column);
        @include sizeWH(100%, 320px);
        align-items: flex-start;
        justify-content: flex-start;
        overflow-y: auto;

        .line {
          @include textMixin(#212121, 16px, normal);
          @include sizeWH(100%, auto);
          border: #ededed solid 0.01rem;
          margin-bottom: 5px;
          padding: 2px 5px;

          &.selected {
            background: #e6f7ff;
          }

          span:first-child {
            font-weight: bold;
            margin-right: 5px;
            text-transform: capitalize;
          }
        }
      }
    }

    .footer {
      @include position(absolute, $bottom: 0.1rem, $right: 0.3rem);
      button {
        margin-left: 0.1rem;
      }
    }
  }
}
</style>
