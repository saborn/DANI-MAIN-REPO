export const BUBBLE = {
  base: process.env.BUBBLE_BASE_URL!,
  token: process.env.BUBBLE_ADMIN_TOKEN || "",
}

// Bubble API data types from your backend
export const TYPES = {
  brand: "brand",
  conversation: "conversation",
  membership: "membership",
  message: "message",
  purchase: "purchase",
  userProfile: "userprofile",
  user: "user",
} as const

export interface BubbleResponse<T = any> {
  response: {
    results: T[]
    count: number
  }
  status: string
}

export interface BubbleConstraint {
  key: string
  constraint_type: "equals" | "not equal" | "greater than" | "less than" | "contains" | "not contains"
  value: string | number | boolean
}

export async function bubbleFetch(path: string, init: RequestInit = {}): Promise<BubbleResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  }

  if (BUBBLE.token) {
    headers.Authorization = `Bearer ${BUBBLE.token}`
  }

  try {
    const response = await fetch(`${BUBBLE.base}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[v0] Bubble API Error ${response.status}:`, errorText)
      throw new Error(`Bubble API Error ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log(`[v0] Bubble API Success:`, path, data)
    return data
  } catch (error) {
    console.error(`[v0] Bubble fetch failed for ${path}:`, error)
    throw error
  }
}

export function buildConstraints(constraints: BubbleConstraint[]): string {
  return encodeURIComponent(JSON.stringify(constraints))
}
