package com.example.smartrack;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class login extends AppCompatActivity {

    Button login_btn;
    public EditText police_id_login;
    public EditText password;
    public String jsessionid;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        EditText police_id_login = findViewById(R.id.police_id_login);
        EditText password = findViewById(R.id.password);
        login_btn = findViewById(R.id.login_btn);

        login_btn = findViewById(R.id.login_btn);
        login_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String id = police_id_login.getText().toString();
                String pass = password.getText().toString();

                if (id.equals("") || pass.equals("")) {
                    Toast.makeText(login.this, "Please fill all the fields", Toast.LENGTH_SHORT).show();
                } else {
                    LoginRequest loginRequest = new LoginRequest();
                    loginRequest.setPoliceId(police_id_login.getText().toString());
                    loginRequest.setPolicePassword(password.getText().toString());
                    loginUser(loginRequest);
                }
            }
        });

    }

    public void loginUser(LoginRequest loginRequest) {
        Call<LoginResponse> loginResponseCall = loginApi.getService().login_user(loginRequest);
        loginResponseCall.enqueue(new Callback<LoginResponse>() {
            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                if (response.isSuccessful()) {
                    List<String> Cookielist = response.headers().values("Set-Cookie");
                    String jsessionid = (Cookielist.get(0).split(";"))[0];
                    System.out.println(jsessionid);
                    System.out.println(response);
                    String message = "Logged in";
                    LoginResponse loginResponse = response.body();
                    System.out.println(loginResponse.getPoliceName());

                    SharedPreferences preferences = getSharedPreferences("User_details", MODE_PRIVATE);
                    SharedPreferences.Editor editor = preferences.edit();
                    editor.putString("cookie", jsessionid);
                    editor.putString("userName", loginResponse.getPoliceName());
                    editor.putString("userId", loginResponse.getPoliceId());
                    editor.apply();

                    Toast.makeText(login.this, message, Toast.LENGTH_LONG).show();
                    Intent i = new Intent(login.this, user_home.class);
                    i.putExtra("cookie", jsessionid);
                    startActivity(i);
                    finish();
                } else {
                    String message = "Unable to login. An error occured";
                    Toast.makeText(login.this, message, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                String message = t.getLocalizedMessage();
                Toast.makeText(login.this, message, Toast.LENGTH_LONG).show();
            }
        });
    }
}