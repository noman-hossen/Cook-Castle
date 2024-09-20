<template>
  <div class="search-results">
    <div class="container">
      <h1>Search Results</h1>
      <div v-if="searchResults.length === 0" class="no-results">
        <p>No recipes found. Try a different search term or ingredient.</p>
      </div>
      <div v-else class="results-grid">
        <RecipeCard v-for="recipe in searchResults" :key="recipe.idMeal" :recipe="recipe" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import RecipeCard from '../components/RecipeCard.vue';

const store = useStore();
const route = useRoute();
const searchResults = ref([]);

const performSearch = async () => {
  const query = route.query.q;
  const ingredient = route.query.ingredient;

  if (query) {
    await store.dispatch('searchRecipesByName', query);
  } else if (ingredient) {
    await store.dispatch('searchRecipesByIngredient', ingredient);
  }

  searchResults.value = store.getters.getSearchResults;
};

onMounted(performSearch);

watch(() => route.query, performSearch);
</script>

<style scoped>
.search-results {
  padding: 2rem 0;
}

h1 {
  margin-bottom: 2rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>