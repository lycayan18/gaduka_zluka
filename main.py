from flask import render_template, send_from_directory, request
from flask_socketio import send

from config import app, socketio, database
from application.branch_manager import BranchManager
from database.database_manager import DatabaseManager

with app.app_context():
    database.create_all()

database_manager = DatabaseManager(database=database)
branch_manager = BranchManager(database=database_manager)


@app.route('/')
@app.route('/<path:branch>')
def handler_branch(branch=None):
    return render_template('index.html')


@app.route('/<path:branch>/static/<path:file_path>')
def handler_path(branch, file_path):
    return send_from_directory('static/', file_path)


@app.route('/assets/<path:file_path>')
def handler_assets(file_path):
    return send_from_directory('static/assets', file_path)


@socketio.on('message')
def message_handler(query: dict):
    print(query)
    branch_manager.handle_message(query=query, callback=send)


@socketio.on('disconnect')
def message_disconnect():
    branch_manager.disconnect_user_from_branch(request.sid, callback=send)


if __name__ == '__main__':
    socketio.run(app=app, host='192.168.0.109', port=8080, debug=True)
