package com.tutorial.journalApp.service;

import com.tutorial.journalApp.api.response.WeatherResponse;
import com.tutorial.journalApp.cache.AppCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Value("${api_key}")
    private   String API_KEY ;
    private static final String API_URL =
            "https://api.weatherstack.com/current?access_key={apiKey}&query={city}";

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private AppCache appCache;

    public WeatherResponse getWeather(String city) {
        try {
            String finalAPI = appCache.APP_CACHE.get("weather_api").replace("<city>",city).replace("<apiKey>",API_KEY);
            ResponseEntity<WeatherResponse> response = restTemplate.exchange(
                   finalAPI,
                    HttpMethod.GET,
                    null,
                    WeatherResponse.class
            );
            return response.getBody();
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch weather for " + city, e);
        }
    }

    public int getFeelsLike(String city) {
        WeatherResponse weather = getWeather(city);
        if (weather == null || weather.getCurrent() == null) {
            throw new RuntimeException("Weather data unavailable for " + city);
        }
        return weather.getCurrent().getFeelslike();
    }
}
