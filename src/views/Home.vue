<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <h1>Discover Delicious Recipes</h1>
        <p>Find your next favorite meal....</p>
        <div class="search-container">
          <SearchBar
            v-model="searchQuery"
            @search="searchRecipes"
          />
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
        </div>
      </div>
    </section>
    <section class="recipes-section">
      <div class="container">
        <h2>{{ searchQuery ? 'Search Results' : 'Popular Recipes' }}</h2>
        <div v-if="isLoading && !displayedRecipes.length">
          <LoadingSpinner />
        </div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="displayedRecipes.length === 0" class="no-results">
          <p>{{ searchQuery ? 'No recipes found. Try a different search term or filters.' : 'No popular recipes available at the moment. Please try again later.' }}</p>
        </div>
        <div v-else class="results-grid">
          <RecipeCard v-for="recipe in displayedRecipes" :key="recipe.idMeal" :recipe="recipe" />
        </div>
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

@media (width < 1188px) {
  .hero p {
    color: hsl(0, 0%, 100%);
    font-weight: bolder;
    -webkit-text-stroke: 1px hsl(117, 46%, 19%);
    font-size: 40pt;
  }
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


@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
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
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
.about-enter-from,
  .about-leave-to
  {
    transform: translateX(-600px);
    opacity: 0;
    scale: .5;
  }
  .about-enter-active{
    transition: all .3s ease-in-out;
  }

</style>