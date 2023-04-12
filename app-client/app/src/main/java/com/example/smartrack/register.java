package com.example.smartrack;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class register extends AppCompatActivity {
    EditText username;
    EditText password;
    EditText confpass;
    EditText police_id;
    EditText usercontact;
    Button register_btn;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        username = findViewById(R.id.username);
        usercontact = findViewById(R.id.usercontact);
        password = findViewById(R.id.password);
        confpass=findViewById(R.id.confpass);
        police_id = findViewById(R.id.police_id);
        register_btn = findViewById(R.id.register_btn);

        register_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String name = username.getText().toString();
                String pass = password.getText().toString();
                String confirmpass = confpass.getText().toString();
                String id = police_id.getText().toString();
                String contact = usercontact.getText().toString();


                SignupRequest signupRequest = new SignupRequest();
                signupRequest.setPoliceName(username.getText().toString());
                signupRequest.setPoliceNumber(usercontact.getText().toString());
                signupRequest.setPolicePassword(password.getText().toString());


                registerUser(signupRequest);
            }
        });


    }

    public void registerUser(SignupRequest signupRequest) {
        Call<LoginResponse> signupResponseCall = loginApi.getService().register_user(signupRequest);
        signupResponseCall.enqueue(new Callback<LoginResponse>() {
            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                if (response.isSuccessful()) {

                    LoginResponse signupResponse = response.body();
                    String message = "Logged in";
                    Toast.makeText(register.this, message, Toast.LENGTH_LONG).show();
                    startActivity(new Intent(register.this, login.class));
                    finish();
                } else {
                    String message = "Unable to register. An error occured";
                    Toast.makeText(register.this, message, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                String message = t.getLocalizedMessage();
                Toast.makeText(register.this, message, Toast.LENGTH_LONG).show();
            }
        });
    }
}