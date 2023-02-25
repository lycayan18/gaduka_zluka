from flask import Flask, render_template, send_from_directory


def handler_branch(branch=None):
    return render_template('index.html')


def handler_path(img_path):
    return send_from_directory('static/assets', img_path)


def register_main_handlers(app: Flask):
    app.add_url_rule('/', view_func=handler_branch)
    app.add_url_rule('/<path:branch>', view_func=handler_branch)
    app.add_url_rule('/assets/<path:img_path>', view_func=handler_path)
