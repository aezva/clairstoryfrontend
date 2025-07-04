"use client";
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AuthPage from '@/components/pages/auth-page'

export default function Home() {
  const [session, setSession] = useState<any>(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (!session) {
    return <AuthPage />
  }
  // Aquí podrías renderizar el dashboard o el layout principal
  return <div>Bienvenido a Clair Story</div>
}
