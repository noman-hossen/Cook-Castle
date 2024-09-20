<template>
    <div class="loading-spinner">
      <div class="spinner">
        <img src="../assets/pot.gif" alt="">
      </div>
      <p>Loading recipes...</p>
    </div>
  </template>
  
  <script setup>
  // No script needed for this component
  </script>
  
  <style scoped>
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: auto;
    margin-bottom: auto;
  }
  
  .loading-spinner img{
    height: 3rem;
    aspect-ratio: 1/1;
  }
  
  p {
    color: #49754D;
    font-weight: bold;
    font-size: x-large;
  }
  </style>