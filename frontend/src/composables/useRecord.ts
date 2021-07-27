import { reactive, ref } from "vue";

const selectedRole = ref<string>("girl");
const selectedReply = ref<string>("normal");
const selectedEmo = ref<string>("happy");
const selectedRecord = ref<Record<string, any>>({});

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

export default function useRecord() {
  return {
    records,
    selectedRole,
    selectedRecord,
    selectedReply,
    selectedEmo,
  };
}
