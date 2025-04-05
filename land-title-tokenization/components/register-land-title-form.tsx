// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/components/ui/use-toast"
// import { useWeb3 } from "@/lib/web3/web3Provider"
// import { useLandRegistry } from "@/lib/web3/useLandRegistry"
// import { Loader2, FileCheck, Upload } from "lucide-react"
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
// } from "@/components/ui/alert-dialog"

// export function RegisterLandTitleForm() {
//     const { isConnected, isCorrectNetwork, connectWallet, switchToHederaTestnet } = useWeb3()
//     const { registerLandTitle, loading, error } = useLandRegistry()
//     const { toast } = useToast()
//     const [showSuccess, setShowSuccess] = useState(false)
//     const [fileUploading, setFileUploading] = useState(false)

//     const [formData, setFormData] = useState({
//         titleId: "",
//         ownerAddress: "",
//         location: "",
//         area: "",
//         documentHash: "", // We'll still collect as string but convert before passing
//         additionalInfo: "",
//     })

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { id, value } = e.target
//         setFormData((prev) => ({ ...prev, [id]: value }))
//     }

//     // Function to handle document upload and hash generation
//     const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0]
//         if (!file) return

//         try {
//             setFileUploading(true)

//             // In a real implementation, you would:
//             // 1. Upload the file to IPFS or a secure storage
//             // 2. Generate a cryptographic hash of the file
//             // For now, we'll simulate this process

//             console.log('Uploading document and generating hash...')

//             // Simulate API call delay
//             await new Promise(resolve => setTimeout(resolve, 1000))

//             // Generate a numeric hash based on file properties
//             const reader = new FileReader()
//             reader.onload = async (event) => {
//                 // Generate a numeric hash value instead of a hex string
//                 // This is just a simple simulation - in a real app you'd use a proper algorithm
//                 // that converts your hash to a numeric format
//                 const fileSize = file.size
//                 const timestamp = Date.now()
//                 const numericHash = String(fileSize + timestamp) // Simple numeric hash simulation

//                 setFormData(prev => ({ ...prev, documentHash: numericHash }))
//                 setFileUploading(false)

//                 toast({
//                     title: "Document processed",
//                     description: "Document uploaded and hash generated successfully",
//                 })
//             }

//             reader.readAsDataURL(file)
//         } catch (error) {
//             setFileUploading(false)
//             toast({
//                 title: "Upload failed",
//                 description: "Failed to process document",
//                 variant: "destructive",
//             })
//         }
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()

//         if (!isConnected) {
//             toast({
//                 title: "Wallet not connected",
//                 description: "Please connect your wallet first",
//                 variant: "destructive",
//             })
//             return
//         }

//         if (!isCorrectNetwork) {
//             toast({
//                 title: "Wrong network",
//                 description: "Please switch to Hedera Testnet",
//                 variant: "destructive",
//             })
//             return
//         }

//         // Validate document hash
//         if (!formData.documentHash) {
//             toast({
//                 title: "Missing document hash",
//                 description: "Please upload a document to generate a hash",
//                 variant: "destructive",
//             })
//             return
//         }

//         try {
//             const { titleId, ownerAddress, documentHash } = formData
//             // Convert titleId to number
//             const numericTitleId = parseInt(titleId, 10)

//             // Convert documentHash to number - this is the key fix
//             const numericDocumentHash = parseInt(documentHash, 10)

//             // Now call with proper number types
//             const result = await registerLandTitle(numericTitleId, ownerAddress, numericDocumentHash)
//             console.log('Registration successful:', result)

//             toast({
//                 title: "Registration successful",
//                 description: "Land title registered successfully!",
//             })
//             setShowSuccess(true)
//             setFormData({
//                 titleId: "",
//                 ownerAddress: "",
//                 location: "",
//                 area: "",
//                 documentHash: "",
//                 additionalInfo: "",
//             })
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : 'An error occurred'
//             toast({
//                 title: "Registration failed",
//                 description: errorMessage,
//                 variant: "destructive",
//             })
//         }
//     }

//     if (!isConnected) {
//         return (
//             <div className="flex flex-col items-center justify-center p-6 text-center">
//                 <p className="mb-4">Please connect your wallet to register a land title</p>
//                 <Button onClick={connectWallet}>Connect Wallet</Button>
//             </div>
//         )
//     }

//     if (!isCorrectNetwork) {
//         return (
//             <div className="flex flex-col items-center justify-center p-6 text-center">
//                 <p className="mb-4">Please switch to Hedera Testnet</p>
//                 <Button onClick={switchToHederaTestnet}>Switch Network</Button>
//             </div>
//         )
//     }

//     return (
//         <>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="space-y-4">
//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         <div className="space-y-2">
//                             <Label htmlFor="titleId">Title ID</Label>
//                             <Input
//                                 id="titleId"
//                                 value={formData.titleId}
//                                 onChange={handleChange}
//                                 placeholder="Enter unique ID"
//                                 required
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="ownerAddress">Owner Address</Label>
//                             <Input
//                                 id="ownerAddress"
//                                 value={formData.ownerAddress}
//                                 onChange={handleChange}
//                                 placeholder="0x..."
//                                 required
//                             />
//                             <p className="text-xs text-muted-foreground">Enter the blockchain address of the property owner</p>
//                         </div>
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="location">Property Location</Label>
//                         <Textarea
//                             id="location"
//                             value={formData.location}
//                             onChange={handleChange}
//                             placeholder="Full address of the property"
//                             required
//                             className="min-h-[80px]"
//                         />
//                     </div>

//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         <div className="space-y-2">
//                             <Label htmlFor="area">Area (sq ft)</Label>
//                             <Input
//                                 id="area"
//                                 type="number"
//                                 value={formData.area}
//                                 onChange={handleChange}
//                                 placeholder="Property area in square feet"
//                                 min="1"
//                                 required
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="documentUpload">Property Document</Label>
//                             <div className="flex items-center space-x-2">
//                                 <Input
//                                     id="documentUpload"
//                                     type="file"
//                                     onChange={handleDocumentUpload}
//                                     className="flex-1"
//                                     accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                                     required={!formData.documentHash}
//                                     disabled={fileUploading}
//                                 />
//                                 {fileUploading && <Loader2 className="h-4 w-4 animate-spin" />}
//                             </div>
//                             <p className="text-xs text-muted-foreground">Upload property document to generate a numeric hash</p>
//                         </div>
//                     </div>

//                     {formData.documentHash && (
//                         <div className="p-3 bg-muted rounded-md">
//                             <div className="flex items-center">
//                                 <FileCheck className="h-5 w-5 text-green-500 mr-2" />
//                                 <div>
//                                     <p className="text-sm font-medium">Document Hash Generated</p>
//                                     <p className="text-xs text-muted-foreground break-all">{formData.documentHash}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     <div className="space-y-2">
//                         <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
//                         <Textarea
//                             id="additionalInfo"
//                             value={formData.additionalInfo}
//                             onChange={handleChange}
//                             placeholder="Any additional details about the property"
//                             className="min-h-[80px]"
//                         />
//                     </div>
//                 </div>

//                 <div className="flex justify-end space-x-2">
//                     <Button type="submit" disabled={loading || fileUploading}>
//                         {loading ? (
//                             <>
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                 Registering...
//                             </>
//                         ) : (
//                             "Register Land Title"
//                         )}
//                     </Button>
//                 </div>
//             </form>

//             <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle className="flex items-center">
//                             <FileCheck className="mr-2 h-5 w-5 text-green-500" />
//                             Registration Successful
//                         </AlertDialogTitle>
//                         <AlertDialogDescription>
//                             The land title has been successfully registered on the blockchain and tokenized. You can now view it in
//                             the land title registry.
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                         <AlertDialogAction>View Registry</AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>
//         </>
//     )
// }