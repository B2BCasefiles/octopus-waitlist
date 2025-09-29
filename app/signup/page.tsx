import { Suspense } from 'react'
import SignUpForm from './SignUpForm'

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-black-purple p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpForm />
      </Suspense>
    </div>
  )
}