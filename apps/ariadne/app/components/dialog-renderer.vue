<script setup>
import { activeDialog, closeDialog } from '~/lib/dialog'
</script>

<template>
  <AlertDialog v-if="activeDialog" open>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ activeDialog.title ?? 'Are you sure?' }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ activeDialog.description ?? 'This action cannot be undone.' }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="closeDialog(false)">
          {{ activeDialog.cancel ?? 'Cancel' }}
        </AlertDialogCancel>
        <AlertDialogAction variant="destructive" @click="closeDialog(true)">
          {{ activeDialog.action ?? 'Continue' }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
