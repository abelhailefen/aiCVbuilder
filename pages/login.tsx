"use client"

import type React from "react"

import { useState } from "react"
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebaseConfig"
import { useRouter } from "next/router"
import styles from '../styles/login.module.css';
import { FcGoogle } from "react-icons/fc"

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      await signInWithPopup(auth, googleProvider)
      router.push("/dashboard") // Redirect after login
    } catch (error) {
      console.error("Google login failed:", error)
      setError("Google login failed, please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Email/password login handler
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard") // Redirect after login
    } catch (error) {
      console.error("Login failed:", error)
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1>Welcome Back</h1>
          <p>Please sign in to continue</p>
        </div>

        <button className={styles.googleButton} onClick={handleGoogleLogin} disabled={isLoading}>
          <FcGoogle className={styles.googleIcon} />
          <span>Sign in with Google</span>
        </button>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <form onSubmit={handleEmailLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="password">Password</label>
              <a href="#" className={styles.forgotPassword}>
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>

        <div className={styles.footer}>
          Don't have an account? <a href="#">Sign up</a>
        </div>
      </div>
    </div>
  )
}

