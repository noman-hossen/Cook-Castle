<template>
  <div class="search-bar">
    <form @submit.prevent="submitSearch" class="search-form">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Enter a recipe name"
      class="search-input"
      @input="debouncedGetSuggestionsAndResults"
      @keydown.down.prevent="navigateItems(1)"
      @keydown.up.prevent="navigateItems(-1)"
      @blur="handleBlur"
    />
    <button type="submit" class="search-button" aria-label="Search">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="icon"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
     </button>
   </form>
      <ul v-if="showResults" class="results-list">
        <li v-if="suggestions.length > 0">
          <ul>
            <li
              v-for="(suggestion, index) in suggestions"
              :key="'suggestion-' + suggestion.idMeal"
              @click="selectItem(suggestion)"
              :class="{ active: index === activeItemIndex && activeSection === 'suggestions' }"
            >
              {{ suggestion.strMeal }}
            </li>
          </ul>
        </li>
        <li v-if="searchResults.length > 0">
          <ul>
            <li
              v-for="(result, index) in searchResults"
              :key="'result-' + result.idMeal"
              @click="selectItem(result)"
              :class="{ active: index === activeItemIndex && activeSection === 'results' }"
            >
              {{ result.strMeal }}
            </li>
          </ul>
        </li>
        <li v-if="suggestions.length === 0 && searchResults.length === 0">
          No results found
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    modelValue: String,
  });
  
  const emit = defineEmits(['update:modelValue', 'search']);
  
  const searchQuery = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });
  
  const suggestions = ref([]);
  const searchResults = ref([]);
  const showResults = ref(false);
  const activeItemIndex = ref(-1);
  const activeSection = ref('');
  
  let debounceTimer;
  
  const debouncedGetSuggestionsAndResults = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(getSuggestionsAndResults, 300);
  };
  
  const getSuggestionsAndResults = async () => {
    if (searchQuery.value.length < 2) {
      suggestions.value = [];
      searchResults.value = [];
      showResults.value = false;
      return;
    }
  
    try {
      const [suggestionsResponse, resultsResponse] = await Promise.all([
        axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery.value}`),
        axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchQuery.value}`)
      ]);
  
      suggestions.value = suggestionsResponse.data.meals || [];
      searchResults.value = resultsResponse.data.meals || [];
      showResults.value = suggestions.value.length > 0 || searchResults.value.length > 0;
      activeItemIndex.value = -1;
      activeSection.value = '';
    } catch (error) {
      console.error('Error fetching suggestions and results:', error);
      suggestions.value = [];
      searchResults.value = [];
      showResults.value = false;
    }
  };
  
  const navigateItems = (direction) => {
    if (!showResults.value) return;
  
    if (activeSection.value === '') {
      activeSection.value = suggestions.value.length > 0 ? 'suggestions' : 'results';
    }
  
    if (activeSection.value === 'suggestions') {
      activeItemIndex.value += direction;
      if (activeItemIndex.value < 0) {
        activeSection.value = 'results';
        activeItemIndex.value = searchResults.value.length - 1;
      } else if (activeItemIndex.value >= suggestions.value.length) {
        activeSection.value = 'results';
        activeItemIndex.value = 0;
      }
    } else {
      activeItemIndex.value += direction;
      if (activeItemIndex.value < 0) {
        activeSection.value = 'suggestions';
        activeItemIndex.value = suggestions.value.length - 1;
      } else if (activeItemIndex.value >= searchResults.value.length) {
        activeSection.value = 'suggestions';
        activeItemIndex.value = 0;
      }
    }
  };
  
  const selectItem = (item) => {
    if (item && typeof item === 'object') {
      searchQuery.value = item.strMeal;
    } else if (activeItemIndex.value !== -1) {
      const selectedItem = activeSection.value === 'suggestions'
        ? suggestions.value[activeItemIndex.value]
        : searchResults.value[activeItemIndex.value];
      searchQuery.value = selectedItem.strMeal;
    }
    submitSearch();
  };
  
  const submitSearch = () => {
    emit('search', searchQuery.value);
    showResults.value = false;
  };
  
  const handleBlur = () => {
    setTimeout(() => {
      showResults.value = false;
    }, 200);
  };
  
  onMounted(() => {
    document.addEventListener('click', handleBlur);
  });
  
  onUnmounted(() => {
    document.removeEventListener('click', handleBlur);
    clearTimeout(debounceTimer);
  });
  </script>
  
  <style scoped>
  .search-bar {
    position: relative;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
  
  form {
    display: flex;
    align-items: center;
  }
  
.search-form {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 0;
}

.search-input {
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 10px 0 0 10px;
  width: 300px;
  outline: none;
  transition: border-color 0.3s ease;
  margin-left: 0;
}

.search-input:focus {
  border-color: #999263;
}
.search-button {
  background-color: #c0ba85;
  border: none;
  padding: 9px;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}
.search-button:hover {
  background-color: #999263;
}
.icon {
  width: 24px;
  height: 24px;
  stroke: white;
}
  .results-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: rgba(248, 224, 224, 0.911);
    color: black;
    border: 1px solid #ccc;
    border-top: none;
    list-style-type: none;
    margin: 0;
    padding: 0;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    width: 80%;
  }
  
  .results-list > li {
    padding: 10px;
  }
  
  .results-list > li > ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  .results-list > li > ul > li {
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .results-list > li > ul > li:hover,
  .results-list > li > ul > li.active {
    background-color: #f0f0f0;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  </style>