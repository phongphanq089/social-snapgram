import AvatarUser from '@/components/shared/AvatarUser'
import LoadingElement from '@/components/shared/LoadingElement'
import PostCard from '@/components/shared/PostCard'
import UserCard from '@/components/shared/UserCard'
import { TypographyH2, TypographyH3 } from '@/components/ui/Typography'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useGetRecentPosts, useGetUserCreator, useGetUsers } from '@/lib/react-query/queries'
import { Models } from 'appwrite'

const Home = () => {
  const { data: posts, isLoading: isPostLoading, isError: isErrorPosts } = useGetRecentPosts()

  const { data: users } = useGetUsers()

  const { data: creators } = useGetUserCreator(10)

  const dataListUsers = users?.pages.map((item) => {
    const users = item?.documents.map((item) => item)
    return users
  })

  if (isErrorPosts) {
    return (
      <div className='flex flex-1'>
        <div className='home-container'>
          <p className='body-medium text-light-1'>Something bad happened</p>
        </div>
        <div className='home-creators'>
          <p className='body-medium text-light-1'>Something bad happened</p>
        </div>
      </div>
    )
  }
  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div>
          <Carousel className='w-full max-w-sm'>
            <CarouselContent className='-ml-1'>
              {dataListUsers &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dataListUsers[0]?.map((item: any, index: any) => {
                  return (
                    <CarouselItem key={index} className='pl-1 md:basis-1/2 lg:basis-1/4'>
                      <div className='p-1'>
                        <AvatarUser user={item?.creator} />
                      </div>
                    </CarouselItem>
                  )
                })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className='home-posts'>
          <div>
            <TypographyH2>Home Feed</TypographyH2>
          </div>
          {isPostLoading && !posts ? (
            <LoadingElement className='h-[40px] w-[40px]' />
          ) : (
            <ul className='flex flex-col flex-1 gap-9 w-full '>
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className='flex justify-center w-full'>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className='home-creators'>
        <TypographyH3>Top Creators</TypographyH3>
        {isPostLoading && !creators ? (
          <LoadingElement className='w-[30px] h-[30px]' />
        ) : (
          <div className='grid grid-cols-1  gap-2'>
            {creators?.documents.map((creator, index) => {
              return (
                <div key={`${index} - ${index + 1}`}>
                  <UserCard
                    users={creator}
                    $id={''}
                    $collectionId={''}
                    $databaseId={''}
                    $createdAt={''}
                    $updatedAt={''}
                    $permissions={[]}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
