import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function CreateGiveawayPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prize_details: '',
    start_time: '',
    end_time: '',
    num_winners: 1
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'num_winners' ? parseInt(value) || 1 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) {
      setSubmitError('You must be logged in to create a giveaway.')
      return
    }

    // Client-side validation
    if (!formData.title.trim()) {
      setSubmitError('Title is required.')
      return
    }

    if (!formData.description.trim()) {
      setSubmitError('Description is required.')
      return
    }

    if (!formData.prize_details.trim()) {
      setSubmitError('Prize details are required.')
      return
    }

    if (!formData.start_time || !formData.end_time) {
      setSubmitError('Start time and end time are required.')
      return
    }

    const startDate = new Date(formData.start_time)
    const endDate = new Date(formData.end_time)

    if (endDate <= startDate) {
      setSubmitError('End time must be after start time.')
      return
    }

    if (formData.num_winners < 1) {
      setSubmitError('Number of winners must be at least 1.')
      return
    }

    const giveawayData = {
      creator_id: currentUser.id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      prize_details: formData.prize_details.trim(),
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      num_winners: formData.num_winners,
      status: 'draft'
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const { error } = await supabase
        .from('giveaways')
        .insert([giveawayData])
        .select()

      if (error) throw error

      navigate('/dashboard')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create giveaway')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">Create New Giveaway</h1>
        
        {submitError && (
          <div className="mb-6 p-4 text-red-700 bg-red-100 rounded-md">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter giveaway title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your giveaway"
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prize_details">Prize Details</Label>
            <Textarea
              id="prize_details"
              name="prize_details"
              value={formData.prize_details}
              onChange={handleChange}
              placeholder="Describe the prize(s)"
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                name="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                name="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_winners">Number of Winners</Label>
            <Input
              id="num_winners"
              name="num_winners"
              type="number"
              min="1"
              value={formData.num_winners}
              onChange={handleChange}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Giveaway'}
          </Button>
        </form>
      </div>
    </div>
  )
}