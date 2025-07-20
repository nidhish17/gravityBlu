from peewee import CharField, SqliteDatabase, Model, BooleanField, IntegerField, ForeignKeyField, BigIntegerField
import os
from threading import Lock

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# print(BASE_DIR)
DB_PATH = os.path.join(BASE_DIR, "user.db")
db = SqliteDatabase(DB_PATH)
DB_LOCK = Lock()


class User(Model):
    user_save_location = CharField(null=True)
    ask_quality_everytime = BooleanField(default=False)
    quality = IntegerField(null=True, default=1080)

    class Meta:
        database = db


class Download(Model):
    user = ForeignKeyField(User, backref="downloads")
    title = CharField(default="video title")
    duration = CharField(null=True)
    save_loc = CharField(null=True)
    resolution = CharField(null=True)
    thumb_link = CharField(null=True)
    size = BigIntegerField(null=True)
    type = CharField(null=True)

    class Meta:
        database = db


def init_db():
    with db:
        db.create_tables([User, Download], safe=True)
        User.get_or_create(id=1)


def get_user():
    return User.get(id=1)


def add_download(d_type, title, duration, resolution, thumbnail, filesize, save_loc):
    with DB_LOCK:
        user = get_user()
        download = Download.create(
            user=user,
            title=title,
            duration=duration,
            save_loc=save_loc,
            resolution=resolution,
            thumb_link=thumbnail,
            size=filesize,
            type=d_type
        )

    return download


def get_downloads(user_id = 1, page: int = 1):
    query = (
        Download
        .select()
        .where(Download.user_id == user_id)
        .order_by(Download.id.desc())
        .limit(10)
        .offset((page - 1) * 10)
    )

    return list(query)




# db.connect()
# db.create_tables([User])
# db.close()

# user table will have user_save_location column and a foreign key to the table that has the user's downloaded videos...
