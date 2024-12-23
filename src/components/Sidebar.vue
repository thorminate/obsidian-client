<template>
  <div class="sidebar">
    <img class="sidebar-logo" src="../assets/icon.png" alt="Logo" />
    <ul class="sidebar-list">
      <li
        v-for="(instance, index) in instances"
        :key="index"
        :class="{ active: activeInstance === instance.name }"
        @click="selectInstance(instance.name)"
        class="sidebar-item"
      >
        {{ instance.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Sidebar",
  emits: ["instance-selected"], // Declare the emitted event
  setup(_, { emit }) {
    // Destructure `emit` from the second argument
    const instances = [
      { name: "Cool instance name" },
      { name: "Obsidian" },
      { name: "Instance 3" },
    ];

    instances.forEach((instance) => {
      if (instance.name.length > 20) {
        instance.name = instance.name.slice(0, 15) + "...";
      }
    });

    const activeInstance = ref<string | null>(null);

    const selectInstance = (instanceName: string) => {
      activeInstance.value = instanceName;
      emit("instance-selected", instanceName); // Emit the event correctly
    };

    return {
      instances,
      activeInstance,
      selectInstance,
    };
  },
});
</script>

<style scoped>
.sidebar {
  width: 150px;
  height: calc(100vh - 102px);
  background: #161616;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 20px;
  padding-bottom: 20px;
  border-radius: 50px;
  margin: 15px;
  margin-top: 47px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.301);
}

.sidebar-logo {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 25px;
  margin-bottom: 24px;
  margin-top: 5px;
  transition: 500ms;
}

.sidebar-logo:hover {
  filter: drop-shadow(0 0 16px rgba(33, 11, 73, 0.582));
  transition: 300ms;
}

.sidebar-list {
  width: 80%;
  list-style-type: none;
  padding-left: 15px;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-item {
  padding: 15px;
  width: 75%;
  height: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 20px; /* Rounded corners for items */
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline-width: 1px;
  outline-style: calc(1px solid rgba(255, 255, 255, 0.1));
}

.sidebar-item:hover {
  background-color: #444;
  filter: drop-shadow(0 0 2vh rgba(0, 0, 0, 0.5));
  transition: 300ms;
}

.sidebar-item.active {
  background-color: #1f1f1f;
}

.sidebar-item.active:hover {
  background-color: #424242a8;
}
</style>
