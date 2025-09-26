"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ImageIcon, X, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void
  onCancel?: () => void
  className?: string
}

export function ImageUpload({ onImageSelect, onCancel, className }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleSendImage = () => {
    if (selectedImage) {
      onImageSelect(selectedImage)
      setSelectedImage(null)
    }
  }

  const handleCancel = () => {
    setSelectedImage(null)
    onCancel?.()
  }

  return (
    <Card className={cn("p-4 space-y-4", className)}>
      {!selectedImage ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-4">Drag and drop an image here, or click to select</p>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="bg-transparent">
            <ImageIcon className="mr-2 h-4 w-4" />
            Choose Image
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Selected image"
              className="max-w-full max-h-64 rounded-lg mx-auto"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSendImage}>Send Image</Button>
          </div>
        </div>
      )}
    </Card>
  )
}
