import type UserTransformer from '#transformers/user_transformer'

export type PublicUser = Awaited<ReturnType<UserTransformer['toPublic']>>
