json.id @comment.id
json.author do
  json.id @comment.author.id
  json.username @comment.author.username
  json.avatar @comment.author.avatar.url
end
json.body @comment.body
json.createdAt @comment.created_at
if @comment.target.present?
  json.target do
    json.id = @comment.target.id
    json.username = @comment.target.username
    json.avatar @comment.target.avatar.url
  end
end
