import { useUserContext } from '@/components/AuthContext'
import LoadingElement from '@/components/shared/LoadingElement'
import PostStatus from '@/components/shared/PostStatus'
import { Button } from '@/components/ui/button'
import { useGetPostById } from '@/lib/react-query/queries'
import { multiFormatDateString } from '@/lib/utils'
import { Link, useNavigate, useParams } from 'react-router-dom'

const PostDetails = () => {
  const navigate = useNavigate()

  const { id } = useParams()

  const { data: post, isLoading } = useGetPostById(id)

  const { user } = useUserContext()

  return (
    <div className='post_details-container'>
      <div className='hidden md:flex max-w-5xl w-full'>
        <Button onClick={() => navigate(-1)} variant='ghost' className='shad-button_ghost'>
          <img src={'/assets/icons/back.svg'} alt='back' width={24} height={24} />
          <p className='small-medium lg:base-medium'>Back</p>
        </Button>
      </div>
      {isLoading || !post ? (
        <LoadingElement />
      ) : (
        <div className='post_details-card'>
          <img src={post?.imageUrl} alt='creator' className='post_details-img' />
          <div className='post_details-info'>
            <div className='flex-between w-full'>
              <Link to={`/profile/${post?.creator.$id}`} className='flex items-center gap-3'>
                <img
                  src={post?.creator.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt='creator'
                  className='w-8 h-8 lg:w-12 lg:h-12 rounded-full'
                />
                <div className='flex gap-1 flex-col'>
                  <p className='base-medium lg:body-bold text-light-1'>{post?.creator.name}</p>
                  <div className='flex-center gap-2 text-light-3'>
                    <p className='subtle-semibold lg:small-regular '>{multiFormatDateString(post?.$createdAt)}</p>
                    <p className='subtle-semibold lg:small-regular'>{post?.location}</p>
                  </div>
                </div>
              </Link>
              <div className='flex items-center justify-center gap-4'>
                <Link to={`/update-post/${post?.$id}`}>
                  <img src={'/assets/icons/edit.svg'} alt='edit' width={24} height={24} />
                </Link>
              </div>
            </div>
            <hr className='border w-full border-dark-4/80' />

            <div className='flex flex-col flex-1 w-full small-medium lg:base-regular'>
              <p>{post?.caption}</p>
              <ul className='flex gap-1 mt-2'>
                {post?.tags.map((tag: string, index: string) => (
                  <li key={`${tag}${index}`} className='text-light-3 small-regular'>
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className='w-full'>
              <PostStatus post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails
