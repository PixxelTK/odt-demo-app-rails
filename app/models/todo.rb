# frozen_string_literal: true

class Todo < ApplicationRecord
  validates :title, presence: true

  scope :active, -> { where(completed: false) }
  scope :completed, -> { where(completed: true) }
  scope :recent, -> { order(created_at: :desc) }

  CATEGORIES = %w[Work Shopping Personal Health Finance].freeze
  PRIORITIES = %w[Low Medium High Critical].freeze
end
