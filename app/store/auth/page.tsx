"use client"

import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth-form"

export default function StoreAuthPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/store")
  }

  return <AuthForm type="brand" onSuccess={handleSuccess} />
}
