'use client'

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// Importing required modules for setting up React Query context

interface Props {
  children: ReactNode
  // Defining the type for the component's children prop
}

export default function QueryProvider({ children }: Props) {
  const queryClient = new QueryClient()
  // Initializing a new QueryClient instance for React Query
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Wrapping children components in QueryClientProvider */}
    </QueryClientProvider>
  )
}

// Summary: This code defines a `QueryProvider` component that wraps its child components in a `QueryClientProvider`.
// It initializes a React Query client (`QueryClient`) to enable caching and fetching of server-side data in the application.
