<template>
  <div class="app-container">
    <header>
      <h1>XYFlow Vue Examples</h1>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/basic">Basic Flow</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// App component is the root component
</script>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  margin-bottom: 20px;
}

nav {
  padding: 10px 0;
}

main {
  height: 600px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
