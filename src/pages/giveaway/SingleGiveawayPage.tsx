import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

type Giveaway = {
  id: string
  title: string
  description: string
  prize_details: string
  start_time: string
  end_time: string
  num_winners: number
  status: string
}

export default function SingleGiveawayPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [giveaway, setGiveaway] = useState<Giveaway | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGiveaway() {
      if (!id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "The giveaway you're searching for does not exist",
        })
        navigate('/', { replace: true })
        return
      }

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('giveaways')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            toast({
              variant: "destructive",
              title: "Not Found",
              description: "The giveaway you're searching for does not exist",
            })
            navigate('/', { replace: true })
            return
          }
          
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load giveaway details",
          })
          navigate('/', { replace: true })
          return
        }

        setGiveaway(data)
      } finally {
        setLoading(false)
      }
    }

    fetchGiveaway()
  }, [id, navigate])

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
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'ended_awaiting_draw':
        return 'bg-yellow-100 text-yellow-800'
      case 'drawn':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center text-gray-600">
          Loading giveaway details...
        </div>
      </div>
    )
  }

  if (!giveaway) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap gap-4 items-start justify-between">
            <CardTitle className="text-2xl sm:text-3xl">{giveaway.title}</CardTitle>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                giveaway.status
              )}`}
            >
              {giveaway.status.replace(/_/g, ' ')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{giveaway.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Prize Details</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{giveaway.prize_details}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-600">Start Time</h3>
              <p>{formatDateTime(giveaway.start_time)}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600">End Time</h3>
              <p>{formatDateTime(giveaway.end_time)}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-600">Number of Winners</h3>
            <p>{giveaway.num_winners}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}