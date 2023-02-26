from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SECRET_KEY'] = 'very_secret_string'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gaduka_zluka.db'

socketio = SocketIO(app)

database = SQLAlchemy(app)
