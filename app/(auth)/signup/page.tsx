'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { ArrowRight, Loader, MailCheckIcon } from 'lucide-react'
import Logo from '@/components/logo'

import { useMutation } from '@tanstack/react-query'
import { registerMutationFn } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
// Importing necessary modules, components, and icons

export default function SignUp() {
  const [isSubmited, setIsSubmitted] = useState(false)
  // State to track if the form has been submitted

  const formSchema = z
    .object({
      // Define a schema for form validation using Zod.
      // The schema specifies the required fields, their data types, and validation rules.

      name: z
        .string() // The 'name' field must be a string.
        .trim() // Automatically remove any leading or trailing whitespace from the input.
        .min(1, {
          // The 'name' field must have at least 1 character to be valid.
          message: 'Name is required', // Custom error message displayed when validation fails.
        }),

      email: z
        .string() // The 'email' field must also be a string.
        .trim() // Automatically removes leading or trailing spaces.
        .email() // Ensures the input is a valid email address.
        .min(1, {
          // Requires at least one character (empty values are invalid).
          message: 'Email is required', // Custom error message if the field is empty.
        }),

      password: z
        .string() // The 'password' field must be a string.
        .trim() // Removes any leading or trailing spaces from the password input.
        .min(6, {
          // Password must have at least one character to be valid.
          message: 'Password of minimum length 6', // Custom error message displayed for an empty password.
        }),
      confirmPassword: z
        .string() // The 'password' field must be a string.
        .min(6, {
          // Password must have at least one character to be valid.
          message: 'Does not match your password', // Custom error message displayed for an empty password.
        }),
    })
    .refine((val) => val.password === val.confirmPassword, {
      message: 'Password does not match',
      path: ['confirmPassword'],
    })
  // This schema is used to define the structure of the form data and enforce validation rules.
  // Zod will validate the inputs against this schema, ensuring they meet the required conditions.

  const form = useForm<z.infer<typeof formSchema>>({
    // Initialize the form using the `useForm` hook from react-hook-form.
    // The type of the form data is inferred directly from the `formSchema`.

    resolver: zodResolver(formSchema),
    // Connects Zod's validation rules to react-hook-form's resolver.
    // This ensures the form fields are validated according to the defined schema.

    defaultValues: {
      // Set default values for the form fields.
      name: '', // Initial value for the 'name' field is an empty string.
      email: '', // Initial value for the 'email' field is an empty string.
      password: '', // Initial value for the 'password' field is an empty string.
      confirmPassword: '',
    },
  })
  // This setup integrates form validation with react-hook-form.
  // When users interact with the form, the inputs are validated based on the schema,
  // and errors are displayed for invalid fields.

  // Initializing react-hook-form with Zod resolver for validation and default values

  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn,
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values, {
      onSuccess: () => {
        setIsSubmitted(true)
      },
      onError: (error) => {
        console.log('error', error)
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      },
    })
  }
  // Placeholder function for handling form submission

  return (
    <>
      <main className='w-full min-h-[590px] h-auto max-w-full pt-10'>
        {!isSubmited ? (
          <section className='w-full  p-5 rounded-md'>
            <div className='flex flex-col items-center'>
              <Logo />
              {/* Displaying the application logo */}

              <h1 className='text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-1.5 mt-8 text-center sm:text-left'>
                Create a Micbol account
              </h1>
              {/* Main heading for the signup form */}

              <p className='mb-6 text-center sm:text-left text-base dark:text-[#f1f7feb5] font-normal'>
                Already have an account?{' '}
                <Link className='text-primary' href='/'>
                  Sign in
                </Link>
                .
              </p>
            </div>
            {/* Informing users with a link to the sign-in page */}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='mb-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='dark:text-[#f1f7feb5] text-sm'>
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Micbol' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Name input field */}

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
                          <Input
                            autoComplete='off'
                            placeholder='micbol@gmail.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Email input field */}

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
                          <Input
                            type='password'
                            placeholder='••••••••••••'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Password input field */}

                <div className='mb-4'>
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='dark:text-[#f1f7feb5] text-sm'>
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='••••••••••••'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* confirm Password input field */}

                <Button
                  className='w-full text-[15px] h-[40px] !bg-blue-500 text-white font-semibold'
                  disabled={isPending}
                  type='submit'
                >
                  {isPending && <Loader className='animate-spin' />}
                  Create account
                  <ArrowRight />
                </Button>
                {/* Submit button for the signup form */}

                <div className='mb-4 mt-4 flex items-center justify-center'>
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
                {/* Separator for alternative signup options */}
              </form>
            </Form>
            <Button variant='outline' className='w-full h-[40px]'>
              Email magic link
            </Button>
            {/* Button for email magic link signup */}

            <p className='text-xs font-normal mt-4'>
              By signing up, you agree to our{' '}
              <a className='text-primary hover:underline' href='#'>
                Terms of Service
              </a>{' '}
              and{' '}
              <a className='text-primary hover:underline' href='#'>
                Privacy Policy
              </a>
              .
            </p>
            {/* Terms and privacy policy notice */}
          </section>
        ) : (
          <div className='w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md'>
            <div className='size-[48px]'>
              <MailCheckIcon size='48px' className='animate-bounce' />
            </div>
            <h2 className='text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold'>
              Check your email
            </h2>
            <p className='mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal'>
              We just sent a verification link to {form.getValues().email}.
            </p>
            <Link href='/'>
              <Button className='h-[40px]'>
                Go to login
                <ArrowRight />
              </Button>
            </Link>
            {/* Displaying success message and redirect option if submission is complete */}
          </div>
        )}
      </main>
    </>
  )
}

// Summary:
// This code defines a signup form using React, Zod for validation, and react-hook-form for form handling. It includes input fields for name, email, and password, with validation messages. Users can submit the form or use a magic link for signup. A success message is shown upon submission.
