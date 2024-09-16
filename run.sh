#!/bin/bash

# Function to handle Ctrl + C (SIGINT)
trap shutdown_servers SIGINT

# Function to gracefully shutdown servers
shutdown_servers() {
    echo "Shutting down servers..."
    kill $PID_APP
    kill $PID_LEDAPP
    wait $PID_APP
    wait $PID_LEDAPP
    echo "Servers shut down."
    exit 0
}

# Start the first Python server (app.py)
echo "Starting app.py server..."
python3 app.py &
PID_APP=$!
echo "app.py server started with PID: $PID_APP"

# Start the second Python server (pi/ledapp.py)
echo "Starting pi/ledapp.py server..."
python3 pi/ledapp.py &
PID_LEDAPP=$!
echo "pi/ledapp.py server started with PID: $PID_LEDAPP"

# Wait for the servers to keep running
wait $PID_APP
wait $PID_LEDAPP
