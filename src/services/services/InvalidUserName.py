class InvalidUserName(Exception):
    @staticmethod
    def message():
        return 'Name was either not unique or contained only spaces'
