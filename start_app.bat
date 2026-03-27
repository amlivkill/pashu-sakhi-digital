@echo off
echo Starting Local Server for Pashu Sakhi Digital...
echo.
echo ---------------------------------------------------
echo  INSTRUCTIONS FOR MOBILE TESTING:
echo  1. Ensure your Mobile is connected to the SAME WiFi as this PC.
echo  2. Open Chrome on your Mobile.
echo  3. Type the following URL:
echo.
echo     http://192.168.2.199:8080
echo.
echo  4. To Install as App: Tap Menu (3 dots) -> Add to Home Screen.
echo ---------------------------------------------------
echo.
python -m http.server 8080
pause
