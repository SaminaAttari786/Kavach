package com.example.smartrack;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;

public interface UserService {

    @POST("/police/login")
    Call<LoginResponse> login_user(@Body LoginRequest loginRequest);

    @POST("/police/register")
    Call<LoginResponse> register_user(@Body SignupRequest signupRequest);

    @GET("/police/logout")
    Call<LogoutResponse> logout_user(@Header("Cookie") String cookie);

}
