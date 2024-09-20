<template>
  <div id="app">
    <Navbar />
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/Navbar.vue';

const store = useStore();

let unsubscribe;
onMounted(() => {
  unsubscribe = onAuthStateChanged(auth, (user) => {
    store.dispatch('setUser', user);
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>

<style>
@font-face {
  font-family: 'afc';
  src: url(../src/assets/Affogato-Medium.otf);
}
@font-face {
  font-family: 'bglo';
  src: url(./assets/Boogaloo-Regular.ttf);
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }
}
</style>