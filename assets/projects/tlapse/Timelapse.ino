#include <ESP8266WiFi.h>  
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
extern "C" {
  #include "user_interface.h"
}

#include <Servo.h> 

Servo servo;
const int SERVO_MAX_DEGREE = 180;
const int SERVO_MIN_PULSE_WIDTH = 600;
const int SERVO_MAX_PULSE_WIDTH = 2300;
const float deg2Pul = (SERVO_MAX_PULSE_WIDTH - SERVO_MIN_PULSE_WIDTH) / SERVO_MAX_DEGREE;

const int BAT_MAX = 990;
const int BAT_MIN = 730;

ESP8266WebServer server(80);

float duration;
float degrees;
float interval;

float numShoots;
float step;
float pos;

boolean timerStarted;

void setup() 
{ 
  Serial.begin(115200);
  delay(10);

  Serial.println("Board started");

  pinMode(A0, INPUT);

  WiFi.mode(WIFI_AP);
  wifi_set_sleep_type(LIGHT_SLEEP_T);

  boolean wifi = WiFi.softAP("TLAPSE-ESP8266-AP", "tl123456");
  if(wifi == true) {
    Serial.println("Access Point Ready");
    IPAddress myIP = WiFi.softAPIP();
    Serial.print("AP IP address: ");
    Serial.println(myIP);
    server.on("/", handleRoot);
    server.on("/start", handleStart);
    server.begin();
    server.begin();
    Serial.println("HTTP server started");
  } else {
    Serial.println("Access Point Failed!");
  }
  
  pos = 0;
  servo.attach(D4, SERVO_MIN_PULSE_WIDTH, SERVO_MAX_PULSE_WIDTH);
  servo.write(1500);
}


void loop() 
{ 
  if(timerStarted){
    if(pos <= degrees && pos <= SERVO_MAX_DEGREE){
      servo.writeMicroseconds(SERVO_MIN_PULSE_WIDTH + pos * deg2Pul);
      pos = pos + step;
      Serial.println("Pos Pulse: " + String(SERVO_MIN_PULSE_WIDTH + pos * deg2Pul));
      Serial.println("Pos Deg: " + String(pos));

      delay(interval * 1000);
    } else {
      pos = 0;
      servo.writeMicroseconds(SERVO_MIN_PULSE_WIDTH);
      WiFi.forceSleepWake();
      timerStarted = false;
    }
  } else {
    server.handleClient();
  }
}


void handleRoot() {
  int rawBattery = analogRead(A0);
  float batteryPercentage = (float) (rawBattery - BAT_MIN) / (BAT_MAX - BAT_MIN) * 100;
  Serial.println("Battery percentage: " + String(batteryPercentage));
  Serial.println("Battery AnalogRead: " + String(rawBattery));

  String response = " <!DOCTYPE html> <html> <head> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"> </head> <body> <h2> Timelapse Settings</h2> Battery Percentage: " + String(batteryPercentage) + "%<br> Battery AnalogRead: " + String(rawBattery) + "<br> <br> <form action=\"/start\"> Duration:<br> <input type=\"text\" value=\"10\" name=\"duration\" id=\"duration\" onclick=\"computeStep()\"> <br> Degrees:<br> <input type=\"text\" value=\"180\" name=\"degrees\" id=\"degrees\" onclick=\"computeStep()\"> <br> Interval:<br> <input type=\"text\" value=\"10\" name=\"interval\" id=\"interval\" onclick=\"computeStep()\"> <br> <br> Step:<br> <input type=\"number\" name=\"step\" id=\"step\" readonly> <br> <br> <input type=\"submit\" value=\"Start\"> </form> <script> function computeStep(){var numShoots = document.getElementById(\"duration\").value * 60 / document.getElementById(\"interval\").value; var step = document.getElementById(\"degrees\").value / numShoots; document.getElementById(\"step\").value = step; } </script> </body> </html>";
  server.send(200, "text/html", response);
}

void handleStart() {

  if (server.hasArg("duration") && server.hasArg("degrees") && server.hasArg("interval")){
    duration = server.arg("duration").toFloat();
    Serial.println("Duration: " + String(duration));
    
    degrees = server.arg("degrees").toFloat();
    Serial.println("Degrees: " + String(degrees));

    interval = server.arg("interval").toFloat();
    Serial.println("Interval: " + String(interval));

    
    numShoots = duration * 60 / interval;
    step = degrees / numShoots; // step in degrees

    Serial.println("numShoots: " + String(numShoots));
    Serial.println("step: " + String(step));

    String response = "<!DOCTYPE html> <html> <head> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"> </head> <body> <h2>Timelapse Started</h2> Number of shoots: " + String(numShoots) + "<br>Step: " + String(step) + "<br><a href=\"/\">Home</a> </body> </html>";
    server.send(200, "text/html", response);

    delay(1000);

    timerStarted = true;
    WiFi.forceSleepBegin();

  } else {
    server.sendHeader("Location", String("/"), true);
    server.send ( 302, "text/plain", "");
  }
}
