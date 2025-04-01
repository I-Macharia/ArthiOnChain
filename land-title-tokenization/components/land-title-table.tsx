"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, MoreHorizontal } from "lucide-react"

// Mock data for demonstration
const mockLandTitles = [
  {
    id: 1,
    owner: "0x1234...5678",
    location: "123 Main St, Cityville",
    area: 500,
    documentHash: "0xabcd...ef12",
    registrationDate: "2023-05-15",
  },
  {
    id: 2,
    owner: "0x8765...4321",
    location: "456 Oak Ave, Townsburg",
    area: 750,
    documentHash: "0xfedc...ba98",
    registrationDate: "2023-06-22",
  },
  {
    id: 3,
    owner: "0x9876...5432",
    location: "789 Pine Rd, Villageton",
    area: 1200,
    documentHash: "0x1234...abcd",
    registrationDate: "2023-07-10",
  },
  {
    id: 4,
    owner: "0x5432...1098",
    location: "321 Cedar Ln, Hamletville",
    area: 850,
    documentHash: "0x5678...efgh",
    registrationDate: "2023-08-05",
  },
  {
    id: 5,
    owner: "0x6789...0123",
    location: "654 Birch Blvd, Boroughton",
    area: 920,
    documentHash: "0x9012...ijkl",
    registrationDate: "2023-09-18",
  },
]

export function LandTitleTable() {
  const [selectedTitle, setSelectedTitle] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const handleViewDetails = (title: any) => {
    setSelectedTitle(title)
    setDetailsOpen(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="hidden md:table-cell">Area (sq ft)</TableHead>
              <TableHead className="hidden md:table-cell">Registration Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLandTitles.map((title) => (
              <TableRow key={title.id}>
                <TableCell className="font-medium">{title.id}</TableCell>
                <TableCell>{title.owner}</TableCell>
                <TableCell>{title.location}</TableCell>
                <TableCell className="hidden md:table-cell">{title.area}</TableCell>
                <TableCell className="hidden md:table-cell">{title.registrationDate}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewDetails(title)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Verify on Blockchain</DropdownMenuItem>
                      <DropdownMenuItem>View Token</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Land Title Details</DialogTitle>
            <DialogDescription>Complete information about the selected land title.</DialogDescription>
          </DialogHeader>
          {selectedTitle && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">ID:</span>
                <span className="col-span-3">{selectedTitle.id}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Owner:</span>
                <span className="col-span-3">{selectedTitle.owner}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Location:</span>
                <span className="col-span-3">{selectedTitle.location}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Area:</span>
                <span className="col-span-3">{selectedTitle.area} sq ft</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Document Hash:</span>
                <span className="col-span-3 truncate">{selectedTitle.documentHash}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Registration Date:</span>
                <span className="col-span-3">{selectedTitle.registrationDate}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

