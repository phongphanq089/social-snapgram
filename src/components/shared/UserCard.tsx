import { Models } from 'appwrite'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { TypographySmall } from '../ui/Typography'
import { Button } from '../ui/button'

const UserCard = ({ users }: Models.Document) => {
  console.log(users)
  return (
    <div className=' p-4 flex flex-row justify-between items-center gap-4'>
      <div>
        <Avatar>
          <AvatarImage src={users.imageUrl || '/assets/icons/profile-placeholder.svg'} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <TypographySmall>{users.name}</TypographySmall>
        <p className='small-regular text-light-3 text-center line-clamp-1'>@{users.username}</p>
      </div>
      <Button variant={'ghost'} className='bg-primary-500'>
        Fllow
      </Button>
    </div>
  )
}

export default UserCard
