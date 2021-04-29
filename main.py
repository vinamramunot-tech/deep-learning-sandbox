import subprocess
from src import app, socketio, server_ip, server_port
from src.services.server_protocol import get_https_auth_certs, DEFAULT_SERVER_IP
import os

if __name__ == '__main__':
    subprocess.check_call(["pyclean", "."])
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
    if (server_ip == DEFAULT_SERVER_IP):
        socketio.run(app, host=server_ip, port=server_port, debug=True)
    elif not get_https_auth_certs():
        socketio.run(app, host=DEFAULT_SERVER_IP, port=server_port, debug=True)
    else:
        socketio.run(app, host=server_ip, port=server_port, ssl_context=get_https_auth_certs())
