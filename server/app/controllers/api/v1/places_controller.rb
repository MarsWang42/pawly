class Api::V1::PlacesController < ApiController
  before_action :authenticate_user

  def nearby
    @user = current_user
    # @places = Place.near([params[:latitude], params[:longitude]], params[:radius])
    sw = Geokit::LatLng.new(
      params[:latitude] - params[:latitude_delta],
      params[:longitude] - params[:longitude_delta]
    )
    ne = Geokit::LatLng.new(
      params[:latitude] + params[:latitude_delta],
      params[:longitude] + params[:longitude_delta]
    )
    @places = Place.in_bounds([sw, ne]).all
    @places.map do |place|
      place.pictures = place.pictures.left_joins(:likers).group(:id).order('COUNT(*) DESC').limit(10)
      place
    end
    render :list
  end

  private
end
