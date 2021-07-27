<template>
  <div class="modal">
    <div class="dialog">
      <div class="header">
        <div>Edit text</div>
        <button class="btn-close" @click="$emit('close')">
          <img src="../assets/close.png" alt="" />
        </button>
      </div>

      <div class="container">
        <p>Enter updated text</p>
        <a-input
          class="input"
          placeholder="Enter"
          v-model:value="record.text"
          @keyup.enter="$emit('close')"
        />
      </div>

      <div class="footer">
        <a-button type="primary" @click="$emit('close')">Confirm</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    record: { type: Object, required: true },
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
    @include sizeWH(700px, 220px);
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

      input {
        font-weight: normal;
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
