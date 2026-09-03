# frozen_string_literal: true

Todo.destroy_all

Todo.create!([
  {
    title: "Design Sync",
    category: "Work",
    priority: "Medium",
    due_date: Date.parse("2026-09-02"),
    description: "Discussing the new component library and reviewing latest mockups.",
    completed: false
  },
  {
    title: "Quarterly Team Retrospective",
    category: "Work",
    priority: "High",
    due_date: Date.parse("2026-09-01"),
    description: "Reflect on accomplishments, identify process bottlenecks, and plan sprint roadmap.",
    completed: false
  },
  {
    title: "Weekend Grocery & Home Restock",
    category: "Shopping",
    priority: "Low",
    due_date: Date.parse("2026-09-05"),
    description: "Almond milk, organic coffee beans, fresh avocados, and sourdough bread.",
    completed: false
  },
  {
    title: "Review ODT Lightweight UI Rails Gem",
    category: "Work",
    priority: "High",
    due_date: Date.parse("2026-09-04"),
    description: "Verify design tokens, button variants, badges, and form components integration in Rails 8.",
    completed: true
  }
])

puts "Seeded #{Todo.count} todos."
