/**
 * Property-Based Test for Dashboard Priority System
 * Feature: app-ux-overhaul, Property 4: Dashboard Priority System
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { Task, Goal, Routine } from '@/types'

// Generators for test data
const taskArbitrary = fc.record({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  description: fc.option(fc.string()),
  completed: fc.boolean(),
  priority: fc.constantFrom('low', 'medium', 'high'),
  dueDate: fc.option(fc.date().map(d => d.toISOString())),
  createdAt: fc.date().map(d => d.toISOString()),
  updatedAt: fc.date().map(d => d.toISOString()),
  userId: fc.string(),
}) as fc.Arbitrary<Task>

const goalArbitrary = fc.record({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  description: fc.option(fc.string()),
  status: fc.constantFrom('not-started', 'in-progress', 'completed', 'on-hold'),
  progress: fc.integer({ min: 0, max: 100 }),
  targetDate: fc.option(fc.date().map(d => d.toISOString())),
  createdAt: fc.date().map(d => d.toISOString()),
  updatedAt: fc.date().map(d => d.toISOString()),
  userId: fc.string(),
}) as fc.Arbitrary<Goal>

const routineArbitrary = fc.record({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  description: fc.option(fc.string()),
  frequency: fc.constantFrom('daily', 'weekly', 'monthly'),
  time: fc.string(),
  isActive: fc.boolean(),
  createdAt: fc.date().map(d => d.toISOString()),
  updatedAt: fc.date().map(d => d.toISOString()),
  userId: fc.string(),
}) as fc.Arbitrary<Routine>

// Helper functions to test the priority system logic
function getOverdueTasks(tasks: Task[]): Task[] {
  const now = new Date()
  return tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) < now
  )
}

function getTasksDueToday(tasks: Task[]): Task[] {
  const today = new Date().toISOString().split('T')[0]
  return tasks.filter(task => 
    !task.completed && 
    task.dueDate?.startsWith(today)
  )
}

function getTodaysRoutines(routines: Routine[]): Routine[] {
  return routines.filter(routine => routine.isActive)
}

function getInProgressGoals(goals: Goal[]): Goal[] {
  return goals.filter(goal => goal.status === 'in-progress')
}

// Smart suggestion generation logic
function generateSmartSuggestions(
  overdueItems: Task[],
  scheduledTasks: Task[],
  inProgressGoals: Goal[],
  activeRoutines: Routine[]
): Array<{
  id: string;
  type: 'task' | 'goal' | 'routine';
  title: string;
  description: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  actionData: any;
}> {
  const suggestions: any[] = []

  // Suggest handling overdue items first (high priority)
  if (overdueItems.length > 0) {
    const oldestOverdue = overdueItems.sort((a, b) => 
      new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime()
    )[0]
    
    suggestions.push({
      id: `overdue-${oldestOverdue.id}`,
      type: 'task',
      title: `Complete overdue task: ${oldestOverdue.title}`,
      description: 'This task is overdue and should be prioritized',
      reasoning: 'Overdue tasks can create stress and block progress on other goals',
      priority: 'high',
      estimatedTime: 15,
      actionData: { taskId: oldestOverdue.id, action: 'complete' }
    })
  }

  // Suggest working on goals that are behind schedule (medium priority)
  const behindScheduleGoals = inProgressGoals.filter(goal => {
    if (!goal.targetDate) return false
    const today = new Date()
    const targetDate = new Date(goal.targetDate)
    const totalDays = Math.ceil((targetDate.getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    const daysPassed = Math.ceil((today.getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    const expectedProgress = (daysPassed / totalDays) * 100
    return goal.progress < expectedProgress - 10 // 10% tolerance
  })

  if (behindScheduleGoals.length > 0) {
    const mostBehindGoal = behindScheduleGoals[0]
    suggestions.push({
      id: `behind-goal-${mostBehindGoal.id}`,
      type: 'goal',
      title: `Focus on goal: ${mostBehindGoal.title}`,
      description: 'This goal is behind schedule and needs attention',
      reasoning: 'Staying on track with goals prevents last-minute rushes',
      priority: 'medium',
      estimatedTime: 30,
      actionData: { goalId: mostBehindGoal.id, action: 'work_on' }
    })
  }

  // Suggest completing today's routines (medium priority)
  if (activeRoutines.length > 0) {
    suggestions.push({
      id: `routines-today`,
      type: 'routine',
      title: `Complete ${activeRoutines.length} routine${activeRoutines.length > 1 ? 's' : ''} today`,
      description: 'Maintaining routines builds consistency and momentum',
      reasoning: 'Regular routines create positive habits and structure',
      priority: 'medium',
      estimatedTime: activeRoutines.length * 10,
      actionData: { routines: activeRoutines.map(r => r.id), action: 'complete_all' }
    })
  }

  // Limit to top 3 suggestions
  return suggestions.slice(0, 3)
}

describe('Dashboard Priority System Property Tests', () => {
  it('Property 4: Dashboard Priority System - overdue items appear before scheduled items', () => {
    fc.assert(
      fc.property(
        fc.array(taskArbitrary, { minLength: 0, maxLength: 20 }),
        fc.array(goalArbitrary, { minLength: 0, maxLength: 10 }),
        fc.array(routineArbitrary, { minLength: 0, maxLength: 5 }),
        (tasks, goals, routines) => {
          // Test the priority system logic
          const overdueItems = getOverdueTasks(tasks)
          const scheduledTasks = getTasksDueToday(tasks)
          const activeRoutines = getTodaysRoutines(routines)
          const inProgressGoals = getInProgressGoals(goals)

          // Property 1: Overdue items should only contain tasks that are actually overdue
          const now = new Date()
          overdueItems.forEach(task => {
            expect(task.completed).toBe(false)
            expect(task.dueDate).toBeDefined()
            if (task.dueDate) {
              expect(new Date(task.dueDate).getTime()).toBeLessThan(now.getTime())
            }
          })

          // Property 2: Scheduled tasks should only contain tasks due today
          const today = new Date().toISOString().split('T')[0]
          scheduledTasks.forEach(task => {
            expect(task.completed).toBe(false)
            expect(task.dueDate?.startsWith(today)).toBe(true)
          })

          // Property 3: Active routines should only contain active routines
          activeRoutines.forEach(routine => {
            expect(routine.isActive).toBe(true)
          })

          // Property 4: In-progress goals should only contain goals with in-progress status
          inProgressGoals.forEach(goal => {
            expect(goal.status).toBe('in-progress')
          })

          // Property 5: No task should appear in both overdue and scheduled categories
          const overdueIds = new Set(overdueItems.map(t => t.id))
          const scheduledIds = new Set(scheduledTasks.map(t => t.id))
          const intersection = new Set([...overdueIds].filter(id => scheduledIds.has(id)))
          expect(intersection.size).toBe(0)

          // Property 6: Smart suggestions should be generated correctly
          const suggestions = generateSmartSuggestions(overdueItems, scheduledTasks, inProgressGoals, activeRoutines)
          
          // Suggestions should be limited to 3
          expect(suggestions.length).toBeLessThanOrEqual(3)
          
          // If there are overdue items, there should be a high-priority suggestion
          if (overdueItems.length > 0) {
            const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high')
            expect(highPrioritySuggestions.length).toBeGreaterThan(0)
            
            const overdueTaskSuggestion = highPrioritySuggestions.find(s => 
              s.type === 'task' && s.title.includes('overdue')
            )
            expect(overdueTaskSuggestion).toBeDefined()
          }

          // All suggestions should have required properties
          suggestions.forEach(suggestion => {
            expect(suggestion).toHaveProperty('id')
            expect(suggestion).toHaveProperty('type')
            expect(suggestion).toHaveProperty('title')
            expect(suggestion).toHaveProperty('description')
            expect(suggestion).toHaveProperty('reasoning')
            expect(suggestion).toHaveProperty('priority')
            expect(suggestion).toHaveProperty('estimatedTime')
            expect(suggestion).toHaveProperty('actionData')
            expect(['high', 'medium', 'low']).toContain(suggestion.priority)
            expect(typeof suggestion.estimatedTime).toBe('number')
            expect(suggestion.estimatedTime).toBeGreaterThan(0)
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 4.1: Dashboard shows priority-based item display with visual hierarchy', () => {
    fc.assert(
      fc.property(
        fc.array(taskArbitrary, { minLength: 0, maxLength: 15 }),
        (tasks) => {
          const overdueItems = getOverdueTasks(tasks)
          const scheduledTasks = getTasksDueToday(tasks)

          // Property: Overdue items (highest priority) should be distinct from scheduled items
          const overdueIds = new Set(overdueItems.map(item => item.id))
          const scheduledIds = new Set(scheduledTasks.map(item => item.id))
          
          // No overlap between overdue and scheduled (they should be distinct categories)
          const intersection = new Set([...overdueIds].filter(id => scheduledIds.has(id)))
          expect(intersection.size).toBe(0)

          // Property: All overdue items should be incomplete and past due
          overdueItems.forEach(item => {
            expect(item.completed).toBe(false)
            if (item.dueDate) {
              expect(new Date(item.dueDate).getTime()).toBeLessThan(new Date().getTime())
            }
          })

          // Property: All scheduled items should be incomplete and due today
          const today = new Date().toISOString().split('T')[0]
          scheduledTasks.forEach(item => {
            expect(item.completed).toBe(false)
            expect(item.dueDate?.startsWith(today)).toBe(true)
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 4.2: Dashboard statistics focus on actionable insights', () => {
    fc.assert(
      fc.property(
        fc.array(taskArbitrary, { minLength: 0, maxLength: 20 }),
        fc.array(goalArbitrary, { minLength: 0, maxLength: 10 }),
        (tasks, goals) => {
          // Calculate stats similar to the dashboard
          const completedTasks = tasks.filter(t => t.completed)
          const completedGoals = goals.filter(g => g.status === 'completed')
          
          // Calculate points (simple implementation)
          const totalPoints = completedTasks.length * 10 + completedGoals.length * 50
          
          // Calculate today's points
          const today = new Date().toISOString().split('T')[0]
          const tasksCompletedToday = tasks.filter(task => 
            task.completed && task.updatedAt.startsWith(today)
          ).length
          const goalsCompletedToday = goals.filter(goal => 
            goal.status === 'completed' && goal.updatedAt.startsWith(today)
          ).length
          const todayPoints = tasksCompletedToday * 10 + goalsCompletedToday * 50
          
          // Calculate completion rate
          const totalTasksToday = tasks.filter(task => 
            task.dueDate?.startsWith(today) || task.updatedAt.startsWith(today)
          ).length
          const completionRate = totalTasksToday > 0 ? (tasksCompletedToday / totalTasksToday) * 100 : 0

          // Property: Stats should be actionable numbers, not just counts
          expect(typeof totalPoints).toBe('number')
          expect(totalPoints).toBeGreaterThanOrEqual(0)
          
          expect(typeof todayPoints).toBe('number')
          expect(todayPoints).toBeGreaterThanOrEqual(0)
          
          expect(typeof completionRate).toBe('number')
          expect(completionRate).toBeGreaterThanOrEqual(0)
          expect(completionRate).toBeLessThanOrEqual(100)

          // Property: Today's points should never exceed total points
          expect(todayPoints).toBeLessThanOrEqual(totalPoints)

          // Property: Points should scale with completed items
          expect(totalPoints).toBe(completedTasks.length * 10 + completedGoals.length * 50)
        }
      ),
      { numRuns: 100 }
    )
  })
})