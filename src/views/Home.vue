<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <transition appear name="fade-in-down">
          <h1>Discover Delicious Recipes</h1>
        </transition>
        <transition appear name="fade-in-up">
          <p>Find your next favorite meal....</p>
        </transition>
        <div class="search-container">
          <transition appear name="fade-in-left">
            <SearchBar
              v-model="searchQuery"
              @search="searchRecipes"
            />
          </transition>
          <transition appear name="fade-in-right">
            <div class="filters">
              <select v-model="selectedCategory" @change="searchRecipes">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <select v-model="selectedArea" @change="searchRecipes">
                <option value="">All Areas</option>
                <option v-for="area in areas" :key="area" :value="area">
                  {{ area }}
                </option>
              </select>
            </div>
          </transition>
        </div>
      </div>
    </section>
    <section class="recipes-section slide-in-right">
      <div class="container">
        <h2>{{ searchQuery ? 'Search Results' : 'Popular Recipes' }}</h2>
        <div v-if="isLoading && !displayedRecipes.length">
          <LoadingSpinner />
        </div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="displayedRecipes.length === 0" class="no-results">
          <p>{{ searchQuery ? 'No recipes found. Try a different search term or filters.' : 'No popular recipes available at the moment. Please try again later.' }}</p>
        </div>
        <transition-group name="recipe-list" tag="div" class="results-grid">
          <RecipeCard v-for="recipe in displayedRecipes" :key="recipe.idMeal" :recipe="recipe" />
        </transition-group>
        <div v-if="isLoading && displayedRecipes.length" class="loading-more">
          <LoadingSpinner />
        </div>
        <div ref="infiniteScrollTrigger" class="infinite-scroll-trigger"></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import RecipeCard from '../components/RecipeCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import SearchBar from '../components/SearchBar.vue';

const store = useStore();
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedArea = ref('');
const page = ref(1);
const infiniteScrollTrigger = ref(null);

const searchResults = computed(() => store.getters.getSearchResults);
const popularRecipes = computed(() => store.getters.getPopularRecipes);
const categories = computed(() => store.getters.getCategories);
const areas = computed(() => store.getters.getAreas);
const isLoading = computed(() => store.getters.isLoading);
const error = computed(() => store.getters.getError);

const displayedRecipes = computed(() => {
  return searchQuery.value ? searchResults.value : popularRecipes.value;
});

const searchRecipes = () => {
  page.value = 1;
  store.dispatch('searchRecipes', {
    query: searchQuery.value,
    category: selectedCategory.value,
    area: selectedArea.value,
    page: page.value
  });
};

const loadMoreRecipes = () => {
  if (!isLoading.value) {
    page.value++;
    if (searchQuery.value) {
      store.dispatch('searchRecipes', {
        query: searchQuery.value,
        category: selectedCategory.value,
        area: selectedArea.value,
        page: page.value
      });
    } else {
      store.dispatch('fetchPopularRecipes', { page: page.value });
    }
  }
};

const setupInfiniteScroll = () => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMoreRecipes();
    }
  }, options);

  if (infiniteScrollTrigger.value) {
    observer.observe(infiniteScrollTrigger.value);
  }
};

onMounted(async () => {
  await store.dispatch('fetchCategories');
  await store.dispatch('fetchAreas');
  await store.dispatch('fetchPopularRecipes', { page: page.value });
  setupInfiniteScroll();
});

watch([searchQuery, selectedCategory, selectedArea], () => {
  searchRecipes();
});
</script>

<style scoped>
.hero {
  background-image: url('../assets/hero-image.jpg');
  background-size: cover;
  background-position: center;
  height: 60vh;
  display: flex;
  align-items: center;
  text-align: center;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  animation: fadeIn 1s ease-out;
}

.hero .container {
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 6rem;
  margin-bottom: 1rem;
  font-family: 'afc', 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-family: 'bglo', 'Gill Sans', 'Gill Sans MT', 'Trebuchet MS', sans-serif;
  letter-spacing: 1.25pt;
  color: rgb(222, 236, 171);
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  flex-direction: column;
  align-items: center;
  margin: auto;
  max-width: fit-content;
}

.filters {
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  margin-top: .4rem;
}

select {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease;
}

select:hover {
  background-color: #f0f0f0;
}

.recipes-section {
  padding: 3rem 0;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  justify-content: center;
}

.no-results, .error-message {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 2rem;
}

.loading-more {
  text-align: center;
  margin-top: 2rem;
}

.infinite-scroll-trigger {
  height: 20px;
  margin-top: 2rem;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInFromLeft {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInFromRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInFromTop {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInFromBottom {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.fade-in-down-enter-active, .fade-in-down-leave-active,
.fade-in-up-enter-active, .fade-in-up-leave-active,
.fade-in-left-enter-active, .fade-in-left-leave-active,
.fade-in-right-enter-active, .fade-in-right-leave-active {
  transition: all 0.5s ease-out;
}

.fade-in-down-enter-from, .fade-in-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.fade-in-up-enter-from, .fade-in-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.fade-in-left-enter-from, .fade-in-left-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.fade-in-right-enter-from, .fade-in-right-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.recipe-list-enter-active,
.recipe-list-leave-active {
  transition: all 0.5s ease;
}

.recipe-list-enter-from,
.recipe-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@media (width < 1188px) {
  .hero p {
    color: hsl(0, 0%, 100%);
    font-weight: bolder;
    -webkit-text-stroke: 1px hsl(117, 46%, 19%);
    font-size: 40pt;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 20pt;
    color: #ffffff;
    -webkit-text-stroke: #25251d 0.1px;
    font-weight: 800;
  }

  .search-container {
    width: 90%;
    margin: 0 auto;
  }

  .filters {
    flex-direction: row;
    width: 100%;
  }

  select {
    width: 100%;
  }

  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>