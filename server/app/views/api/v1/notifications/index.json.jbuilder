json.notificationCount @notifications.where(:read => false).size
json.notifications(@notifications) do |notification|
  json.notifiedBy do
    json.id notification.notified_by.id
    json.username notification.notified_by.username
    json.facebookId notification.notified_by.facebook_id
    json.avatar notification.notified_by.avatar.url
  end
  json.id notification.id
  json.type notification.notice_type
  json.createdAt notification.created_at
  json.read notification.read

  if notification.picture.present?
    json.picture do
      json.pictureId notification.picture.id
      json.image notification.picture.image.url
      json.timestamp notification.picture.created_at
      json.creator do
        json.id notification.picture.creator.id
        json.username notification.picture.creator.username
        json.avatar notification.picture.creator.avatar.url
        json.facebookId notification.picture.creator.facebook_id
      end
      json.pets(notification.picture.pets) do |pet|
        json.id pet.id
        json.name pet.name
        json.avatar pet.avatar.url
        json.type pet.type
        json.isRescue pet.is_rescue
      end
      if notification.picture.place.present?
        json.place do |place|
          json.placeId notification.picture.place.id
          json.name notification.picture.place.name
          json.latitude notification.picture.place.latitude
          json.longitude notification.picture.place.longitude
        end
      end
      json.caption notification.picture.caption
      json.liked @user.liked?(notification.picture)
      json.likerLength notification.picture.likers.length
      json.commentLength notification.picture.comments.length
    end
  end
end

