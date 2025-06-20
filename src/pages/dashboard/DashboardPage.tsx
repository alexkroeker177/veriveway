import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MoreHorizontal } from 'lucide-react'

type Giveaway = {
  id: string
  title: string
  status: string
  start_time: string
  end_time: string
  num_winners: number
}

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const [giveaways, setGiveaways] = useState<Giveaway[]>([])
  const [loadingGiveaways, setLoadingGiveaways] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGiveaways() {
      if (!currentUser) return

      try {
        setLoadingGiveaways(true)
        setFetchError(null)

        const { data, error } = await supabase
          .from('giveaways')
          .select('*')
          .eq('creator_id', currentUser.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        setGiveaways(data)
      } catch (error) {
        setFetchError(error instanceof Error ? error.message : 'Failed to fetch giveaways')
      } finally {
        setLoadingGiveaways(false)
      }
    }

    fetchGiveaways()
  }, [currentUser])

  const handleUpdateStatus = async (giveawayId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('giveaways')
        .update({ status: newStatus })
        .eq('id', giveawayId)
        .eq('creator_id', currentUser?.id)

      if (error) throw error

      // Update local state
      setGiveaways(prevGiveaways =>
        prevGiveaways.map(giveaway =>
          giveaway.id === giveawayId
            ? { ...giveaway, status: newStatus }
            : giveaway
        )
      )

      toast({
        title: "Status Updated",
        description: `Giveaway status changed to ${newStatus}.`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive"
      })
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'published':
        return 'bg-yellow-100 text-yellow-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'ended_awaiting_draw':
        return 'bg-yellow-100 text-yellow-800'
      case 'ended':
        return 'bg-red-100 text-red-800'
      case 'drawn':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Creator Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Welcome back, {currentUser?.email}!
            </p>
          </div>
          <Link to="/create-giveaway">
            <Button>Create New Giveaway</Button>
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold">My Giveaways</h2>

          {loadingGiveaways ? (
            <div className="text-center py-8 text-gray-600">
              Loading giveaways...
            </div>
          ) : fetchError ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              Error fetching giveaways: {fetchError}
            </div>
          ) : giveaways.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                You haven't created any giveaways yet.
              </p>
              <Link to="/create-giveaway">
                <Button>Create Your First Giveaway</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>A list of your giveaways</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[180px]">Start Time</TableHead>
                    <TableHead className="min-w-[180px]">End Time</TableHead>
                    <TableHead className="text-right min-w-[100px]">Winners</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {giveaways.map((giveaway) => (
                    <TableRow key={giveaway.id}>
                      <TableCell className="font-medium">
                        <div className="line-clamp-2">{giveaway.title}</div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            giveaway.status
                          )}`}
                        >
                          {giveaway.status.replace(/_/g, ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDateTime(giveaway.start_time)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDateTime(giveaway.end_time)}
                      </TableCell>
                      <TableCell className="text-right">
                        {giveaway.num_winners}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/giveaway/${giveaway.id}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                          
                          {giveaway.status === 'ended' ? (
                            <Link to={`/dashboard/giveaway/${giveaway.id}/manage`}>
                              <Button variant="default" size="sm">
                                Manage Winners
                              </Button>
                            </Link>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {giveaway.status === 'draft' && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateStatus(giveaway.id, 'published')}
                                    >
                                      Publish (Upcoming)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateStatus(giveaway.id, 'active')}
                                    >
                                      Make Active (Joinable)
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {giveaway.status === 'published' && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateStatus(giveaway.id, 'active')}
                                    >
                                      Make Active (Joinable)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateStatus(giveaway.id, 'ended')}
                                    >
                                      End Giveaway
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {giveaway.status === 'active' && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(giveaway.id, 'ended')}
                                  >
                                    End Giveaway
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}