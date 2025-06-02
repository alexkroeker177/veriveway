import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MailIcon } from 'lucide-react'

export default function CheckEmailPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6">
          <MailIcon className="h-12 w-12 mx-auto text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for signing up! Please check your email for a confirmation link to complete your registration. Once confirmed, you can log in to your account.
        </p>

        <div className="space-y-4">
          <Link to="/login">
            <Button variant="outline" className="w-full">
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}