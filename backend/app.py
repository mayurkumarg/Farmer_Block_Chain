from flask import Flask, jsonify, request
from flask_cors import CORS
from blockchain import Blockchain

app = Flask(__name__)
CORS(app) # Crucial: Allows React to talk to Flask

# Initialize Blockchain
farmer_db = Blockchain()

@app.route('/mine', methods=['GET'])
def mine():
    last_block = farmer_db.last_block
    last_proof = last_block['proof']
    proof = farmer_db.proof_of_work(last_proof)
    previous_hash = farmer_db.hash(last_block)
    block = farmer_db.create_block(proof, previous_hash)
    
    return jsonify({
        'message': "New Block Mined",
        'index': block['index'],
        'records': block['records'],
        'hash': farmer_db.hash(block)
    }), 200

@app.route('/add_farmer', methods=['POST'])
def add_farmer():
    values = request.get_json()
    required = ['name', 'crop', 'amount']
    if not all(k in values for k in required):
        return 'Missing values', 400

    index = farmer_db.add_record(values['name'], values['crop'], values['amount'])
    return jsonify({'message': f'Farmer data will be added to Block {index}'}), 201

@app.route('/chain', methods=['GET'])
def get_chain():
    response = {
        'chain': farmer_db.chain,
        'length': len(farmer_db.chain),
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)