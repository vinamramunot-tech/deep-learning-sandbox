import os
from src.services.UserNotFound import UserNotFound
from src.services.InvalidUserName import InvalidUserName
from bson.objectid import ObjectId
import pymongo
from dotenv import load_dotenv
from src.services.error_message_creator import create_error_message
from ..models.user_image_model import User
from ..services.image_repository import ImageRepo

DOTENV_PATH = '../src/.env'
load_dotenv(DOTENV_PATH)
MONGO_CONNECTION = os.getenv('MONGO_CONNECTION') or 'mongodb://127.0.0.1:27017/'

client = pymongo.MongoClient(MONGO_CONNECTION)
db = client["user-collection"]
user_table = db["user"]
image_table = ImageRepo()

def create(user: User):
    if user_already_exists(user) or user_name_is_blank(user.get_name()):
        raise InvalidUserName

    new_user = user.to_dict()
    image_refs = image_table.create(user.get_images())
    new_user['images'] = image_refs
    return str(user_table.insert_one(new_user).inserted_id)
    
def read_all():
    return list(map(lambda user: { 'name': user['name'], 'images': image_table.read(user['images']), '_id': str(user['_id']) }, user_table.find()))

def read_one(user: User):
    found_user = get_user_by_username(user.get_name()) if not user.get_user_id() else get_user_by_id(user.get_user_id())
    if not found_user:
        raise UserNotFound
    return (lambda user : { 'name': user['name'], 'images': image_table.read(user['images']), '_id': str(user['_id']) })(found_user)

def update_name(user: User):
    name = user.get_name()
    user_id = user.get_user_id()

    if username_did_not_change(user):
        return
    
    if user_already_exists(user) or user_name_is_blank(name):
        raise InvalidUserName
        
    user_table.find_one_and_update({'_id': ObjectId(user_id)}, {'$set': {'name': name}})

    
def update_images(user: User):
    images = user.get_images()
    user_id = user.get_user_id()

    if images is not None:
        image_refs = image_table.create(images)
        user_to_update = user_table.find_one({'_id': ObjectId(user_id)})
        user_to_update['images'] += image_refs
        user_table.update_one({'_id': ObjectId(user_id)}, {'$set': {'images': user_to_update['images']}})

def delete(user_dict):
    image_list = []

    if 'user_id' not in user_dict:
        raise create_error_message('Bad Request')

    if user_dict['image_id'] == '':
        image_list = user_table.find_one({'_id': ObjectId(user_dict['user_id'])})['images']
        image_table.delete(image_list)
        return user_table.delete_one({'_id': ObjectId(user_dict['user_id'])})

    user = user_table.find_one({'_id': ObjectId(user_dict['user_id'])})
    user['images'].remove(user_dict['image_id'])
    user_table.find_one_and_update({'_id': ObjectId(user_dict['user_id'])}, 
                                            {'$set': {'images': user['images']}})
    image_list.append(user_dict['image_id'])

    image_table.delete(image_list)

def get_user_by_id(user_id):
    return user_table.find_one({'_id': ObjectId(user_id)}) if isinstance(user_id, str) else None

def get_user_by_username(username):
    return user_table.find_one({'name': username}) if isinstance(username, str) else None

def user_already_exists(user: User):
    return bool(user_table.find_one({'name': user.get_name()}))

def username_did_not_change(user: User):
    return read_one(user)['name'] == user.get_name()

def user_name_is_blank(name: str):
    return not name or name.isspace()
