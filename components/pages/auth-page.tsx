import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Revisa tu correo para confirmar tu cuenta.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleAuth} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center mb-4">{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {message && <div className="text-green-600 text-sm">{message}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarse'}
        </Button>
        <div className="text-center">
          <button
            type="button"
            className="text-blue-600 hover:underline text-sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </form>
    </div>
  )
} 