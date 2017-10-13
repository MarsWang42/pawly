# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20171012232822) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "adoption_requests", force: :cascade do |t|
    t.bigint "adoption_applicant_id"
    t.bigint "adoption_pet_owner_id"
    t.bigint "pet_id"
    t.string "email"
    t.string "phone"
    t.string "full_name"
    t.text "introduction"
    t.text "reason"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["adoption_applicant_id"], name: "index_adoption_requests_on_adoption_applicant_id"
    t.index ["adoption_pet_owner_id"], name: "index_adoption_requests_on_adoption_pet_owner_id"
    t.index ["pet_id"], name: "index_adoption_requests_on_pet_id"
  end

  create_table "comments", force: :cascade do |t|
    t.bigint "author_id"
    t.integer "target_id"
    t.bigint "picture_id"
    t.text "body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_comments_on_author_id"
    t.index ["picture_id"], name: "index_comments_on_picture_id"
  end

  create_table "like_pictures", force: :cascade do |t|
    t.integer "liker_id"
    t.integer "liked_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["liker_id", "liked_id"], name: "index_like_pictures_on_liker_id_and_liked_id", unique: true
  end

  create_table "notifications", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "notified_by_id"
    t.bigint "picture_id"
    t.string "notice_type"
    t.integer "identifier"
    t.boolean "read", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["notified_by_id"], name: "index_notifications_on_notified_by_id"
    t.index ["picture_id"], name: "index_notifications_on_picture_id"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "pets", force: :cascade do |t|
    t.string "name", null: false
    t.string "type", null: false
    t.string "avatar"
    t.text "bio"
    t.boolean "is_rescue"
    t.boolean "is_missing"
    t.bigint "owner_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["owner_id"], name: "index_pets_on_owner_id"
  end

  create_table "pets_pictures", id: false, force: :cascade do |t|
    t.bigint "pet_id"
    t.bigint "picture_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["pet_id", "picture_id"], name: "index_pets_pictures_on_pet_id_and_picture_id", unique: true
    t.index ["pet_id"], name: "index_pets_pictures_on_pet_id"
    t.index ["picture_id"], name: "index_pets_pictures_on_picture_id"
  end

  create_table "pictures", force: :cascade do |t|
    t.bigint "creator_id"
    t.string "image"
    t.text "caption"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "place_id"
    t.index ["creator_id"], name: "index_pictures_on_creator_id"
    t.index ["place_id"], name: "index_pictures_on_place_id"
  end

  create_table "places", force: :cascade do |t|
    t.string "google_place_id"
    t.string "name"
    t.float "latitude"
    t.float "longitude"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["google_place_id"], name: "index_places_on_google_place_id"
  end

  create_table "relationships", force: :cascade do |t|
    t.integer "follower_id"
    t.integer "followed_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["followed_id"], name: "index_relationships_on_followed_id"
    t.index ["follower_id", "followed_id"], name: "index_relationships_on_follower_id_and_followed_id", unique: true
    t.index ["follower_id"], name: "index_relationships_on_follower_id"
  end

  create_table "reports", force: :cascade do |t|
    t.text "body"
    t.bigint "reporter_id"
    t.string "reportable_type"
    t.bigint "reportable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["reportable_type", "reportable_id"], name: "index_reports_on_reportable_type_and_reportable_id"
    t.index ["reporter_id"], name: "index_reports_on_reporter_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.string "username"
    t.string "gender"
    t.string "facebook_id"
    t.string "facebook_email"
    t.string "avatar"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email"
    t.index ["facebook_id"], name: "index_users_on_facebook_id"
    t.index ["username"], name: "index_users_on_username"
  end

  add_foreign_key "adoption_requests", "pets"
  add_foreign_key "adoption_requests", "users", column: "adoption_applicant_id"
  add_foreign_key "adoption_requests", "users", column: "adoption_pet_owner_id"
  add_foreign_key "comments", "pictures"
  add_foreign_key "comments", "users", column: "author_id"
  add_foreign_key "notifications", "pictures"
  add_foreign_key "notifications", "users"
  add_foreign_key "notifications", "users", column: "notified_by_id"
  add_foreign_key "pets", "users", column: "owner_id"
  add_foreign_key "pictures", "places"
  add_foreign_key "pictures", "users", column: "creator_id"
  add_foreign_key "reports", "users", column: "reporter_id"
end
