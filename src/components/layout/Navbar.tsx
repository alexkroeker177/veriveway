import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { GiftIcon, Menu, UserIcon } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const { error } = await logout()
    if (!error) {
      navigate('/')
    }
  }

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
    const className = isMobile ? 'flex flex-col space-y-4' : 'flex items-center space-x-4'
    
    return (
      <div className={className}>
        {currentUser ? (
          <>
            <Link to="/create-giveaway">
              <Button variant="outline">Create Giveaway</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline">
                <UserIcon className="h-5 w-5" />
              </Button>
            </Link>
            {isMobile && (
              <Button onClick={handleLogout} variant="ghost">
                Logout
              </Button>
            )}
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="default">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    )
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GiftIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">VeriGiveaway</span>
          </Link>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <NavLinks isMobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </div>
        </div>
      </div>
    </nav>
  )
}