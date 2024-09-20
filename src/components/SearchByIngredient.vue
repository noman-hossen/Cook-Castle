<template>
    <div class="search-by-ingredient">
      <h2>Search Recipes by Ingredient</h2>
      <form @submit.prevent="searchRecipes">
        <input v-model="ingredient" type="text" placeholder="Enter ingredient" required />
        <button type="submit" class="btn">Search</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const ingredient = ref('');
  
  const searchRecipes = () => {
    router.push({ name: 'SearchResults', query: { ingredient: ingredient.value } });
  };
  </script>
  
  <style scoped>
  .search-by-ingredient {
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