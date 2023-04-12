package com.example.smartrack;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class user_home extends AppCompatActivity {

    String jsessionid;
    Button logout_btn;
    Button profile;
    Button emergency;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_home);

        SharedPreferences preferences=getSharedPreferences("User_details",MODE_PRIVATE);
        String name = preferences.getString("userName", "abc");
        String id = preferences.getString("userId", "abc");
        jsessionid = preferences.getString("cookie", "abc");

//        SharedPreferences preferences1 = getSharedPreferences("User_profile", MODE_PRIVATE);
//        SharedPreferences.Editor editor = preferences1.edit();
//        editor.putString("cookie", jsessionid);
//        editor.putString("userName", name);
//        editor.putString("userId",id);
//        editor.apply();

        logout_btn = findViewById(R.id.logout_btn);

        profile = findViewById(R.id.profile);
        emergency = findViewById(R.id.emergency);

        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        TextView toolbar_title = findViewById(R.id.toolbar_title);
        // using toolbar as ActionBar
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle(null);
        toolbar_title.setText("Hi"+" "+name);

        profile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(user_home.this,profile.class);
                startActivity(intent);
            }

        });

        emergency.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(user_home.this,replacement.class);
                startActivity(intent);
            }

        });

        logout_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Call<LogoutResponse> appResponseCall = loginApi.getService().logout_user(jsessionid);
                appResponseCall.enqueue(new Callback<LogoutResponse>() {
                    @SuppressLint("SetTextI18n")
                    @Override
                    public void onResponse(Call<LogoutResponse> call, Response<LogoutResponse> response) {

                        LogoutResponse balanceResponse = response.body();
                        System.out.println(balanceResponse.getMessage());
                        Intent intent = new Intent(user_home.this,MainActivity.class);
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

        scheduleNotify();


    }

    private void scheduleNotify()
    {
        Intent notificationIntent = new Intent(this, SendLocation.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(this, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        AlarmManager alarmManager = (AlarmManager)getSystemService(Context.ALARM_SERVICE);
        alarmManager.setInexactRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP,0,1000*60*5,pendingIntent);
    }
}