# frozen_string_literal: true

require "test_helper"

class TodosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @todo = todos(:one)
  end

  test "toggle updates completed and assigns fresh metrics" do
    assert_not @todo.completed?

    patch toggle_todo_url(@todo), as: :turbo_stream

    assert_response :success
    assert @todo.reload.completed?
    assert_includes response.body, "50% completed"
  end
end
