# frozen_string_literal: true

class TodosController < ApplicationController
  before_action :set_todo, only: %i[destroy toggle]
  before_action :set_metrics, only: :index

  def index
    @filter = params[:filter].presence || "all"
    @todos = case @filter
    when "active"
      Todo.active.recent
    when "completed"
      Todo.completed.recent
    else
      Todo.recent
    end
    @todo = Todo.new
  end

  def create
    @todo = Todo.new(todo_params)

    respond_to do |format|
      if @todo.save
        set_metrics
        format.turbo_stream
        format.html { redirect_to root_path, notice: "Task created successfully!" }
      else
        set_metrics
        format.turbo_stream { render turbo_stream: turbo_stream.replace("todo_form_container", partial: "form", locals: { todo: @todo }) }
        format.html { render :index, status: :unprocessable_entity }
      end
    end
  end

  def toggle
    @todo.update(completed: !@todo.completed)
    set_metrics

    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to root_path }
    end
  end

  def destroy
    @todo.destroy
    set_metrics

    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to root_path, notice: "Task deleted." }
    end
  end

  private

  def set_todo
    @todo = Todo.find(params[:id])
  end

  def set_metrics
    @total_count = Todo.count
    @active_count = Todo.active.count
    @completed_count = Todo.completed.count
    @completion_rate = @total_count.positive? ? ((@completed_count.to_f / @total_count) * 100).round : 0
  end

  def todo_params
    params.require(:todo).permit(:title, :description, :category, :priority, :due_date, :completed)
  end
end
