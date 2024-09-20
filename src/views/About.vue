<template>
  <transition name="about" appear>
    <div class="about">
      <div class="container">
        <h1>About Us</h1>
        <p>Welcome to our Recipe App! We're passionate about bringing delicious recipes from around the world to your kitchen. Our mission is to inspire home cooks and make cooking fun and accessible for everyone.</p>
        <p>Whether you're a beginner or an experienced chef, you'll find a wide variety of recipes to suit your taste and skill level. From quick and easy weeknight dinners to impressive dishes for special occasions, we've got you covered.</p>
        <p>Happy cooking!</p>
      </div>
    </div>
  </transition>
</template>
  
  <script setup>
  // No script needed for this component
  </script>
  
  <style scoped>
  .about {
    padding: 3rem 0;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  /* about animation */
  .about-enter-from,
  .about-leave-to
  {
    transform: translate(-30px);
    opacity: 0;
  }
  .about-enter-active{
    transition: all 0.5s ease-in-out;
  }
  </style>