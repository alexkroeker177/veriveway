import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserIcon } from 'lucide-react'

export default function UserProfilePage() {
  const { currentUser, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserIcon className="w-8 h-8 text-primary" />
            <CardTitle>User Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-lg">{currentUser?.email}</p>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="w-full"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}