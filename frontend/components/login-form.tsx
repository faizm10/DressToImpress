// 'use client'

// import { cn } from '@/lib/utils'
// import { createClient } from '@/lib/supabase/client'
// import { Button } from '@/components/ui/button'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { useState } from 'react'

// export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const supabase = createClient()
//     setIsLoading(true)
//     setError(null)

//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       })
//       if (error) throw error
//       // Update this route to redirect to an authenticated route. The user already has an active session.
//       router.push('/dashboard')
//     } catch (error: unknown) {
//       setError(error instanceof Error ? error.message : 'An error occurred')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className={cn('flex flex-col gap-6', className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">Login</CardTitle>
//           <CardDescription>Enter your email below to login to your account</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleLogin}>
//             <div className="flex flex-col gap-6">
//               <div className="grid gap-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="m@example.com"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <div className="flex items-center">
//                   <Label htmlFor="password">Password</Label>
//                   <Link
//                     href="/auth/forgot-password"
//                     className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
//                   >
//                     Forgot your password?
//                   </Link>
//                 </div>
//                 <Input
//                   id="password"
//                   type="password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//               {error && <p className="text-sm text-red-500">{error}</p>}
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? 'Logging in...' : 'Login'}
//               </Button>
//             </div>
//             {/* <div className="mt-4 text-center text-sm">
//               Don&apos;t have an account?{' '}
//               <Link href="/auth/sign-up" className="underline underline-offset-4">
//                 Sign up
//               </Link>
//             </div> */}
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Mail, Lock, Loader2 } from 'lucide-react'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="border-none shadow-lg bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[#E51937]">Welcome back</CardTitle>
          <CardDescription className="text-black">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-black">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E51937]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-[#E51937] focus:ring-[#E51937]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-black">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#E51937] hover:text-[#FFC429]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E51937]" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-[#E51937] focus:ring-[#E51937]"
                />
              </div>
            </div>
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-[#E51937]">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-[#E51937] hover:bg-[#FFC429] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
           
          </form>
        </CardContent>
      </Card>
    </div>
  )
}