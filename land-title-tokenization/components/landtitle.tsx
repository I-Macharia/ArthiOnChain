import { useState } from 'react'
import { useContract } from '../hooks/useContract'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Alert } from './ui/alert'

export function RegisterLandTitle() {
  const { contract } = useContract()
  const [formData, setFormData] = useState({
    id: '',
    owner: '',
    location: '',
    area: '',
    documentHash: ''
  })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const tx = await contract?.registerLandTitle(
        formData.id,
        formData.owner,
        formData.location,
        formData.area,
        formData.documentHash
      )
      await tx.wait()
      setStatus('Land title registered successfully!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setStatus('Error registering land title: ' + errorMessage)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Land ID"
        onChange={(e) => setFormData({...formData, id: e.target.value})}
      />
      <Input
        type="text"
        placeholder="Owner Address"
        onChange={(e) => setFormData({...formData, owner: e.target.value})}
      />
      <Input
        type="text"
        placeholder="Location"
        onChange={(e) => setFormData({...formData, location: e.target.value})}
      />
      <Input
        type="number"
        placeholder="Area"
        onChange={(e) => setFormData({...formData, area: e.target.value})}
      />
      <Input
        type="text"
        placeholder="Document Hash"
        onChange={(e) => setFormData({...formData, documentHash: e.target.value})}
      />
      <Button type="submit">Register Land Title</Button>
      {status && <Alert>{status}</Alert>}
    </form>
  )
}