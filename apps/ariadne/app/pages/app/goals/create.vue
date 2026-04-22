<script setup lang="ts"></script>

<template>
  <Dialog :open="true" @update:open="useRouter().back()">
    <DialogContent>
      <GoalForm />
    </DialogContent>
  </Dialog>
</template>
