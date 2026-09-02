import { useMutation, type QueryKey } from '@tanstack/vue-query'
import type { ErrorOf, RawRequestArgs, ResponseOf, SchemaEndpoint } from '@tuyau/core/types'
import type { TuyauMutationOptionsOut } from '@tuyau/vue-query'

export const useQueryMutation = <T extends SchemaEndpoint>(
  queryKey: QueryKey,
  mutationOptions: TuyauMutationOptionsOut<RawRequestArgs<T>, ErrorOf<T>, ResponseOf<T>, unknown>,
  {
    paramId = 'id',
    merge = (existing, data) =>
      typeof data === 'object' ? { ...(existing ?? {}), ...data } : data,
  }: {
    paramId?: string
    merge?: (
      existing: ResponseOf<T> extends { data: infer I extends Record<string, any> } ? I : undefined,
      data: {},
      req: RawRequestArgs<T>
    ) => {}
  } = {}
) => {
  // Just updates the query
  const updateQuery: typeof mutationOptions.onSuccess = (data, req, _old, ctx) => {
    if (
      req.params?.[paramId] &&
      Object.keys(req.params || {}).length === 1 &&
      !('body' in req)
    ) /* request is destroy (assumed since only id was passed) */ {
      ctx.client.setQueryData(queryKey, (old) =>
        old && typeof old === 'object' && 'data' in old && Array.isArray(old.data)
          ? { ...old, data: old.data.filter((i) => i.id !== req.params?.[paramId]) }
          : old
      )
    } else if (
      'body' in req ||
      Object.keys(req.params || {}).length >= 1
    ) /* request is either store, update, or anything else that is meant to update */ {
      ctx.client.setQueryData(queryKey, (old) =>
        old && typeof old === 'object' && 'data' in old && Array.isArray(old.data)
          ? {
              ...old,
              data: [
                // Filters out old data,
                // params.id for updating an old item
                // data.id for any other action that returns the new item without sending params.id
                // -1 for updating an optimistically placed NEW item
                ...old.data.filter(
                  (i) =>
                    i.id !==
                    (req.params?.[paramId] ||
                      (data && typeof data === 'object' && 'id' in data ? data.id : -1))
                ),
                // data might be the complete from onSuccess, or part of it via optimistic
                // so for update, we try to merge the old and new since it's being omitted from the filter
                // optimistic update doesn't have real serer `data`, so we use params.id
                merge(
                  old.data.find(
                    (i) => i && typeof i === 'object' && 'id' in i && i.id === req.params?.[paramId]
                  ),
                  data && typeof data === 'object'
                    ? 'data' in data && data.data && typeof data.data === 'object'
                      ? data.data
                      : data
                    : {},
                  req
                ),
              ],
            }
          : old
      )
    }
  }

  return useMutation({
    ...mutationOptions,
    onMutate: async (req, ctx) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await ctx.client.cancelQueries({ queryKey })

      // Snapshot the previous value
      const old = ctx.client.getQueryData(queryKey)

      // Optimistically update to the new value
      // using the same fn as for onSuccess since it does the same thing but with different data
      updateQuery(
        { id: req.params?.[paramId] || -1, ...('body' in req ? req.body : {}) },
        req,
        old,
        ctx
      )

      // Return a result with the snapshotted value
      return old
    },
    // If the mutation suceeds,
    // use the result returned from the server to udpate to the full value
    onSuccess: (...args) => {
      updateQuery(...args)

      mutationOptions.onSuccess?.(...args)
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (...args) => {
      const [_err, _req, old, ctx] = args
      old && ctx.client.setQueryData(queryKey, old)

      mutationOptions.onError?.(...args)
    },
  })
}
