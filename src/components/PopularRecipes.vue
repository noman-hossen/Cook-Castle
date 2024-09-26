<template>
  <div class="popular-recipes-grid" >
    <RecipeCard v-for="recipe in popularRecipes" :key="recipe.idMeal" :recipe="recipe" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import RecipeCard from './RecipeCard.vue';

const store = useStore();
const popularRecipes = ref([]);

onMounted(async () => {
  await store.dispatch('fetchPopularRecipes');
  popularRecipes.value = store.state.popularRecipes;
});
</script>

<style scoped>
.popular-recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));;
  gap: 2rem;
}

@media (max-width: 768px) {
  .popular-recipes-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}
</style>