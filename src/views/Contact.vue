<template>
    <div class="contact">
      <div class="container">
        <h1>Contact Us</h1>
        <form @submit.prevent="submitForm" class="contact-form">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" required>
          </div>
          <div class="form-group">
            <label for="message">Message:</label>
            <textarea id="message" v-model="message" required></textarea>
          </div>
          <button type="submit" class="btn">Send Message</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const name = ref('');
  const email = ref('');
  const message = ref('');
  
  const submitForm = () => {
    // Here you would typically send the form data to a server
    console.log('Form submitted:', { name: name.value, email: email.value, message: message.value });
    // Reset form fields
    name.value = '';
    email.value = '';
    message.value = '';
    alert('Thank you for your message. We will get back to you soon!');
  };
  </script>
  
  <style scoped>
  .contact {
    padding: 3rem 0;
    align-items: center;
    margin: auto;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
  
  .contact-form {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  textarea {
    height: 150px;
  }
  
  .btn {
    background-color: #f4511e;
    color: #fff;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn:hover {
    background-color: #e64a19;
  }
  </style>