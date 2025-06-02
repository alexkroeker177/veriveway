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
  creator: {
    email: string
  }
}

export default function HomePage() {
  const [activeGiveaways, setActiveGiveaways] = useState<Giveaway[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchActiveGiveaways() {
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
            creator:creator_id(email)
          `)
          .eq('status', 'published')
          .gt('end_time', new Date().toISOString())
          .order('end_time', { ascending: true })

        if (fetchError) throw fetchError

        setActiveGiveaways(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch giveaways')
      } finally {
        setLoading(false)
      }
    }

    fetchActiveGiveaways()
  }, [])

  const formatEndTime = (dateString: string) => {
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
      <h1 className="text-3xl font-bold text-center mb-8">Active Giveaways</h1>

      {loading ? (
        <div className="text-center text-gray-600">
          Loading active giveaways...
        </div>
      ) : error ? (
        <div className="text-center text-red-600">
          Error fetching giveaways: {error}
        </div>
      ) : activeGiveaways.length === 0 ? (
        <div className="text-center text-gray-600">
          No active giveaways right now. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {activeGiveaways.map((giveaway) => (
            <Card key={giveaway.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl line-clamp-2">
                  {giveaway.title}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Created by: {giveaway.creator?.email}
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  {truncateText(giveaway.prize_details, 100)}
                </p>
                <p className="text-sm text-gray-500">
                  Ends: {formatEndTime(giveaway.end_time)}
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