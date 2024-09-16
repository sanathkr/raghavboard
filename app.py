from flask import Flask, request, jsonify, render_template
import requests

LED_APP_URL = "http://0.0.0.0:8001"

# Flask app initialization
app = Flask(__name__)

# Route to serve index.html (root API route)
@app.route('/')
def index():
    return render_template('index.html')  # Serve the index.html file

# Route to set the colors. Forwards the request to the LED App running on Raspberry PI
@app.route('/set_colors', methods=['POST'])
def set_colors():
    data = request.json

    try:
        response = requests.post(LED_APP_URL + "/set_colors", json=data)
        if response.status_code == 200:
            return jsonify({"message": "Colors updated successfully!"}), 200
        else:
            print(response)
            return jsonify({"error": "Failed to update colors on external server."}), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Request to external server failed: {e}"}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)