'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ArrowRight, Loader } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
im { z } from 'zod'
import Link from 'next/link'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Logo from '@/components/logo'
import { loginMutationFn } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

// Component for the Login page.
export default function Login() {
  const router = useRouter() // Get Next.js router instance for navigation.

  const { mutate, isPending } = useMutation({
    // Initialize a mutation for the login API.
    mutationFn: loginMutationFn, // Function to perform the login API request.
  })

  // Define a schema for form validation using Zod.
  const formSchema = z.object({
    email: z
      .string() // The 'email' field must be a string.
      .trim() // Removes extra whitespace around the input.
      .email() // Validates that the input is a valid email format.
      .min(1, {
        // Ensures the 'email' field is not empty.
        message: 'Email is required', // Custom error message.
      }),
    password: z
      .string() // The 'password' field must be a string.
      .trim() // Removes extra whitespace.
      .min(6, {
        // Ensures the 'password' field is not empty.
        message: 'Password of minimum length 6 is required', // Custom error message.
      }),
  })
  // This schema validates user inputs for email and password when they attempt to log in.
  // If any of the inputs do not meet the criteria, an error is returned with the specified messages.

  const form = useForm<z.infer<typeof formSchema>>({
    // Initialize the form with validation rules and default values.
    resolver: zodResolver(formSchema), // Connect Zod schema to the form.
    defaultValues: {
      email: '', // Default value for the 'email' field.
      password: '', // Default value for the 'password' field.
    },
  })
  // This setup integrates form validation logic with the form state, ensuring real-time feedback for users.

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Function to handle form submission.

    mutate(values, {
      // Call the login API with the form values (email and password).
      onSuccess: (response) => {
        // Handle success response from the API.
        if (response.data.mfaRequired) {
          // If Multi-Factor Authentication (MFA) is required:
          router.replace(`/verify-mfa?email=${values.email}`)
          // Redirect user to MFA verification page with their email.
          return
        }
        router.replace(`/home`)
        // If MFA is not required, redirect to the home page.
      },
      onError: (error) => {
        // Handle error response from the API.
        toast({
          title: 'Error', // Title of the error toast.
          description: error.message, // Error message from the server.
          variant: 'destructive', // Destructive style to indicate an error.
        })
      },
    })
  }
  // The `onSubmit` function manages the login process, handling both success and error cases.

  return (
    <main className='w-full min-h-[590px] h-auto max-w-full pt-10'>
      {/* Main container for the login page */}
      <div className='w-full h-full p-5 rounded-md'>
        <Logo />
        {/* Display the application logo */}

        <h1 className='text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-1.5 mt-8 text-center sm:text-left'>
          Log in to Micbol
        </h1>
        {/* Page title */}

        <p className='mb-8 text-center sm:text-left text-base dark:text-[#f1f7feb5] font-normal'>
          Don't have an account?{' '}
          <Link className='text-primary' href='/signup'>
            Sign up
          </Link>
          .
        </p>
        {/* Subtitle with a link to the signup page */}

        <Form {...form}>
          {/* Form wrapper */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Email field */}
            <div className='mb-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='dark:text-[#f1f7feb5] text-sm'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='micbol@channel.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password field */}
            <div className='mb-4'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='dark:text-[#f1f7feb5] text-sm'>
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='•••••••' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Forgot password link */}
            <div className='mb-4 flex w-full items-center justify-end'>
              <Link
                className='text-sm dark:text-white'
                href={`/forgot-password?email=${form.getValues().email}`}
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit button */}
            <Button
              className='w-full text-[15px] h-[40px] text-white font-semibold'
              disabled={isPending} // Disable button if request is pending.
              type='submit'
            >
              {isPending && <Loader className='animate-spin' />}
              {/* Show loader icon if request is in progress */}
              Sign in
              <ArrowRight />
            </Button>

            {/* Separator for alternative login methods */}
            <div className='mb-6 mt-6 flex items-center justify-center'>
              <div
                aria-hidden='true'
                className='h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]'
                data-orientation='horizontal'
                role='separator'
              ></div>
              <span className='mx-4 text-xs dark:text-[#f1f7feb5] font-normal'>
                OR
              </span>
              <div
                aria-hidden='true'
                className='h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]'
                data-orientation='horizontal'
                role='separator'
              ></div>
            </div>
          </form>
        </Form>

        {/* Alternative login method button */}
        <Button variant='outline' className='w-full h-[40px]'>
          Email magic link
        </Button>

        {/* Terms of service and privacy policy */}
        <p className='text-xs dark:text-slate- font-normal mt-7'>
          By signing in, you agree to our{' '}
          <a className='text-primary hover:underline' href='#'>
            Terms of Service
          </a>{' '}
          and{' '}
          <a className='text-primary hover:underline' href='#'>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  )
}

// Summary:
// This code defines a `Login` component using React, React Hook Form, Zod for validation, and React Query for handling the login process.
// It includes input fields for email and password with validation messages.
// Upon form submission, it attempts to log in the user, handling cases where multi-factor authentication is required or displaying error messages.
// The UI includes links for signing up, resetting the password, and alternative login methods like an email magic link.
// The component ensures a responsive and user-friendly login experience with real-time validation and feedback.
