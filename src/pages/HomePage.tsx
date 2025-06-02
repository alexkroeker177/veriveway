import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Giveaway = {
  id: string
  title: string
  prize_details: string
  end_time: string
  start_time: string
  status: string
  creator_id: string
}

export default function HomePage() {
  const [publicGiveaways, setPublicGiveaways] = useState<Giveaway[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPublicGiveaways() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('giveaways')
          .select(`
            id, 
            title, 
            prize_details, 
            end_time,
            start_time,
            status,
            creator_id
          `)
          .in('status', ['published', 'active'])
          .gt('end_time', new Date().toISOString())
          .order('end_time', { ascending: true })

        if (fetchError) throw fetchError

        setPublicGiveaways(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch giveaways')
      } finally {
        setLoading(false)
      }
    }

    fetchPublicGiveaways()
  }, [])

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Available Giveaways</h1>

      {loading ? (
        <div className="text-center text-gray-600">
          Loading giveaways...
        </div>
      ) : error ? (
        <div className="text-center text-red-600">
          Error fetching giveaways: {error}
        </div>
      ) : publicGiveaways.length === 0 ? (
        <div className="text-center text-gray-600">
          No giveaways available right now. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {publicGiveaways.map((giveaway) => (
            <Card key={giveaway.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl line-clamp-2">
                  {giveaway.title}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Created by: {giveaway.creator_id}
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  {truncateText(giveaway.prize_details, 100)}
                </p>
                {giveaway.status === 'published' ? (
                  <p className="text-sm text-gray-500">
                    Starts: {formatDateTime(giveaway.start_time)}
                  </p>
                ) : null}
                <p className="text-sm text-gray-500">
                  Ends: {formatDateTime(giveaway.end_time)}
                </p>
              </CardContent>
              <CardFooter>
                <Link to={`/giveaway/${giveaway.id}`} className="w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}