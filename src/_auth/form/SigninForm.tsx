import { useUserContext } from '@/components/AuthContext'
import LoadingElement from '@/components/shared/LoadingElement'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSignInAccount } from '@/lib/react-query/queries'
import { SigninValidation, TypeSigninValidation } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const SigninForm = () => {
  const navigate = useNavigate()

  const form = useForm<TypeSigninValidation>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()

  const { mutateAsync: signInAccount, isPending } = useSignInAccount()

  const handleSignin = async (user: TypeSigninValidation) => {
    const session = await signInAccount(user)

    if (!session) {
      toast.error('sign in failed. Please try again.')
      return
    }

    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      form.reset()

      navigate('/')
    } else {
      toast.error('sign in failed. Please try again.')
      return
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-[500px] flex-center flex-col'>
        <img src='/assets/images/logo.svg' alt='logo' />
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>Create a new account</h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>To use snapgram, Please enter your details</p>
        <form className='flex flex-col gap-[30px] w-full mt-4' onSubmit={form.handleSubmit(handleSignin)}>
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
                  <Input type='password' className='shad-input' placeholder='Enter your password...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='buttonStyle'>
            {isPending || isUserLoading ? (
              <div className='flex-center gap-2'>
                {' '}
                <LoadingElement className='w-[30px] h-[30px]' />
              </div>
            ) : (
              'Log in'
            )}
          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
            Don&apos;t have an account?
            <Link to='/sign-up' className='text-primary-500 text-small-semibold ml-1'>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm
