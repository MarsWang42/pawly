json.id @comment.id
json.body @comment.body
if @comment.place.target?
  json.target do
    json.id = @comment.target.id
    json.username = @comment.target.username
    json.avatar @comment.target.avatar.url
  end
end
