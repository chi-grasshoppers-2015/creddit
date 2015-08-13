class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :username
      t.string :body
      t.datetime :created_at
      t.integer :score
      t.string :subreddit
      t.boolean :gilded
      t.timestamps
    end
  end
end
