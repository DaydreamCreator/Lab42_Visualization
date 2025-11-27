from flask import Flask, request, jsonify
from ai_service import get_analysis

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    category = data.get('category')
    sequence = data.get('sequence')
    date = data.get('date')
    roomid = data.get('roomid')
    floor = data.get('floor')
    attribute = data.get('attribute')
    model = data.get('model')
    cluster = data.get('cluster')
    #print(sequence, date, roomid, floor, attribute, model)
    if not sequence or not date or not roomid or not floor or not attribute or not model:
        print("Missing required fields")
        print(sequence, date, roomid, floor, attribute, model)
        return jsonify({"message": "Missing required fields"}), 400
    
    result = get_analysis(attribute, category, sequence, floor, date, roomid, cluster, model)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

