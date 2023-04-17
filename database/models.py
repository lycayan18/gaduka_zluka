from config import database


class AnonBranchModel(database.Model):
    __tablename__ = 'anon_branch'
    id = database.Column(database.Integer, primary_key=True)
    time = database.Column(database.String(255))
    text = database.Column(database.Text())
    nickname = database.Column(database.String(255))
    ip = database.Column(database.String(255))
    status = database.Column(database.String(255))
    reply_to = database.Column(database.Integer)

    def __repr__(self):
        return '<AnonBranch %r>'


class AuthBranchModel(database.Model):
    __tablename__ = 'auth_branch'
    id = database.Column(database.Integer, primary_key=True)
    time = database.Column(database.String(255))
    text = database.Column(database.Text())
    token = database.Column(database.String(255))
    ip = database.Column(database.String(255))
    status = database.Column(database.String(255))
    reply_to = database.Column(database.Integer)

    def __repr__(self):
        return '<AuthBranch %r>'


class UsersModel(database.Model):
    __tablename__ = 'users'
    id = database.Column(database.Integer, primary_key=True)
    nickname = database.Column(database.String(255))
    token = database.Column(database.String(255))
    status = database.Column(database.String(255))

    def __repr__(self):
        return '<Users %r>'


class BlacklistModel(database.Model):
    __tablename__ = 'blacklist'
    id = database.Column(database.Integer, primary_key=True)
    ip = database.Column(database.String(255))

    def __repr__(self):
        return '<BlackList %r>'