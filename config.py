from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from os import environ

app = Flask(__name__)
app.config['SECRET_KEY'] = 'very_secret_string'
app.config['SQLALCHEMY_DATABASE_URI'] = environ['DB_PATH']

socketio = SocketIO(app, cors_allowed_origins="*")

database = SQLAlchemy(app)
