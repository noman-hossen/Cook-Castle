<template>
  <nav class="navbar">
    <div class="container">
      <router-link to="/" class="logo">
        <img src="/logo.png" alt="Logo" />
      </router-link>
      <div class="nav-right">
        <div class="user-menu" ref="userMenu">
          <button @click="toggleUserMenu" class="user-icon" aria-label="User menu">
            <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M406.5 399.6C387.4 352.9 341.5 320 288 320l-64 0c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3l64 0c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z"/></svg>
          </button>
          <div v-show="isUserMenuOpen" class="user-dropdown">
            <router-link v-if="!user" to="/signin">Sign In</router-link>
            <router-link v-if="!user" to="/signup">Sign Up</router-link>
            <router-link v-if="user" to="/favorites">Favorites</router-link>
            <a v-if="user" @click="signOut" href="#">Sign Out</a>
          </div>
        </div>
        <div class="menu-icon" @click="toggleMenu" :class="{ 'open': isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <ul class="nav-links" :class="{ 'open': isMenuOpen }">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

const isMenuOpen = ref(false);
const isUserMenuOpen = ref(false);
const user = ref(null);
const router = useRouter();
const userMenu = ref(null);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    router.push('/');
    isUserMenuOpen.value = false;
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

const closeUserMenu = (e) => {
  if (userMenu.value && !userMenu.value.contains(e.target)) {
    isUserMenuOpen.value = false;
  }
};

let unsubscribe;
onMounted(() => {
  unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
  document.addEventListener('click', closeUserMenu);
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
  document.removeEventListener('click', closeUserMenu);
});
</script>

<style scoped>
.navbar {
  background-color: #c3d09a;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  border-bottom: 2px solid #00000049;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  margin-bottom: 50px;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.logo img {
  width: 50px;
  aspect-ratio: 1/1;
  padding: 0;
  margin: 0;
}

.nav-right {
  display: flex;
  align-items: center;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav-links.open{
  margin-bottom: 0;
  padding-bottom: 2px;
}

.nav-links li {
  margin-left: 1rem;
}

.nav-links a {
  color: #49754D;
  padding: 1rem;
  text-decoration: none;
}
.nav-links a.router-link-exact-active{
  color:#ffffff;
  background: #5ea164;
  border-radius: 10px;
}
.user-menu {
  position: relative;
  margin-right: 1rem;
  align-items: center;
  margin-top: 6pt;
  margin-left: auto;
}

.user-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #49754D;
  align-content: center;
  display: block;
}
.user-icon:hover{
  rotate: -10deg;
  scale: 1.1;
  transition:all 300ms ease-in-out
}
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #feeabc;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem 0;
  min-width: 120px;
  z-index: 1000;
}

.user-dropdown a {
  display: block;
  padding: 0.5rem 1rem;
  color: #49754D;
  text-decoration: none;
}

.user-dropdown a:hover {
  background-color: #f0f0f0;
}

.menu-icon {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.menu-icon span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: #49754D;
  margin: 3px 0;
  transition: 0.4s;
}
.menu-icon span:hover {
  scale: 1.1;
  transition:all 300ms ease-in-out
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: #feeabc;
    padding: 1rem 0;
  }

  .nav-links.open {
    display: flex;
    width: fit-content;
  }
  .nav-links li {
    margin: 0.5rem 0;
    width: fit-content;
  }
  .nav-links li a.router-link-exact-active{
  color:#ffffff;
  background: #5ea164;
  width: max-content;
  margin: 0%;
}
  .menu-icon {
    display: flex;
  }

  .menu-icon.open span:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
  }

  .menu-icon.open span:nth-child(2) {
    opacity: 0;
  }

  .menu-icon.open span:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
  }
}
</style>