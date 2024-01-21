import { Route, Routes } from 'react-router-dom'
import AuthLayout from './_auth/AuthLayout'
import SigninForm from './_auth/form/SigninForm'
import RootLayout from './_root/RootLayout'
import SignUpForm from './_auth/form/SignupForm'
import Home from './_root/pages/Home'
import CreatePost from './_root/pages/CreatePost'
import Explore from './_root/pages/Explore'
import Saved from './_root/pages/Saved'
import Allusers from './_root/pages/AllUsers'
import { Toaster } from 'sonner'
import PostDetails from './_root/pages/PostDetails'

function App() {
  return (
    <main className='flex h-screen'>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignUpForm />} />
        </Route>
        <Route element={<RootLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/all-users' element={<Allusers />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/saved' element={<Saved />} />
          <Route path='/posts/:id' element={<PostDetails />} />
        </Route>
      </Routes>
      <Toaster position='top-center' richColors />
    </main>
  )
}

export default App
