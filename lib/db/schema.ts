import { sql } from '@vercel/postgres'
import { NextRequest } from 'next/server'

// Database schema for the full-stack application

export interface User {
  id: string
  email: string
  name: string
  password_hash: string
  subscription_plan: 'free' | 'basic' | 'premium'
  subscription_status: 'active' | 'inactive' | 'cancelled'
  subscription_expires_at: Date | null
  razorpay_customer_id: string | null
  created_at: Date
  updated_at: Date
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string
  problem_statement: string
  status: 'draft' | 'in_progress' | 'completed'
  created_at: Date
  updated_at: Date
}

export interface ProjectData {
  id: string
  project_id: string
  section: string
  data: any
  created_at: Date
  updated_at: Date
}

export interface Subscription {
  id: string
  user_id: string
  plan: 'basic' | 'premium'
  status: 'active' | 'inactive' | 'cancelled'
  razorpay_subscription_id: string | null
  razorpay_payment_id: string | null
  amount: number
  currency: string
  start_date: Date
  end_date: Date
  created_at: Date
  updated_at: Date
}

export interface Payment {
  id: string
  user_id: string
  subscription_id: string | null
  razorpay_payment_id: string
  amount: number
  currency: string
  status: 'pending' | 'captured' | 'failed'
  created_at: Date
  updated_at: Date
}

// Database initialization
export async function initDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        subscription_plan VARCHAR(20) DEFAULT 'free',
        subscription_status VARCHAR(20) DEFAULT 'active',
        subscription_expires_at TIMESTAMP,
        razorpay_customer_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create projects table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        problem_statement TEXT,
        status VARCHAR(20) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create project_data table
    await sql`
      CREATE TABLE IF NOT EXISTS project_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        section VARCHAR(100) NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, section)
      )
    `

    // Create subscriptions table
    await sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        plan VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        razorpay_subscription_id VARCHAR(255),
        razorpay_payment_id VARCHAR(255),
        amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create payments table
    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        subscription_id UUID REFERENCES subscriptions(id),
        razorpay_payment_id VARCHAR(255) UNIQUE NOT NULL,
        amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log('Database tables created successfully')
  } catch (error) {
    console.error('Error creating database tables:', error)
    throw error
  }
}

// User management functions
export async function createUser(email: string, name: string, passwordHash: string) {
  try {
    const result = await sql`
      INSERT INTO users (email, name, password_hash)
      VALUES (${email}, ${name}, ${passwordHash})
      RETURNING id, email, name, subscription_plan, subscription_status, created_at
    `
    return result.rows[0]
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    return result.rows[0] || null
  } catch (error) {
    console.error('Error getting user by email:', error)
    throw error
  }
}

export async function getUserById(id: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE id = ${id}
    `
    return result.rows[0] || null
  } catch (error) {
    console.error('Error getting user by ID:', error)
    throw error
  }
}

// Project management functions
export async function createProject(userId: string, name: string, description: string, problemStatement: string) {
  try {
    const result = await sql`
      INSERT INTO projects (user_id, name, description, problem_statement)
      VALUES (${userId}, ${name}, ${description}, ${problemStatement})
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export async function getUserProjects(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM projects 
      WHERE user_id = ${userId} 
      ORDER BY updated_at DESC
    `
    return result.rows
  } catch (error) {
    console.error('Error getting user projects:', error)
    throw error
  }
}

export async function getProjectById(projectId: string, userId: string) {
  try {
    const result = await sql`
      SELECT * FROM projects 
      WHERE id = ${projectId} AND user_id = ${userId}
    `
    return result.rows[0] || null
  } catch (error) {
    console.error('Error getting project by ID:', error)
    throw error
  }
}

export async function saveProjectData(projectId: string, section: string, data: any) {
  try {
    const result = await sql`
      INSERT INTO project_data (project_id, section, data)
      VALUES (${projectId}, ${section}, ${JSON.stringify(data)})
      ON CONFLICT (project_id, section)
      DO UPDATE SET 
        data = ${JSON.stringify(data)},
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Error saving project data:', error)
    throw error
  }
}

export async function getProjectData(projectId: string) {
  try {
    const result = await sql`
      SELECT section, data FROM project_data 
      WHERE project_id = ${projectId}
    `
    return result.rows.reduce((acc, row) => {
      acc[row.section] = row.data
      return acc
    }, {} as Record<string, any>)
  } catch (error) {
    console.error('Error getting project data:', error)
    throw error
  }
}

// Subscription management functions
export async function createSubscription(userId: string, plan: string, amount: number, razorpaySubscriptionId: string) {
  try {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1) // 1 month subscription

    const result = await sql`
      INSERT INTO subscriptions (user_id, plan, amount, razorpay_subscription_id, start_date, end_date)
      VALUES (${userId}, ${plan}, ${amount}, ${razorpaySubscriptionId}, ${startDate.toISOString()}, ${endDate.toISOString()})
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw error
  }
}

export async function updateUserSubscription(userId: string, plan: string, status: string) {
  try {
    const result = await sql`
      UPDATE users 
      SET subscription_plan = ${plan}, 
          subscription_status = ${status},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Error updating user subscription:', error)
    throw error
  }
}

export async function createPayment(userId: string, subscriptionId: string | null, razorpayPaymentId: string, amount: number, status: string) {
  try {
    const result = await sql`
      INSERT INTO payments (user_id, subscription_id, razorpay_payment_id, amount, status)
      VALUES (${userId}, ${subscriptionId}, ${razorpayPaymentId}, ${amount}, ${status})
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error('Error creating payment:', error)
    throw error
  }
}
