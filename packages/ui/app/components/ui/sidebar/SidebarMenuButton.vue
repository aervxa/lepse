<script setup lang="ts">
import type { Component } from 'vue'
import type { SidebarMenuButtonProps } from './SidebarMenuButtonChild.vue'
import { createReusableTemplate, reactiveOmit } from '@vueuse/core'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import SidebarMenuButtonChild from './SidebarMenuButtonChild.vue'
import { useSidebar } from './utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<
    SidebarMenuButtonProps & {
      tooltip?: string | Component
      closeMobileOnClick?: boolean
    }
  >(),
  {
    as: 'button',
    variant: 'default',
    size: 'default',
  }
)

const { isMobile, state, setOpenMobile } = useSidebar()

const delegatedProps = reactiveOmit(props, 'tooltip', 'closeMobileOnClick')

const [DefineButton, ReuseButton] = createReusableTemplate()
</script>

<template>
  <DefineButton>
    <SidebarMenuButtonChild
      v-bind="{ ...delegatedProps, ...$attrs }"
      @click="closeMobileOnClick && isMobile && setOpenMobile(false)"
    >
      <slot />
    </SidebarMenuButtonChild>
  </DefineButton>

  <ReuseButton v-if="!tooltip" />

  <Tooltip v-else>
    <TooltipTrigger as-child>
      <ReuseButton />
    </TooltipTrigger>
    <TooltipContent side="right" align="center" :hidden="state !== 'collapsed' || isMobile">
      <template v-if="typeof tooltip === 'string'">
        {{ tooltip }}
      </template>
      <component :is="tooltip" v-else />
    </TooltipContent>
  </Tooltip>
</template>
