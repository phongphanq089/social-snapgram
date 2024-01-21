import { bottombarLinks } from '@/constants'
import { Link, useLocation } from 'react-router-dom'
import Icon from '../ui/Icon'

const BottomBar = () => {
  const { pathname } = useLocation()
  return (
    <section className='bottom-bar'>
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route
        return (
          <Link key={`bottombar-${link.label}`} to={link.route} className={`bottom-bar-item  ${isActive && 'active'}`}>
            <svg
              className='icon-1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 18.625 18.625'
              height='19.867'
              width='19.867'
            >
              <path d='M0 0v18.625C.459 6.493 7.17.804 18.625 0z' fillRule='evenodd'></path>
            </svg>
            {/* <div className={`bottom-bar-item-active ${isActive && 'active'}`}></div> */}
            <Icon icon={link.icon} height='20px' width='20px' className={`icon-menu`} />
            <p className='tiny-medium text-light-2 lable-text'>{link.label}</p>
            <svg
              className='icon-2'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 18.625 18.625'
              height='19.867'
              width='19.867'
            >
              <path d='M0 0v18.625C.459 6.493 7.17.804 18.625 0z' fillRule='evenodd'></path>
            </svg>
          </Link>
        )
      })}
    </section>
  )
}

export default BottomBar
