"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Dashboard from "@/components/common/Dashboard";
import AuthForm from "@/components/common/AuthForm";
import { Session } from "@supabase/supabase-js";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return <div>{!session ? <AuthForm /> : <Dashboard />}</div>;
}
