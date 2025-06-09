import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft } from 'lucide-react'

type Giveaway = {
  id: string
  title: string
  description: string
  prize_details: string
  start_time: string
  end_time: string
  num_winners: number
  status: string
  creator_id: string
  winner_info_json: any
}

type Participant = {
  id: string
  participant_identifier: string
  created_at: string
}

export default function ManageGiveawayPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  
  const [giveaway, setGiveaway] = useState<Giveaway | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [winnerInput, setWinnerInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGiveawayAndParticipants() {
      if (!id || !currentUser) {
        setError('Invalid giveaway or user not authenticated')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch giveaway details
        const { data: giveawayData, error: giveawayError } = await supabase
          .from('giveaways')
          .select('*')
          .eq('id', id)
          .eq('creator_id', currentUser.id)
          .single()

        if (giveawayError) {
          if (giveawayError.code === 'PGRST116') {
            setError('Giveaway not found or you do not have permission to manage it')
          } else {
            setError('Failed to fetch giveaway details')
          }
          setLoading(false)
          return
        }

        // Check if giveaway status is 'ended'
        if (giveawayData.status !== 'ended') {
          setError('This giveaway has not ended yet. Only ended giveaways can be managed for winner selection.')
          setLoading(false)
          return
        }

        setGiveaway(giveawayData)

        // Populate winnerInput with existing winner_info_json if it exists
        if (giveawayData.winner_info_json) {
          if (typeof giveawayData.winner_info_json === 'string') {
            setWinnerInput(giveawayData.winner_info_json)
          } else {
            setWinnerInput(JSON.stringify(giveawayData.winner_info_json, null, 2))
          }
        }

        // Fetch participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('participants')
          .select('id, participant_identifier, created_at')
          .eq('giveaway_id', id)
          .order('created_at', { ascending: true })

        if (participantsError) {
          setError('Failed to fetch participants')
          setLoading(false)
          return
        }

        setParticipants(participantsData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchGiveawayAndParticipants()
  }, [id, currentUser])

  const handleSaveWinners = async () => {
    if (!giveaway || !currentUser) return

    try {
      setIsSaving(true)
      setSaveError(null)

      const { error } = await supabase
        .from('giveaways')
        .update({ winner_info_json: winnerInput })
        .eq('id', giveaway.id)
        .eq('creator_id', currentUser.id)

      if (error) {
        throw error
      }

      // Update local state
      setGiveaway(prev => prev ? { ...prev, winner_info_json: winnerInput } : null)

      toast({
        title: "Winners Saved",
        description: "Winner information has been successfully updated."
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save winner information'
      setSaveError(errorMessage)
      
      toast({
        title: "Error Saving Winners",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          Loading giveaway details...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!giveaway) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Manage Winners: {giveaway.title}</CardTitle>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Status: <span className="font-medium">Ended</span></p>
              <p>Ended: {formatDateTime(giveaway.end_time)}</p>
              <p>Number of Winners to Select: <span className="font-medium">{giveaway.num_winners}</span></p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Prize Details</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{giveaway.prize_details}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participants ({participants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No participants joined this giveaway.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>
                    List of all participants who joined this giveaway
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Participant ID</TableHead>
                      <TableHead className="min-w-[180px]">Joined At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant, index) => (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">
                          {participant.participant_identifier}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(participant.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Winner Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="winner-info">Enter Winner(s) Information:</Label>
              <Textarea
                id="winner-info"
                value={winnerInput}
                onChange={(e) => setWinnerInput(e.target.value)}
                placeholder="Enter the winner details here (e.g., participant IDs, names, contact information, etc.)"
                className="min-h-[120px]"
              />
              <p className="text-sm text-gray-500">
                You can manually enter the winner information based on the participants list above.
                This will be saved as the official winner record for this giveaway.
                You can enter plain text or JSON format (e.g., {"winners": ["participant_id_1", "participant_id_2"]}).
              </p>
            </div>

            {saveError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {saveError}
              </div>
            )}
            
            <Button 
              onClick={handleSaveWinners}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? 'Saving Winners...' : 'Save Winners'}
            </Button>

            {giveaway.winner_info_json && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
                <h4 className="font-medium text-green-800 mb-2">Previously Saved Winner Information:</h4>
                <pre className="text-sm text-green-700 whitespace-pre-wrap">
                  {typeof giveaway.winner_info_json === 'string' 
                    ? giveaway.winner_info_json 
                    : JSON.stringify(giveaway.winner_info_json, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}