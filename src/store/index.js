import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    searchResults: [],
    popularRecipes: [],
    categories: [],
    areas: [],
    isLoading: false,
    error: null,
  },
  mutations: {
    setSearchResults(state, results) {
      state.searchResults = results;
    },
    appendSearchResults(state, results) {
      const uniqueResults = results.filter(newRecipe => 
        !state.searchResults.some(existingRecipe => existingRecipe.idMeal === newRecipe.idMeal)
      );
      state.searchResults = [...state.searchResults, ...uniqueResults];
    },
    setPopularRecipes(state, recipes) {
      state.popularRecipes = recipes;
    },
    appendPopularRecipes(state, recipes) {
      const uniqueRecipes = recipes.filter(newRecipe => 
        !state.popularRecipes.some(existingRecipe => existingRecipe.idMeal === newRecipe.idMeal)
      );
      state.popularRecipes = [...state.popularRecipes, ...uniqueRecipes];
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setAreas(state, areas) {
      state.areas = areas;
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setError(state, error) {
      state.error = error;
    },
  },
  actions: {
    async searchRecipes({ commit, state }, { query, category, area, page }) {
      commit('setLoading', true);
      commit('setError', null);
      try {
        let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
        if (category) url += `&c=${category}`;
        if (area) url += `&a=${area}`;
        const response = await axios.get(url);
        const results = response.data.meals || [];
        const startIndex = (page - 1) * 10;
        const endIndex = startIndex + 10;
        const paginatedResults = results.slice(startIndex, endIndex);
        
        if (page === 1) {
          commit('setSearchResults', paginatedResults);
        } else {
          commit('appendSearchResults', paginatedResults);
        }
        
        if (paginatedResults.length === 0 && page === 1) {
          commit('setError', 'No recipes found. Try a different search term or filters.');
        }
      } catch (error) {
        commit('setError', 'An error occurred while searching for recipes.');
        console.error('Error searching recipes:', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async fetchPopularRecipes({ commit, state }, { page }) {
      commit('setLoading', true);
      commit('setError', null);
      try {
        const fetchedRecipes = [];
        const recipesPerPage = 10;
        const maxAttempts = recipesPerPage * 2; // To account for potential duplicates
        let attempts = 0;

        while (fetchedRecipes.length < recipesPerPage && attempts < maxAttempts) {
          const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
          const newRecipe = response.data.meals[0];
          
          if (!state.popularRecipes.some(recipe => recipe.idMeal === newRecipe.idMeal) &&
              !fetchedRecipes.some(recipe => recipe.idMeal === newRecipe.idMeal)) {
            fetchedRecipes.push(newRecipe);
          }
          
          attempts++;
        }

        if (page === 1) {
          commit('setPopularRecipes', fetchedRecipes);
        } else {
          commit('appendPopularRecipes', fetchedRecipes);
        }
        
        if (fetchedRecipes.length === 0 && page === 1) {
          commit('setError', 'No popular recipes available at the moment. Please try again later.');
        }
      } catch (error) {
        commit('setError', 'An error occurred while fetching popular recipes.');
        console.error('Error fetching popular recipes:', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async fetchCategories({ commit }) {
      try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        commit('setCategories', response.data.meals.map(category => category.strCategory));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async fetchAreas({ commit }) {
      try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        commit('setAreas', response.data.meals.map(area => area.strArea));
      } catch (error) {
        console.error('Error fetching areas:', error);
      }
    },
  },
  getters: {
    getSearchResults: state => state.searchResults,
    getPopularRecipes: state => state.popularRecipes,
    getCategories: state => state.categories,
    getAreas: state => state.areas,
    isLoading: state => state.isLoading,
    getError: state => state.error,
  },
});