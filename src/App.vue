<template>
  <div class="app">
    <Sidebar />
    <div class="main-content">
      <!-- Content that changes based on selected instance -->
      <h1 class="title">Welcome to the App</h1>
      <p class="title-content">This content will change based on the selected instance.</p>
    </div>
  </div>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sidebar from './components/Sidebar.vue';

export default defineComponent({
  name: 'App',
  components: {
    Sidebar,
  },
});
</script>

<style scoped>
.app {
  height: calc(100vh - 194px); /* Ensure full screen height */
  width: calc(100vw - 548px);
  margin-left: 150px;
  justify-self: left;
}

.main-content {
  flex-grow: 2;
  padding: 20px;
  background-color: #161616;
  transition: margin-left 0.3s;
  border-radius: 50px;
  height: 90vh;
  width: 100vw;
  overflow: hidden; /* Ensure no scrollbars */
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
