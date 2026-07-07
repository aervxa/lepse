<script setup lang="ts"></script>

<template>
  <ImageCropDialog v-slot="{ open }">
    <Button @click="open">Upload</Button>
  </ImageCropDialog>
</template>
