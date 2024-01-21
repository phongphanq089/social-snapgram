import { cn } from '@/lib/utils'

const LoadingElement = ({ className }: { className?: string }) => {
  return (
    <div className={cn('dot-spinner', className)}>
      <div className='dot-spinner__dot'></div>
      <div className='dot-spinner__dot'></div>
      <div className='dot-spinner__dot'></div>
      <div className='dot-spinner__dot'></div>
      <div className='dot-spinner__dot'></div>
      <div className='dot-spinner__dot'></div>
      <div className='dot-spinner__dot'></div>
      <div className='dot-spinner__dot'></div>
    </div>
  )
}

export default LoadingElement
