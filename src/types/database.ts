export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Supabase Database Schema Types
export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          id: string
          user_id: string
          type: 'book' | 'certificate' | 'skill' | 'other'
          title: string
          description: string | null
          date_completed: string
          tags: string[]
          proof_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'book' | 'certificate' | 'skill' | 'other'
          title: string
          description?: string | null
          date_completed: string
          tags?: string[]
          proof_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'book' | 'certificate' | 'skill' | 'other'
          title?: string
          description?: string | null
          date_completed?: string
          tags?: string[]
          proof_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          user_id: string
          type: 'note' | 'link' | 'file' | 'other'
          title: string
          content: string
          url: string | null
          category: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'note' | 'link' | 'file' | 'other'
          title: string
          content: string
          url?: string | null
          category: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'note' | 'link' | 'file' | 'other'
          title?: string
          content?: string
          url?: string | null
          category?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          target_date: string | null
          status: 'not-started' | 'in-progress' | 'completed'
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target_date?: string | null
          status?: 'not-started' | 'in-progress' | 'completed'
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          target_date?: string | null
          status?: 'not-started' | 'in-progress' | 'completed'
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          due_date: string | null
          completed: boolean
          is_routine: boolean
          reminder_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          is_routine?: boolean
          reminder_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          is_routine?: boolean
          reminder_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      routines: {
        Row: {
          id: string
          user_id: string
          title: string
          days_of_week: number[]
          time: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          days_of_week: number[]
          time: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          days_of_week?: number[]
          time?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type aliases for easier use
export type DbAchievement = Database['public']['Tables']['achievements']['Row'];
export type DbAchievementInsert = Database['public']['Tables']['achievements']['Insert'];
export type DbAchievementUpdate = Database['public']['Tables']['achievements']['Update'];

export type DbResource = Database['public']['Tables']['resources']['Row'];
export type DbResourceInsert = Database['public']['Tables']['resources']['Insert'];
export type DbResourceUpdate = Database['public']['Tables']['resources']['Update'];

export type DbGoal = Database['public']['Tables']['goals']['Row'];
export type DbGoalInsert = Database['public']['Tables']['goals']['Insert'];
export type DbGoalUpdate = Database['public']['Tables']['goals']['Update'];

export type DbTask = Database['public']['Tables']['tasks']['Row'];
export type DbTaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type DbTaskUpdate = Database['public']['Tables']['tasks']['Update'];

export type DbRoutine = Database['public']['Tables']['routines']['Row'];
export type DbRoutineInsert = Database['public']['Tables']['routines']['Insert'];
export type DbRoutineUpdate = Database['public']['Tables']['routines']['Update'];

export type DbProfile = Database['public']['Tables']['profiles']['Row'];
export type DbProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type DbProfileUpdate = Database['public']['Tables']['profiles']['Update'];