import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { SignupValidation, TypeSignupValidation } from '@/lib/validation'
import { Link, useNavigate } from 'react-router-dom'
import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queries'
import { useUserContext } from '@/components/AuthContext'
import LoadingElement from '@/components/shared/LoadingElement'
import { toast } from 'sonner'

const SignUpForm = () => {
  const navigate = useNavigate()

  const form = useForm<TypeSignupValidation>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      userName: '',
      email: '',
      password: ''
    }
  })
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()

  const { mutateAsync: createUserAccount, isPending: isCreatingAccound } = useCreateUserAccount()

  const { mutateAsync: signInAccount, isPending: isSigningInUser } = useSignInAccount()

  async function handleSignup(user: TypeSignupValidation) {
    try {
      const newUser = await createUserAccount(user)
      if (!newUser) {
        toast.error('Sign up failed. Please try again.')

        return
      } else {
        toast.success('Sign up success fullled')
      }
      const session = await signInAccount({
        email: user.email,
        password: user.password
      })

      console.log(session, 'session sign up')

      if (!session) {
        toast.error('Something went wrong. Please login your new account')
        navigate('/sign-in')
        return
      }

      const isLoggedIn = await checkAuthUser()

      if (isLoggedIn) {
        form.reset()

        navigate('/')
      } else {
        toast.error('Login failed. Please try again.')
        return
      }
    } catch (error) {
      console.log(error, 'handleSignup error')
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-[500px] flex-center flex-col'>
        <img src='/assets/images/logo.svg' alt='logo' />
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>Create a new account</h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>To use snapgram, Please enter your details</p>
        <form onSubmit={form.handleSubmit(handleSignup)} className='flex flex-col gap-[30px] w-full mt-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='text' className='shad-input' placeholder='Enter your name...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='userName'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='text' className='shad-input' placeholder='Enter your userName...' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='email' className='shad-input' placeholder='Enter your email...' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='text' className='shad-input' placeholder='Enter your password...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='buttonStyle'>
            {isUserLoading || isSigningInUser || isCreatingAccound ? (
              <LoadingElement className='w-[30px] h-[30px]' />
            ) : (
              'Sign Up'
            )}
          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
            Already have an account?
            <Link to='/sign-in' className='text-primary-500 text-small-semibold ml-1'>
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignUpForm
