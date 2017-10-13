class Comment < ApplicationRecord
  belongs_to :author, class_name: "User"
  belongs_to :picture
  has_many :report, as: :reportable

  def target
    if self.target_id.present?
      User.find(self.target_id)
    end
  end

end
