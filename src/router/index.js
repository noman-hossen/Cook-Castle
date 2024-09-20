import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Contact from '../views/Contact.vue';
import RecipeDetails from '../views/RecipeDetails.vue';
import SignUp from '../components/SignUp.vue';
import SignIn from '../components/SignIn.vue';
import FavoriteRecipes from '../components/FavoriteRecipes.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/recipe/:id', name: 'RecipeDetails', component: RecipeDetails },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/favorites', name: 'Favorites', component: FavoriteRecipes },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;