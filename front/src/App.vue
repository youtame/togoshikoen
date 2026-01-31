<template>
  <v-app>
    <v-app-bar color="primary" title="Vuetify Test" />

    <v-main>
      <v-container class="mt-6">
        <v-card class="pa-4" max-width="400">
          <v-card-title>Vuetify works</v-card-title>

          <v-card-text>
            Vuetify が正しく適用されています
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" variant="flat">
              Test Button
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
</script>