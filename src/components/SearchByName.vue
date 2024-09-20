<template>
    <div class="search-by-name">
      <h2>Search Recipes by Name</h2>
      <form @submit.prevent="searchRecipes">
        <input v-model="searchQuery" type="text" placeholder="Enter recipe name" required />
        <button type="submit" class="btn">Search</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const searchQuery = ref('');
  
  const searchRecipes = () => {
    router.push({ name: 'SearchResults', query: { q: searchQuery.value } });
  };
  </script>
  
  <style scoped>
  .search-by-name {
    margin-bottom: 2rem;
  }
  
  form {
    display: flex;
    gap: 1rem;
  }
  
  input {
    flex-grow: 1;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .btn {
    background-color: #f4511e;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .btn:hover {
    background-color: #e64a19;
  }
  
  @media (max-width: 768px) {
    form {
      flex-direction: column;
    }
  }
  </style>