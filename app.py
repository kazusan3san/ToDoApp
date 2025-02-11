# app.py
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import json

app = Flask(__name__)

# MongoDBに接続
client = MongoClient('mongodb://localhost:27017/')
db = client['todo_db']
collection = db['todos']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/todos', methods=['GET'])
def get_todos():
    todos = list(collection.find({}, {'_id': False}))
    return jsonify(todos)

@app.route('/api/todos', methods=['POST']) 
def add_todo():
    data = request.get_json()
    todo = {
        'title': data['title'],
        'completed': False
    }
    collection.insert_one(todo)
    return jsonify({'message': '追加成功'})

@app.route('/api/todos/<title>', methods=['PUT'])
def update_todo(title):
    collection.update_one(
        {'title': title},
        {'$set': {'completed': True}}
    )
    return jsonify({'message': '更新成功'})

@app.route('/api/todos/<title>', methods=['DELETE'])
def delete_todo(title):
    collection.delete_one({'title': title})
    return jsonify({'message': '削除成功'})

if __name__ == '__main__':
    app.run(debug=True)


