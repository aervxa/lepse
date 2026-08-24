<script setup lang="ts">
import { LogOut } from '@lucide/vue'

const { user, logoutMutation } = useAuth()

const isEmailVisible = ref(false)
</script>

<template>
  <div class="flex flex-col">
    <p class="mb-2 font-mono text-[10px] font-medium tracking-widest uppercase opacity-80">Info</p>
    <Item size="xs" class="px-0">
      <ItemContent>
        <ItemTitle> Email </ItemTitle>
      </ItemContent>
      <ItemActions>
        <div class="flex items-center gap-1">
          <p>
            {{
              isEmailVisible
                ? user?.email
                : user?.email.replace(/^[^@]+/, (m) => '*'.repeat(m.length))
            }}
          </p>
          <Button variant="link" size="xs" class="px-1" @click="isEmailVisible = !isEmailVisible">
            {{ isEmailVisible ? 'Hide' : 'Reveal' }}
          </Button>
        </div>
        <Button variant="outline" disabled>Edit</Button>
      </ItemActions>
    </Item>
  </div>

  <Separator class="-my-4" />

  <Item size="xs" class="px-0">
    <ItemContent>
      <ItemTitle>Logout of your account</ItemTitle>
      <ItemDescription>End your session, you can always login later.</ItemDescription>
    </ItemContent>
    <ItemActions>
      <LoadingButton
        variant="destructive"
        size="sm"
        class="self-start"
        :action="
          () =>
            dialog({
              title: 'Are you sure you want to logout?',
              description: 'This will end this session and return you to the login page.',
              action: 'Logout',
            }).then((value) => {
              if (value === true) {
                return logoutMutation.mutateAsync({})
              }
            })
        "
      >
        <LogOut />
        Log Out
      </LoadingButton>
    </ItemActions>
  </Item>
</template>
