import { z } from 'zod'

export const SignupValidation = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters. '
  }),
  userName: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
})
export type TypeSignupValidation = z.infer<typeof SignupValidation>

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
})
export type TypeSigninValidation = z.infer<typeof SignupValidation>

export const PostValidation = z.object({
  caption: z.string().min(5, { message: 'Minium 5 character.' }).max(2200, { message: 'Maximum 2,200 characters' }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: 'This field is requied' }).max(1000, { message: 'Maximum 1000 characters' }),
  tags: z.string()
})
export type TypePostValidation = z.infer<typeof PostValidation>
