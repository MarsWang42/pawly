class AdoptionRequest < ApplicationRecord
  belongs_to :adoption_applicant, class_name: "User"
  belongs_to :adoption_pet_owner, class_name: "User"
  belongs_to :pet

  validates :adoption_applicant_id, presence: true
  validates :adoption_pet_owner_id, presence: true
  validates :pet_id, presence: true
  validates :email, presence: true,
                    email_format: { :message => 'is not looking good' },
                    if: :email?
  validates :full_name, presence: true
end
