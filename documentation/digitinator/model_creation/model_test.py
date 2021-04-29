from numpy.random import seed
seed(1)
import tensorflow
tensorflow.random.set_seed(2)
import os
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
from tensorflow.keras.datasets import mnist
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import to_categorical
import time

IMAGES_PATH='./'

def load_dataset():
	(trainX, trainY), (testX, testY) = mnist.load_data()
	trainX = trainX.reshape((trainX.shape[0], 28, 28, 1))
	testX = testX.reshape((testX.shape[0], 28, 28, 1))
	trainY = to_categorical(trainY)
	testY = to_categorical(testY)
	return trainX, trainY, testX, testY

def prep_pixels(train, test):
	train_norm = train.astype('float32')
	test_norm = test.astype('float32')
	train_norm = train_norm / 255.0
	test_norm = test_norm / 255.0
	return train_norm, test_norm

def save_fig(fig_id, tight_layout=True, fig_extension="png", resolution=300):
    path = os.path.join(IMAGES_PATH, fig_id + "." + fig_extension)
    print("Saving figure", fig_id)
    if tight_layout:
        plt.tight_layout()
    plt.savefig(path, format=fig_extension, dpi=resolution)

def run_test():
	start_time = time.time()
	trainX, trainY, testX, testY = load_dataset()
	trainX, testX = prep_pixels(trainX, testX)
	model = load_model('final_model.h5')
	yPred = np.argmax(model.predict(testX), axis=-1)
	yPred_probabilities = model.predict(testX)
	yTest_original = np.argmax(testY, axis=1)
	print('\nClassification report \n=====================')
	print(classification_report(y_true=yTest_original, y_pred=yPred))
	print('\nConfusion report \n=====================')
	print(confusion_matrix(y_true=yTest_original, y_pred=yPred))
	conf_mx = confusion_matrix(yTest_original, yPred)
	row_sums = conf_mx.sum(axis=1, keepdims=True)
	norm_conf_mx = conf_mx / row_sums
	np.fill_diagonal(norm_conf_mx, 0)
	print('\nConfusion matrix error report \n=====================')
	print(f'{norm_conf_mx}\n')
	plt.matshow(conf_mx, cmap=plt.cm.gray)
	save_fig("confusion_matrix_plot", tight_layout=False)
	plt.matshow(norm_conf_mx, cmap=plt.cm.gray)
	save_fig("confusion_matrix_error_plot", tight_layout=False)
	_, acc = model.evaluate(testX, testY, verbose=1)
	print('> %.3f' % (acc * 100.0))
	print('Total time for model testing: %s' % {round(time.time() - start_time, 2)})

run_test()