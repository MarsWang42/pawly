class Comment < ApplicationRecord
  belongs_to :author, class_name: "User"
  belongs_to :picture

  def target
    if self.target_id.present?
      User.find(self.target_id)
    end
  end

end
