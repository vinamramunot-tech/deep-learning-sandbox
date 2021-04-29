import os
from bson.objectid import ObjectId
import pymongo
from dotenv import load_dotenv

DOTENV_PATH = '../src/.env'
load_dotenv(DOTENV_PATH)
MONGO_CONNECTION = os.getenv('MONGO_CONNECTION') or 'mongodb://127.0.0.1:27017/'

class ImageRepo:

    def __init__(self):
        client = pymongo.MongoClient(MONGO_CONNECTION)
        db = client["user-collection"]
        self.image_table = db["image"]

    def create(self, images: list):
        def insert(image):
            result = self.image_table.insert_one({'img': image})
            return str(result.inserted_id)

        return list(map(insert, images))

    def read(self, ids: list):
        return list(map(lambda id : {'src':self.image_table.find_one({'_id': ObjectId(id)})['img'], 'id':id}, ids))

    def delete(self, ids: list):
        return list(map(lambda id: self.image_table.delete_one({'_id': ObjectId(id)}), ids))
