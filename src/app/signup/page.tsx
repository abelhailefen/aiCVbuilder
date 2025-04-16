"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile, User } from "firebase/auth"
import { auth, db, createUserInFirestore } from "@/lib/firebaseConfig"
import { useRouter } from "next/navigation"
import { doc, setDoc } from "firebase/firestore"
import Link from "next/link"
import styles from '../../styles/signup.module.css';

export default function Signup() {
  const router = useRouter()

  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Validate form inputs
  const validateForm = () => {
    if (!displayName) {
      setError("Please enter your name")
      return false
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    return true
  }
  

  // Sign up user and store details in Firestore
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update user profile (display name)
      await updateProfile(user, { displayName })

      // Store user details in Firestore
      const userRef = doc(db, "users", user.uid)
      await setDoc(userRef, {
        uid: user.uid,
        displayName,
        email: user.email,
        photoURL: user.photoURL || "",
        createdAt: new Date(),
      })

      router.push("/dashboard") // Redirect after signup
    } catch (error: any) {
      console.error("Signup failed:", error)

      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please use a different email or sign in.")
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format.")
      } else {
        setError("Failed to create an account. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.signupCard}>
        <div className={styles.header}>
          <h1>Create Account</h1>
          <p>Sign up to get started</p>
        </div>

        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="displayName">Full Name</label>
            <input
              id="displayName"
              type="text"
              placeholder="Your Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

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
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <small className={styles.passwordHint}>Password must be at least 6 characters</small>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
} 
