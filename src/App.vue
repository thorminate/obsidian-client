<template>
  <div class="app">
    <Sidebar @instance-selected="updateSelectedInstance" />
    <div class="main-content">
      <InstanceViewer
        v-if="selectedInstance"
        :instanceName="selectedInstance"
      />
      <div v-else>Instance not selected</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Sidebar from "./components/Sidebar.vue";
import InstanceViewer from "./components/InstanceViewer.vue";

export default defineComponent({
  name: "App",
  components: {
    Sidebar,
    InstanceViewer,
  },
  setup() {
    const selectedInstance = ref<string | null>(null);

    const updateSelectedInstance = (instanceName: string) => {
      selectedInstance.value = instanceName;
    };

    return {
      selectedInstance,
      updateSelectedInstance,
    };
  },
});
</script>

<style scoped>
.app {
  height: calc(100vh - 106x); /* Ensure full screen height */
  width: calc(100vw - 250px);
  margin-left: 175px;
  margin-top: 16px;
  text-align: center;
}

.main-content {
  flex-grow: 2;
  padding: 20px;
  background-color: #161616;
  transition: margin-left 0.3s;
  border-radius: 50px;
  height: calc(100vh - 106px);
  width: calc(100vw - 250px);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.301);
}

.title {
  color: #383838;
  font-size: 24px;
  margin-bottom: 10px;
}

.title-content {
  font-size: 16px;
  color: #666;
}
</style>
