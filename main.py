from application.app import App
from config import app, database, socketio


def main():
    with app.app_context():
        database.create_all()
    application = App(app=app, socketio=socketio, database=database)
    application.run()


if __name__ == '__main__':
    main()
