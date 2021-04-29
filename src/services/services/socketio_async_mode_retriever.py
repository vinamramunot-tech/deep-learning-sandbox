from os import environ

async_modes = {
    'threading': 'threading',
    'eventlet': 'eventlet',
    'gevent': 'gevent',
}

def retrieve():
    return environ.get('SOCKETIO_ASYNC_MODE') or async_modes['threading']