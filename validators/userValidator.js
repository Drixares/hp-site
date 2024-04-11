import vine from '@vinejs/vine';

export const storeUserValidator = vine.object({
  email: vine.string().email(),
  name: vine.string(),
  password: vine
    .string()
    .minLength(4)
    .maxLength(32)
})

export const loginValidator = vine.object({
  email: vine.string().email(),
  password: vine.string().minLength(4)
})
