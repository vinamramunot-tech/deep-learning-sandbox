class UserNotFound(Exception):
    @staticmethod
    def message():
        return 'Username not found'
