<template>
  <div class="recipe-details">
    <loading-spinner v-if="isLoading"/>

    <div v-else class="recipe-card">
    <div class="recipe-image">
      <img :src="recipe.strMealThumb" :alt="recipe.strMeal" />
    </div>
    <div class="recipe-content">
      <div class="recipe-rating">
        <span v-for="i in 5" :key="i" class="star" :class="{ 'empty': i > rating }">★</span>
      </div>
      <h1 class="recipe-title">{{ recipe.strMeal }}</h1>
      <div class="recipe-meta">
        <span class="recipe-servings">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          {{ servings }} servings
        </span>
        <span class="recipe-time">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          {{ prepTime }} minutes
        </span>
      </div>
      <div v-if="tags.length" class="recipe-tags">
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div class="recipe-section">
        <h2>INGREDIENTS</h2>
        <ul class="ingredients-list">
          <li v-for="(ingredient, index) in ingredients" :key="index">
            {{ ingredient.measure }} {{ ingredient.name }}
          </li>
        </ul>
      </div>
      <div class="recipe-section">
        <h2>DIRECTIONS</h2>
        <ol class="directions-list">
          <li v-for="(step, index) in instructions" :key="index">
            {{ step }}
          </li>
        </ol>
      </div>
      <div class="recipe-notes">
        <h2>NOTES</h2>
        <p v-if="recipe.strSource">Source: <a :href="recipe.strSource" target="_blank" rel="noopener noreferrer">{{ recipe.strSource }}</a></p>
        <p v-if="recipe.strYoutube">Video Tutorial: <a :href="recipe.strYoutube" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></p>
        <p v-if="recipe.strCategory">Category: {{ recipe.strCategory }}</p>
        <p v-if="recipe.strArea">Cuisine: {{ recipe.strArea }}</p>
      </div>
      <button v-if="user" @click="toggleFavorite" class="favorite-btn">
        {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
      </button>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { auth, db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { useStore } from 'vuex/dist/vuex.cjs.js';

const route = useRoute();
const store = useStore();
const recipe = ref({});
const rating = ref(4); // Default rating, as the API doesn't provide this
const servings = ref(2); // Default servings, as the API doesn't provide this
const prepTime = ref(15); // Default prep time, as the API doesn't provide this
const user = computed(() => auth.currentUser);
const isFavorite = ref(false);
const isLoading = computed(() => store.getters.isLoading);
const error = ref(null);

const checkIfFavorite = async () => {
  if (user.value && recipe.value.idMeal) {
    const docRef = doc(db, 'favorites', `${user.value.uid}_${recipe.value.idMeal}`);
    const docSnap = await getDoc(docRef);
    isFavorite.value = docSnap.exists();
  }
};

const toggleFavorite = async () => {
  if (user.value && recipe.value.idMeal) {
    const docRef = doc(db, 'favorites', `${user.value.uid}_${recipe.value.idMeal}`);
    try {
      if (isFavorite.value) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          userId: user.value.uid,
          recipe: recipe.value
        });
      }
      isFavorite.value = !isFavorite.value;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      error.value = 'Failed to update favorite. Please try again.';
    }
  }
};

const ingredients = computed(() => {
  if (!recipe.value) return [];
  return Array.from({ length: 20 }, (_, i) => i + 1)
    .map(i => ({
      name: recipe.value[`strIngredient${i}`],
      measure: recipe.value[`strMeasure${i}`]
    }))
    .filter(({ name, measure }) => name && measure);
});

const instructions = computed(() => {
  if (!recipe.value.strInstructions) return [];
  return recipe.value.strInstructions.split('\n').filter(step => step.trim());
});

const tags = computed(() => {
  if (!recipe.value.strTags) return [];
  return recipe.value.strTags.split(',').map(tag => tag.trim());
});

onMounted(async () => {
  store.commit('setLoading', true);
  try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${route.params.id}`);
    recipe.value = response.data.meals[0];
    await checkIfFavorite();
  } catch (err) {
    console.error('Error fetching recipe details:', err);
    error.value = 'Failed to load recipe details. Please try again.';
  } finally {
    store.commit('setLoading', false);
  }
});
</script>

<style scoped>
.recipe-card {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f9f9f9;
  font-family: serif;
  margin-top: 3rem;
}
.recipe-image {
  width: 100%;
  max-height: 400px;
  overflow: hidden;
}
.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin-top: auto;
  margin-left: auto;
}
.recipe-content {
  padding: 40px;
}
.recipe-rating {
  margin-bottom: 10px;
}
.star {
  color: #000;
  font-size: 24px;
}
.star.empty {
  color: #ccc;
}
.recipe-title {
  font-family: 'Brush Script MT', cursive;
  font-size: 48px;
  margin: 0 0 20px;
}
.recipe-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.recipe-servings, .recipe-time {
  display: flex;
  align-items: center;
  gap: 5px;
}
.icon {
  width: 20px;
  height: 20px;
}
.recipe-tags {
  margin-bottom: 20px;
}
.tag {
  display: inline-block;
  background-color: #e0e0e0;
  padding: 5px 10px;
  border-radius: 20px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 14px;
}
.recipe-section {
  margin-bottom: 30px;
}
h2 {
  font-size: 24px;
  margin-bottom: 15px;
  border-bottom: 2px solid #000;
  padding-bottom: 5px;
}
.ingredients-list, .directions-list {
  padding-left: 20px;
}
.ingredients-list li, .directions-list li {
  margin-bottom: 10px;
}
.recipe-notes {
  border: 1px solid #000;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 22pt;
}
.recipe-notes p {
  margin-bottom: 10px;
}
.recipe-notes a {
  color: #f4511e;
  text-decoration: none;
}
.recipe-notes a:hover {
  text-decoration: underline;
}
.favorite-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f4511e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.favorite-btn:hover {
  background-color: #e64a19;
}
@media (min-width: 768px) {
  .recipe-card {
    flex-direction: row;
  }
  .recipe-image {
    flex: 1;
    max-width: 50%;
    margin: none;
  }
  .recipe-content {
    flex: 1;
  }
}

</style>