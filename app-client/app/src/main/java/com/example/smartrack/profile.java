package com.example.smartrack;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class profile extends AppCompatActivity {
    String jsessionid;
    TextView user_name;
    TextView user_id;
    Button logout_btn2;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        SharedPreferences preferences=getSharedPreferences("User_details",MODE_PRIVATE);
        String name = preferences.getString("userName", "abc");
        String id = preferences.getString("userId", "abc");
        jsessionid = preferences.getString("cookie", "abc");

        user_name = findViewById(R.id.user_name);
        user_id = findViewById(R.id.user_id);

        user_name.setText(name);
        user_id.setText(id);

        logout_btn2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Call<LogoutResponse> appResponseCall = loginApi.getService().logout_user(jsessionid);
                appResponseCall.enqueue(new Callback<LogoutResponse>() {
                    @SuppressLint("SetTextI18n")
                    @Override
                    public void onResponse(Call<LogoutResponse> call, Response<LogoutResponse> response) {

                        LogoutResponse balanceResponse = response.body();
                        System.out.println(balanceResponse.getMessage());
                        Intent intent = new Intent(profile.this,MainActivity.class);
                        finishAffinity();
                        startActivity(intent);
                    }

                    @Override
                    public void onFailure(Call<LogoutResponse> call, Throwable t) {
                        String message = t.getLocalizedMessage();
                        System.out.println(message);
                    }
                });
            }
        });




    }
}