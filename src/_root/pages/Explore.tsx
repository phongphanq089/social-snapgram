/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingElement from '@/components/shared/LoadingElement'
import Icon from '@/components/ui/Icon'
import { TypographyH2 } from '@/components/ui/Typography'
import { Input } from '@/components/ui/input'
import { useInView } from 'react-intersection-observer'
import useDebounce from '@/hooks/useDebounce'
import { useGetPosts, useSearchPosts } from '@/lib/react-query/queries'
import { useEffect, useState } from 'react'
import GridPostList from '@/components/shared/GridPostList'

export type SearchResultProps = {
  isSearchFetching: boolean
  searchedPosts: any
}

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  if (isSearchFetching) {
    return <LoadingElement className='w-[30px] h-[30px]' />
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />
  } else {
    return <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  }
}

const Explore = () => {
  const { ref, inView } = useInView()
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearch = useDebounce(searchValue, 1000)

  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts()

  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch)

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, searchValue])

  const shouldShowSearchResults = searchValue !== ''
  const shouldShowPosts = !shouldShowSearchResults && posts?.pages.every((item) => item?.documents?.length === 0)

  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <TypographyH2>Search Posts</TypographyH2>

        <div className='input-container'>
          <Input
            type='text'
            placeholder='search post...'
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target
              setSearchValue(value)
            }}
          />
          <button className='button'>
            <Icon icon='search' className='w-[20px] h-[20px] stroke-white' />
          </button>
        </div>

        <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
          <h3 className='body-bold md:h3-bold'>Popular Today</h3>

          <div className='flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer'>
            <p className='small-medium md:base-medium text-light-2'>All</p>
            <img src='/assets/icons/filter.svg' width={20} height={20} alt='filter' />
          </div>
        </div>

        <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
          {shouldShowSearchResults ? (
            <SearchResults isSearchFetching={isSearchFetching} searchedPosts={searchedPosts} />
          ) : shouldShowPosts ? (
            <p className='text-light-4 mt-10 text-center w-full'>End of posts</p>
          ) : (
            posts?.pages.map((item, index) => <GridPostList key={`page-${index}`} posts={item?.documents} />)
          )}
        </div>
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className='mt-10'>
          <LoadingElement className='h-[30px] w-[30px]' />
        </div>
      )}
    </div>
  )
}

export default Explore
