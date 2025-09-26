import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Store, Users, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-12 w-12 text-primary" />
            <h1 className="text-6xl font-bold text-foreground tracking-tight">DANI</h1>
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <p className="text-2xl text-primary font-semibold leading-relaxed">
            Welcome to Dani your personal shopping assistant
          </p>
          <p className="text-xl text-muted-foreground font-medium">The VIP service you deserve</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-2xl w-fit shadow-lg">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">VIP Customer Portal</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Access your exclusive profile and chat with luxury brand concierges
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                asChild
                className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link href="/customer/auth">
                  <MessageCircle className="mr-3 h-5 w-5" />
                  Enter VIP Portal
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-accent/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6 p-4 bg-accent/10 rounded-2xl w-fit shadow-lg">
                <Store className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="text-2xl">Brand Dashboard</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Manage VIP customers and provide personalized luxury service
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                asChild
                variant="outline"
                className="w-full h-12 text-lg font-semibold bg-transparent border-2 hover:bg-accent/5 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link href="/store/auth">
                  <Store className="mr-3 h-5 w-5" />
                  Enter Brand Portal
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
