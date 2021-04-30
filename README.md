# Deep Learning Sandbox

---

### Cloning the repo

1. `git clone https://github.com/vinamramunot-tech/deep-learning-sandbox.git`
2. `cd deep-learning-sandbox`
3. `git lfs install`
4. `git lfs fetch`
5. `git lfs checkout`

----

### How to install requirements

* Run `pip install -r requirements.txt`

### How to download weights

* Run with Python3 `python build.py` or `python3 build.py`

### PyTorch is required for the voice cloning feature, install based on your OS:

    ### Linux Installation

    1. `pip3 install torch==1.8.0+cpu -f https://download.pytorch.org/whl/torch_stable.html` or `pip install torch==1.8.0+cpu -f https://download.pytorch.org/whl/torch_stable.html`

    ### MacOS Installation

    1. `brew install ffmpeg`
    2. `pip3 install torch`

    ### Windows Installation

    1. Install package manager chocolatey from https://chocolatey.org/install
    2. `choco install ffmpeg`
    3. `pip3 install torch==1.8.0+cpu -f https://download.pytorch.org/whl/torch_stable.html` or `pip install torch==1.8.0+cpu -f https://download.pytorch.org/whl/torch_stable.html`

---

### Environment file setup

* Create a `.env` file inside of the `src` folder
* Reference `env_example.txt`
* Edit `SERVER_IP=YOUR_IP` and `SERVER_PORT=YOUR_PORT` in the `.env` file with the correct ip of the machine and the port number of your choice

```python
# .env
YOLO_THRESHOLD='0.1'
SOCKETIO_ASYNC_MODE=threading
MONGO_CONNECTION='mongodb+srv://<username>:<password>@cluster0.vypct.mongodb.net/test?retryWrites=true&w=majority'
SERVER_IP=YOUR_IP
SERVER_PORT=YOUR_PORT
```

# Setup the project with HTTPS

1. [Create ssl certificates](#ssl-certification-creation)
2. [Set Env File](#environment-file-setup)

---

### SSL certification creation

> **Please replace the word "server-ip" with the ip address of the machine where the app will run in all of the steps below.**
> **Once you complete the setup for creating pem files using the above line, the name of the two files server-ip.pem and server-ip-key.pem will be replaced with the ip address.**

#### Linux

1. Run `./install_dependencies.sh`
2. `git clone https://github.com/FiloSottile/mkcert && cd mkcert`
3. `go build -ldflags "-X main.Version=$(git describe --tags)"`
4. `./mkcert "server-ip"`
5. `cd ..`
6. `cd Senior-Capstone-Project`
7. `cp ../mkcert/server-ip.pem ../mkcert/server-ip-key.pem .`

#### Windows

##### mkcert with choco
1. `choco install mkcert`
2. Change your directory to `Senior-Capstone-Project`
3. `.\mkcert "server-ip"`

> Install Go Lang for these steps [Go Lang](https://golang.org/dl/)
##### mkcert as a standalone
1. `git clone https://github.com/FiloSottile/mkcert && cd mkcert`
2. `go build -ldflags "-X main.Version=$(git describe --tags)"`
3. `.\mkcert "server-ip"`
4. Copy the files `server-ip-key.pem` and `server-ip.pem` into `Senior-Capstone-Project`

#### MacOS

##### mkcert with brew
1. `brew install mkcert`
2. `cd Senior-Capstone-Project`
3. `mkcert "server-ip"`

> Install Go Lang for these steps [Go Lang](https://golang.org/dl/)
##### mkcert as a standalone
1. `git clone https://github.com/FiloSottile/mkcert && cd mkcert`
2. `go build -ldflags "-X main.Version=$(git describe --tags)"`
3. `./mkcert "server-ip"`
4. `cd ..`
5. `cd Senior-Capstone-Project`
6. `cp ../mkcert/server-ip.pem ../mkcert/server-ip-key.pem .`

---

### How to Execute

* Run with Python3 `python main.py` or `python3 main.py`

---
