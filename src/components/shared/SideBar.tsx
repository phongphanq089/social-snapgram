import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import LoadingElement from './LoadingElement'
import { INITIAL_USER, useUserContext } from '../AuthContext'
import { sidebarLinks } from '@/constants'
import { INavLink } from '@/types'
import Icon from '../ui/Icon'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queries'

const SideBar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext()
  const { mutate: signOut } = useSignOutAccount()

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    signOut()
    setIsAuthenticated(false)
    setUser(INITIAL_USER)
    navigate('/sign-in')
  }

  return (
    <nav className='leftsidebar '>
      <div className='flex flex-col gap-4 mb-5'>
        <Link to='/' className='flex gap-3 items-center'>
          <img src='/assets/images/logo.svg' alt='logo' width={170} height={36} />
        </Link>

        {isLoading || !user.email ? (
          <div className='h-14'>
            <LoadingElement className='h-[30px] w-[30px]' />
          </div>
        ) : (
          <Link to={`/profile/${user.id}`} className='flex gap-3 items-center'>
            <img
              src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt='profile'
              className='h-14 w-14 rounded-full'
            />
            <div className='flex flex-col'>
              <p className='body-bold'>{user.name}</p>
              <p className='small-regular text-light-3'>@{user.username}</p>
            </div>
          </Link>
        )}
      </div>
      <div className='flex flex-col gap-11 py-5 pr-5 leftSidebar-content overflow-auto'>
        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route

            return (
              <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                <NavLink to={link.route} className='flex gap-4 items-center p-4'>
                  <Icon
                    icon={link.iconSvg}
                    height='20px'
                    width='20px'
                    className={` ${isActive ? '' : 'stroke-primary-500'}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
      <Button
        variant='ghost'
        className='shad-button_ghost flex gap-5 items-center justify-start w-auto mt-auto'
        onClick={(e) => handleSignOut(e)}
      >
        <img src='/assets/icons/logout.svg' alt='logout' />
        <p className='text-xl'>Logout</p>
      </Button>
    </nav>
  )
}

export default SideBar
