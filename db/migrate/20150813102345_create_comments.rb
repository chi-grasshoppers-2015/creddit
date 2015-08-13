class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :author
      t.text :body
      t.datetime :creation_date
      t.integer :score
      t.string :subreddit
      t.integer :gilded
      t.timestamps
    end
  end
end
