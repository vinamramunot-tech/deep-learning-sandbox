# Server Starts

1. /src/\_\_init\_\_.py
  1. Instantiates Flask object named app, sets necessary Flask environment variables such as:
    1. Base path to app is set
    2. Path to the image and video upload is set using the base path
  2. Creates and sets image and video extensions with create\_case\_insensitive\_extensions() (e.g., .jpg, .jpeg, .png, .gif, .mp4)
  3. Imports the necessary modules from "src" such as the controllers, yolo, and services. Modules inside "controllers", "yolo", "services" are made accessible by creating a \_\_init\_\_.py inside each folder. [init package](https://docs.python.org/3/tutorial/modules.html#packages)
2. Run `python main.py`
  1. Subprocess calls pyclean to clear cache
  2. os.environ[&#39;TF\_CPP\_MIN\_LOG\_LEVEL&#39;] = &#39;2&#39; disables the log message for using GPU
  3. app.run() to open port 5050 on &quot;0.0.0.0&quot; localhost with debug mode &#39;True&#39;
3. /src/controllers/\_\_init\_\_.py
  1. Declares and calls the function publicize\_python\_files(). This function makes the python files (.py) in the /src/controllers/ directory public by assigning them to the built-in python global \_\_all\_\_. This lets /src/\_\_init\_\_.py import the controller at server start