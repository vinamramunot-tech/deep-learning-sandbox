import os
import ssl
from dotenv import load_dotenv
from os import environ, path

load_dotenv(path.join(path.abspath(path.dirname(path.dirname(__file__))), '.env'))
DEFAULT_SERVER_IP='0.0.0.0'
DEFAULT_SERVER_PORT='5050'

def get_server_ip():
    return environ.get('SERVER_IP') or DEFAULT_SERVER_IP

def get_server_port():
    return environ.get('SERVER_PORT') or DEFAULT_SERVER_PORT

def get_https_auth_certs():
    context = ssl.SSLContext()
    server_ip = get_server_ip()
    try:
        context.load_cert_chain(f'./{server_ip}.pem', f'./{server_ip}-key.pem')
    except:
        return
    else:
        return context
