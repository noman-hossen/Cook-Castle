<template>
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section fade-in">
            <h3>About Cook Castle</h3>
            <p>Discover delicious recipes and culinary inspiration at Cook Castle. Our mission is to make cooking fun and accessible for everyone.</p>
          </div>
          <div class="footer-section fade-in">
            <h3>Quick Links</h3>
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/about">About</router-link></li>
              <li><router-link to="/contact">Contact</router-link></li>
              <li><router-link to="/privacy">Privacy Policy</router-link></li>
            </ul>
          </div>
          <div class="footer-section fade-in">
            <h3>Connect With Us</h3>
            <div class="social-icons">
              <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
              <a href="#" aria-label="Pinterest"><i class="fab fa-pinterest"></i></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom slide-in-left">
          <p>&copy; {{ currentYear }} Cook Castle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const currentYear = ref(new Date().getFullYear())
  
  onMounted(() => {
    // You can add any necessary initialization logic here
  })
  </script>
  
  <style scoped>
  .footer {
    background-color: #2d3748;
    color: #fff;
    padding: 3rem 0 1rem;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
  
  .footer-section {
    flex: 1;
    margin-bottom: 1rem;
    min-width: 200px;
    padding: 0 1rem;
  }
  
  .footer-section h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  .footer-section ul {
    list-style-type: none;
    padding: 0;
  }
  
  .footer-section ul li {
    margin-bottom: 0.5rem;
  }
  
  .footer-section a {
    color: #cbd5e0;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer-section a:hover {
    color: #fff;
  }
  
  .social-icons {
    display: flex;
    gap: 1rem;
  }
  
  .social-icons a {
    color: #cbd5e0;
    font-size: 1.5rem;
    transition: color 0.3s ease;
  }
  
  .social-icons a:hover {
    color: #fff;
  }
  
  .footer-bottom {
    border-top: 1px solid #4a5568;
    padding-top: 1rem;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
    }
  
    .footer-section {
      margin-bottom: 2rem;
    }
  }
  
  /* Animations */
  .fade-in {
    animation: fadeIn 1s ease-out;
  }
  
  .slide-in-left {
    animation: slideInFromLeft 1s ease-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideInFromLeft {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  </style>