import base64

class User:
    def __init__(self, name = None, images=None, user_id=None, image_refs=None):
        self.name = name
        self.images = self.__to_base64(images)
        self.user_id = user_id
        self.image_refs = image_refs
        
    def get_name(self):
        return self.name

    def get_images(self):
        return self.images

    def get_user_id(self):
        return self.user_id

    def get_image_refs(self):
        return self.image_refs

    def to_dict(self):
        return {'name': self.name, 'images': self.images} 
    
    def __to_base64(self, images):
        return list(map(lambda i : base64.encodebytes(i.read()).decode("utf-8"), images)) if images is not None else None