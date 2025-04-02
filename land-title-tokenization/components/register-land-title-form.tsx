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
// import { Loader2, FileCheck } from "lucide-react"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"

// export function RegisterLandTitleForm() {
//   const { isConnected, isCorrectNetwork, connectWallet, switchToHederaTestnet } = useWeb3()
//   const { registerLandTitle, loading, error } = useLandRegistry()
//   const { toast } = useToast()
//   const [showSuccess, setShowSuccess] = useState(false)

//   const [formData, setFormData] = useState({
//     titleId: "",
//     ownerAddress: "",
//     location: "",
//     area: "",
//     documentHash: "",
//     additionalInfo: "",
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { id, value } = e.target
//     setFormData((prev) => ({ ...prev, [id]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!isConnected) {
//       toast({
//         title: "Wallet not connected",
//         description: "Please connect your wallet first",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!isCorrectNetwork) {
//       toast({
//         title: "Wrong network",
//         description: "Please switch to Hedera Testnet",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       const { titleId, ownerAddress, documentHash } = formData
//       // Convert titleId to number if needed
//       const numericTitleId = parseInt(titleId, 10).toString()
      
//       const result = await registerLandTitle(numericTitleId, ownerAddress, documentHash)
//       // Use the result if needed
//       console.log('Registration successful:', result)
//       // Simulate document hash generation (replace with actual logic)
//       const simulatedHash = `SimulatedHash:${Math.random().toString(36).substring(2, 15)}/${Math.random().toString(36).substring(2, 15)}`;
//       console.log('Simulated document hash:', simulatedHash);
//       // In a real application, you would upload the document to a secure storage
//       // and generate a hash from the uploaded document.
//       // This is just a placeholder for demonstration purposes.
//       console.log('Simulating document hash generation...')
//       toast({
//         title: "Registration successful",
//         description: "Land title registered successfully!",
//       })
//       setShowSuccess(true)
//       setFormData({
//         titleId: "",
//         ownerAddress: "",
//         location: "",
//         area: "",
//         documentHash: "",
//         additionalInfo: "",
//       })
//     } catch (error: unknown) {  // Type the error properly
//       const errorMessage = error instanceof Error ? error.message : 'An error occurred'
//       toast({
//         title: "Registration failed",
//         description: errorMessage,
//         variant: "destructive",
//       })
//     }
//   }

//   if (!isConnected) {
//     return (
//       <div className="flex flex-col items-center justify-center p-6 text-center">
//         <p className="mb-4">Please connect your wallet to register a land title</p>
//         <Button onClick={connectWallet}>Connect Wallet</Button>
//       </div>
//     )
//   }

//   if (!isCorrectNetwork) {
//     return (
//       <div className="flex flex-col items-center justify-center p-6 text-center">
//         <p className="mb-4">Please switch to Hedera Testnet</p>
//         <Button onClick={switchToHederaTestnet}>Switch Network</Button>
//       </div>
//     )
//   }

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="space-y-4">
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <div className="space-y-2">
//               <Label htmlFor="titleId">Title ID</Label>
//               <Input
//                 id="titleId"
//                 value={formData.titleId}
//                 onChange={handleChange}
//                 placeholder="Enter unique ID"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="ownerAddress">Owner Address</Label>
//               <Input
//                 id="ownerAddress"
//                 value={formData.ownerAddress}
//                 onChange={handleChange}
//                 placeholder="0x..."
//                 required
//               />
//               <p className="text-xs text-muted-foreground">Enter the blockchain address of the property owner</p>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="location">Property Location</Label>
//             <Textarea
//               id="location"
//               value={formData.location}
//               onChange={handleChange}
//               placeholder="Full address of the property"
//               required
//               className="min-h-[80px]"
//             />
//           </div>

//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <div className="space-y-2">
//               <Label htmlFor="area">Area (sq ft)</Label>
//               <Input
//                 id="area"
//                 type="number"
//                 value={formData.area}
//                 onChange={handleChange}
//                 placeholder="Property area in square feet"
//                 min="1"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="documentHash">Document Hash</Label>
//               <Input
//                 id="documentHash"
//                 value={formData.documentHash}
//                 onChange={handleChange}
//                 placeholder="0x..."
//                 required
//               />
//               <p className="text-xs text-muted-foreground">Hash of the document that proves ownership</p>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
//             <Textarea
//               id="additionalInfo"
//               value={formData.additionalInfo}
//               onChange={handleChange}
//               placeholder="Any additional details about the property"
//               className="min-h-[80px]"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end space-x-2">
//           <Button type="submit" disabled={loading}>
//             {loading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Registering...
//               </>
//             ) : (
//               "Register Land Title"
//             )}
//           </Button>
//         </div>
//       </form>

//       <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center">
//               <FileCheck className="mr-2 h-5 w-5 text-green-500" />
//               Registration Successful
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               The land title has been successfully registered on the blockchain and tokenized. You can now view it in
//               the land title registry.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction>View Registry</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   )
// }

