import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { TypographySmall } from '../ui/Typography'

const AvatarUser = ({ user }: { user: { imageUrl: string; name: string } }) => {
  return (
    <div className='flex flex-col items-center gap-2'>
      <Avatar className='w-[80px] h-[80px]'>
        <AvatarImage src={user.imageUrl} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <TypographySmall>{user.name}</TypographySmall>
    </div>
  )
}

export default AvatarUser
