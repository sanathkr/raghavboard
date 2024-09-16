from flask import Flask, request, jsonify, render_template
import platform

# Flask app initialization
app = Flask(__name__)

# Detect if running on Raspberry Pi by checking the platform
is_raspberry_pi = platform.system() != 'Darwin'  # 'Darwin' is for macOS

# Neopixel initialization only on Raspberry Pi
if is_raspberry_pi:
    import board
    import neopixel
    PIXEL_PIN = board.D18  # GPIO pin connected to the NeoPixels
    NUM_PIXELS = 40  # Number of NeoPixels
    ORDER = neopixel.GRB  # Color order (depends on your NeoPixels, can also be RGB or other)
    
    # Create NeoPixel object
    pixels = neopixel.NeoPixel(PIXEL_PIN, NUM_PIXELS, brightness=0.2, auto_write=False, pixel_order=ORDER)
else:
    # Mock the pixels object for testing on macOS
    class MockPixels:
        def __setitem__(self, index, color):
            print(f"Set pixel {index} to color {color}")
        
        def show(self):
            print("Updated Neopixel display")
    pixels = MockPixels()

# Route to handle the pixel color array
@app.route('/set_colors', methods=['POST'])
def set_colors():
    data = request.json
    if not isinstance(data, list) or len(data) > 100:
        return jsonify({"error": "Invalid input. Must be an array with up to 100 elements."}), 400

    for i, color in enumerate(data):
        if len(color) != 3 or not all(0 <= val <= 255 for val in color):
            return jsonify({"error": f"Invalid color values at index {i}. Must be RGB values between 0 and 255."}), 400
        # Set the color for each pixel
        pixels[i] = (color[0], color[1], color[2])

    pixels.show()  # Update the LED strip
    return jsonify({"message": "Colors updated successfully!"}), 200

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001)