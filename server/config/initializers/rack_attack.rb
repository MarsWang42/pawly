class Rack::Attack

  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new
  # Throttle high volumes of requests by IP address
  throttle('req/ip', limit: 20, period: 20.seconds) do |req|
    req.ip
  end

  # Throttle login attempts by IP address
  throttle('logins/ip', limit: 5, period: 60.seconds) do |req|
    if req.path == '/api/v1/user_token' && req.post?
      req.ip
    end
  end

  # Throttle login attempts by email address
  throttle("logins/email", limit: 5, period: 60.seconds) do |req|
    if req.path == '/api/v1/user_token' && req.post?
      JSON.parse(req.body.string)['email'].presence
    end
  end

  # Throttle password forgot attempts by IP address
  throttle('passwords_forgot/ip', limit: 5, period: 5.hours) do |req|
    if req.path == '/api/v1/passwords/forgot' && req.post?
      req.ip
    end
  end

  # Throttle login attempts by email address
  throttle("passwords_forgot/email", limit: 5, period: 5.hours) do |req|
    if req.path == '/api/v1/passwords/forgot' && req.post?
      JSON.parse(req.body.string)['email'].presence
    end
  end
end
