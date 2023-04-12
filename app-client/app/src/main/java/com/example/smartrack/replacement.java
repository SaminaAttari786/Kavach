package com.example.smartrack;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class replacement extends AppCompatActivity {
    Button emergency_req;
    TextView alloted_police;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_replacement);

        emergency_req=findViewById(R.id.emergency_req);
        alloted_police=findViewById(R.id.alloted_police);

        emergency_req.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                alloted_police.setText("Name: Sumit Chavan, Police ID: 1234");
                alloted_police.setVisibility(View.VISIBLE);
            }
        });


    }
}