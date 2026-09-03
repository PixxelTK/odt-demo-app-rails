class CreateTodos < ActiveRecord::Migration[8.1]
  def change
    create_table :todos do |t|
      t.string :title, null: false
      t.text :description
      t.string :category, default: "Work"
      t.string :priority, default: "Medium"
      t.date :due_date
      t.boolean :completed, default: false, null: false

      t.timestamps
    end
  end
end
