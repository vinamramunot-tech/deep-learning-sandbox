import json
from flask import request
from flask_api import status
from src import app
from ..services.error_message_creator import create_error_message
from ..services.user_image_repository import create, read_one, read_all, update_name, update_images, delete
from ..models.user_image_model import User
from src.services.InvalidUserName import InvalidUserName
from src.services.UserNotFound import UserNotFound



MAX_IMAGES_PER_USER = 10
USER_ENDPOINT = '/users'
NO_FILE_MESSAGE = 'No file selected'
OVER_IMAGE_COUNT_MESSAGE = f'Cannot have more than {MAX_IMAGES_PER_USER} images per user'

@app.route(f'{USER_ENDPOINT}/upload_user_profile', methods=['POST'])
def upload_user_profile():
    if not request.form:
        return create_error_message(NO_FILE_MESSAGE), status.HTTP_400_BAD_REQUEST

    name = request.form['user-name']
    images = request.files.getlist('file')

    if len(images) > MAX_IMAGES_PER_USER:
        return create_error_message(OVER_IMAGE_COUNT_MESSAGE), status.HTTP_400_BAD_REQUEST

    user = User(name=name, images=images)

    try:
        response = create(user)
    except InvalidUserName:
        return create_error_message(InvalidUserName.message()), status.HTTP_400_BAD_REQUEST

    return json.dumps(response), status.HTTP_201_CREATED

@app.route(f'{USER_ENDPOINT}/get_all_user_profiles', methods=['GET'])
def get_user_profiles():
    data = read_all()
    return json.dumps(data), status.HTTP_200_OK

@app.route(f'{USER_ENDPOINT}/get_one_user_profile', methods=['POST'])
def get_user_profile():
    if not request.data:
        return create_error_message('No user information was sent'), status.HTTP_400_BAD_REQUEST
    user_id = request.json['user_id'] if 'user_id' in request.json else None
    username = request.json['name'] if 'name' in request.json else None
    user = User(user_id=user_id, name=username)
    
    try:
        data = read_one(user)
    except UserNotFound:
        return create_error_message(UserNotFound.message()), status.HTTP_400_BAD_REQUEST

    return json.dumps(data), status.HTTP_200_OK

@app.route(f'{USER_ENDPOINT}/update_user_profile_images', methods=['PUT'])
def update_user_profile_images():
    if not request.form:
        return create_error_message(NO_FILE_MESSAGE), status.HTTP_400_BAD_REQUEST


    images = request.files.getlist('file')
    user_id = request.form['user_id']

    current_images = read_one(User(user_id=user_id))['images']

    if len(current_images) + len(images) > MAX_IMAGES_PER_USER:
        return create_error_message(OVER_IMAGE_COUNT_MESSAGE), status.HTTP_400_BAD_REQUEST

    user = User(images=images, user_id=user_id)
    update_images(user)
    return '', status.HTTP_204_NO_CONTENT

@app.route(f'{USER_ENDPOINT}/update_user_profile_name', methods=['PUT'])
def update_user_profile_name():
    if not request.data:
        return create_error_message(NO_FILE_MESSAGE), status.HTTP_400_BAD_REQUEST

    name = request.json['name']
    user_id = request.json['user_id']
    user = User(name=name, user_id=user_id)

    try:
        update_name(user)
    except InvalidUserName:
        return create_error_message(InvalidUserName.message()), status.HTTP_400_BAD_REQUEST

    return '', status.HTTP_204_NO_CONTENT

@app.route(f'{USER_ENDPOINT}/delete_from_user', methods=['POST'])
def delete_user_profile():
    if not request.data:
        return create_error_message('Bad Request'), status.HTTP_400_BAD_REQUEST

    delete(request.get_json())
    return '', status.HTTP_200_OK