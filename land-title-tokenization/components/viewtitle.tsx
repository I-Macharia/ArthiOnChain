import { useState } from 'react'
import { useContract } from '../hooks/useContract'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'

export function ViewLandTitle() {
  const { contract } = useContract()
  const [landId, setLandId] = useState('')
  const [landDetails, setLandDetails] = useState(null)

  const fetchLandDetails = async () => {
    try {
      const details = await contract?.getLandDetails(landId)
      setLandDetails({
        isRegistered: details[0],
        ownerAddress: details[1],
        location: details[2],
        area: details[3].toString(),
        documentHash: details[4],
        tokenId: details[5].toString()
      })
    } catch (error) {
      console.error('Error fetching land details:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Enter Land ID"
          onChange={(e) => setLandId(e.target.value)}
        />
        <Button onClick={fetchLandDetails}>View Details</Button>
      </div>

      {landDetails && (
        <Card>
          <CardContent className="space-y-2">
            <p>Owner: {landDetails.ownerAddress}</p>
            <p>Location: {landDetails.location}</p>
            <p>Area: {landDetails.area}</p>
            <p>Document Hash: {landDetails.documentHash}</p>
            <p>Token ID: {landDetails.tokenId}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}