import type { Data } from '@lepse/clotho/data'

export const useScribbles = () => {
  const { $clotho } = useNuxtApp()
  const scribbles = useState<Data.Scribble[]>('scribbles', () => [])

  const fetchScribbles = async () => {
    const [payload, error] = await $clotho.api.scribbles.index({}).safe()
    if (payload) {
      scribbles.value = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  if (scribbles.value.length === 0) {
    fetchScribbles()
  }

  const createScribble = async (
    body: Parameters<typeof $clotho.api.scribbles.store>['0']['body']
  ) => {
    const [payload, error] = await $clotho.api.scribbles.store({ body }).safe()
    if (payload) {
      scribbles.value.push(payload.data)
    } else {
      console.error(error)
      return error
    }
  }

  const updateScribble = async (
    id: number,
    body: Parameters<typeof $clotho.api.scribbles.update>['0']['body']
  ) => {
    const [payload, error] = await $clotho.api.scribbles.update({ params: { id }, body }).safe()
    if (payload) {
      const index = scribbles.value.findIndex((s) => s.id === id)
      if (index !== -1) scribbles.value[index] = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  const destroyScribble = async (id: number) => {
    const [, error] = await $clotho.api.scribbles.destroy({ params: { id } }).safe()
    if (error) {
      console.error(error)
      return error
    }
    scribbles.value = scribbles.value.filter((scribble) => scribble.id !== id)
  }

  return { scribbles, fetchScribbles, createScribble, updateScribble, destroyScribble }
}
