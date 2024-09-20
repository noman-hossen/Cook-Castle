<template>
  <div class="favorite-recipes">
    <h2>Your Favorite Recipes</h2>
    <LoadingSpinner v-if="isLoading" />
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="favorites.length === 0">You haven't saved any favorites yet.</div>
    <div v-else class="recipes-grid">
      <RecipeCard v-for="recipe in favorites" :key="recipe.idMeal" :recipe="recipe" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import RecipeCard from './RecipeCard.vue';
import LoadingSpinner from './LoadingSpinner.vue';

const store = useStore();

const favorites = computed(() => store.getters.getFavorites);
const isLoading = computed(() => store.getters.isLoading);
const error = computed(() => store.getters.getError);

onMounted(() => {
  store.dispatch('fetchFavorites');
});
</script>

<style scoped>
.favorite-recipes {
  padding: 20px;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.error-message {
  color: #ff0000;
  text-align: center;
  font-weight: bold;
  margin: 20px 0;
}
</style>