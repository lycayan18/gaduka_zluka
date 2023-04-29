from flask import render_template, send_from_directory, request
from flask_socketio import send
from os import environ

from application.managers.sid_manager import SidManager
from application.managers.user_manager import UserManager
from config import app, socketio, database
from application.managers.branch_manager import BranchManager
from database.database_manager import DatabaseManager
from application.utils.logger import log_message

with app.app_context():
    database.create_all()

database_manager = DatabaseManager(database=database, maximum_number=10000)

user_manager = UserManager(database=database_manager)
sid_manager = SidManager(database=database_manager)
branch_manager = BranchManager(database=database_manager, user_manager=user_manager, sid_manager=sid_manager)


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
    # print(query)  # Disable logging into console

    branch_manager.handle_message(ip=request.remote_addr, sid=request.sid, query=query, callback=send)


@socketio.on('disconnect')
def disconnect_handler():
    log_message({
        "type": "disconnect",
        "sid": request.sid,
        "ip": request.remote_addr
    })

    sid_manager.disconnect_user(sid=request.sid)
    user_manager.unauthorize_user(sid=request.sid)
    branch_manager.disconnect_user_from_branch(request.sid, callback=send)


@socketio.on('connect')
def connect_handler():
    log_message({
        "type": "connect",
        "sid": request.sid,
        "ip": request.remote_addr
    })

    sid_manager.connect_user(sid=request.sid, ip=request.remote_addr)


if __name__ == '__main__':
    socketio.run(app=app, host=environ['HOST'], port=8080, debug=True)
