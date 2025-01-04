'use client'

import { getUserSessionQueryFn } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useAuth = () => {
  const query = useQuery({
    queryKey: ['authUser'],
    queryFn: getUserSessionQueryFn,
    // refetchInterval: 2000,
    staleTime: Infinity,
  })
  return query
}

export default useAuth
