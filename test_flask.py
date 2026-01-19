from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == '__main__':
    print("Starting Flask app...")
    app.run(debug=True, port=5002, host='0.0.0.0')