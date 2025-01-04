'use client' // Indicates that this is a client-side React component

import React, { useCallback } from 'react'
import SessionItem from './SessionItem' // Component for rendering individual session details
import { useMutation, useQuery } from '@tanstack/react-query' // Hooks for fetching and mutating data
import { sessionDelMutationFn, sessionsQueryFn } from '@/lib/api' // API functions for fetching sessions and deleting a session
import { Loader } from 'lucide-react' // Loader component for showing a spinner during data fetching
import { toast } from '@/hooks/use-toast' // Toast notifications for user feedback

// Main component for managing and displaying user sessions
const Sessions = () => {
  // Query to fetch session data from the server
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sessions'], // Key to uniquely identify this query
    queryFn: sessionsQueryFn, // Function to fetch session data
    staleTime: Infinity, // Prevent refetching until explicitly triggered
  })

  // Mutation to delete a session
  const { mutate, isPending } = useMutation({
    mutationFn: sessionDelMutationFn, // Function to delete a session by ID
  })

  // Destructure session data or default to an empty array
  const sessions = data?.sessions || []

  // Identify the current session and other active sessions
  const currentSession = sessions?.find((session) => session.isCurrent) // Current active session
  const otherSessions = sessions?.filter((session) => !session.isCurrent) // All other sessions except the current one

  // Callback to handle session deletion
  const handleDelete = useCallback(
    (id: string) => {
      mutate(id, {
        onSuccess: () => {
          // Refetch sessions after successful deletion
          refetch()
          // Show a success toast notification
          toast({
            title: 'Success',
            description: 'Session removed successfully',
          })
        },
        onError: (error) => {
          // Show an error toast notification on failure
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          })
        },
      })
    },
    [mutate, refetch]
  )

  // Component rendering
  return (
    <div className='via-root to-root rounded-xl bg-gradient-to-r p-0.5'>
      <div className='rounded-[10px] p-6'>
        {/* Title and description for the sessions page */}
        <h3 className='text-xl tracking-[-0.16px] text-slate-12 font-bold mb-1'>
          Sessions
        </h3>
        <p className='mb-6 max-w-xl text-sm text-[#0007149f] dark:text-gray-100 font-normal'>
          Sessions are the devices you are using or that have used your Micbol.
          These are the sessions where your account is currently logged in. You
          can log out of each session.
        </p>

        {/* Show a loader while fetching data */}
        {isLoading ? (
          <Loader size='35px' className='animate-spin' />
        ) : (
          <div className='rounded-t-xl max-w-xl'>
            {/* Display the current active session */}
            <div>
              <h5 className='text-base font-semibold'>
                Current active session
              </h5>
              <p className='mb-6 text-sm text-[#0007149f] dark:text-gray-100'>
                You’re logged into this Squeezy account on this device and are
                currently using it.
              </p>
            </div>
            <div className='w-full'>
              {currentSession && (
                <div className='w-full py-2 border-b pb-5'>
                  {/* Render details of the current session */}
                  <SessionItem
                    userAgent={currentSession.userAgent}
                    date={currentSession.createdAt}
                    expiresAt={currentSession.expiresAt}
                    isCurrent={currentSession.isCurrent}
                  />
                </div>
              )}

              {/* Display other active sessions */}
              <div className='mt-4'>
                <h5 className='text-base font-semibold'>Other sessions</h5>
                <ul className='mt-4 w-full space-y-3 max-h-[400px] overflow-y-auto'>
                  {otherSessions?.map((session) => (
                    <li key={session._id}>
                      {/* Render each session with a delete handler */}
                      <SessionItem
                        loading={isPending}
                        userAgent={session.userAgent}
                        date={session.createdAt}
                        expiresAt={session.expiresAt}
                        onRemove={() => handleDelete(session._id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sessions // Export the component for use in other parts of the app

// Summary of the Code
// This component, Sessions, manages and displays information about user sessions for an account. It uses React Query to fetch session data and handle deletion of sessions, while maintaining a clear separation of active (current) and other sessions. A SessionItem component is used to render individual session details, with options to remove a session.

// Key Features:
// Fetches session data from an API.
// Displays the current active session and other sessions in separate sections.
// Allows the user to delete a session, which refetches the updated session list.
// Shows a loading spinner while data is being fetched.
// Provides user feedback through toast notifications for successful or failed operations.
