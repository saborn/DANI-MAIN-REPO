"use client"

import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth-form"

export default function CustomerAuthPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/customer")
  }

  return <AuthForm type="customer" onSuccess={handleSuccess} />
}
