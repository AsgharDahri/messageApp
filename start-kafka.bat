@echo off
echo Starting Kafka locally...

REM Set Kafka home directory - update this path to your Kafka installation
set KAFKA_HOME=C:\kafka

REM Start Zookeeper
echo Starting Zookeeper...
start "Zookeeper" cmd /k "%KAFKA_HOME%\bin\windows\zookeeper-server-start.bat %KAFKA_HOME%\config\zookeeper.properties"

REM Wait a moment for Zookeeper to start
timeout /t 5 /nobreak > nul

REM Start Kafka
echo Starting Kafka Broker...
start "Kafka" cmd /k "%KAFKA_HOME%\bin\windows\kafka-server-start.bat %KAFKA_HOME%\config\server.properties"

echo Kafka is starting up...
echo Zookeeper and Kafka will run in separate command windows
echo Press any key to exit this script (Kafka will continue running)
pause > nul 