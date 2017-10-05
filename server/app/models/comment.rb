class Comment < ApplicationRecord
  belongs_to :author, class_name: "User"
  belongs_to :picture

  def target
    User.find(self.target_id)
  end

end
