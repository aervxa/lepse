<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <Dialog :open="true" @update:open="useRouter().back()">
    <DialogContent>
      <GoalForm :goal-id="Number(route.params.id)" />
    </DialogContent>
  </Dialog>
</template>
