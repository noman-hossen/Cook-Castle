<template>
  <transition appear name="card" mode="out-in">
    <div class="recipe-card" >
    <img :src="recipe.strMealThumb" :alt="recipe.strMeal" />
    <div class="recipe-content">
      <h3 :title="recipe.strMeal">{{ recipe.strMeal }}</h3>
      <hr>
      <p :title="'Category: ' + recipe.strCategory">Category: {{ recipe.strCategory }}</p>
      <router-link :to="'/recipe/' + recipe.idMeal" class="btn">View Recipe</router-link>
    </div>
  </div>
  </transition>
</template>

<script setup>

defineProps({
  recipe: {
    type: Object,
    required: true,
  }
});

</script>

<style scoped>
@font-face {
  font-family: 'head';
  src: url(/rcp/src/assets/fonnts.com-Owners_Medium.otf);
}
.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.recipe-card {
  background: linear-gradient(90deg, rgba(19,226,185,1) 0%, rgba(147,223,173,0.9204133064516129) 16%, rgba(248,255,174,1) 100%);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-radius: 20px 20px 10px 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.recipe-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recipe-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1rem;
}

.recipe-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-family: 'head', 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  height: 3em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

hr {
  width: 90%;
  margin: 0.5rem auto;
  opacity: 0.35;
}

.recipe-card p {
  color: #666;
  margin-top: auto;
  margin-bottom: 1rem;
  height: 1.5em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.recipe-card .btn {
  display: inline-block;
  text-align: center;
  background-color: #E8B86D;
  color: #fff;
  padding: 0.5rem;
  text-decoration: none;
  transition: all .2s ease;
  border-radius:5px ;
  width: 100%;
  margin-top: auto;
  align-content: end;

}

.recipe-card .btn:hover {
  background-color: #508D4E;
}

/* card-animation */
.card-enter-from,
.card-leave-to{
  scale: 0%;
  opacity: 0;
  -webkit-transform-origin-y:0;
}

.card-enter-active{
  transition: all .3s ease-in-out;
}
</style>