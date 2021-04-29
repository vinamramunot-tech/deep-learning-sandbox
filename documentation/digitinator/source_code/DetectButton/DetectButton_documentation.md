# DetectButton Documentation
*Source code that's referred to below can be found at `./DetectButton.tsx`.*

The `DetectButton` module is most importantly handles the image compression before the hand drawn digit gets passed off to the model for detection.

1. The user clicks the "Detect" button.
2. The code goes into `detectButtonHandler` where it
        1. Creates a 2D rendering context based on the canvas that the user draws on.
        2. Passes the context into `trimToContent` to trim the canvas drawing from the original 300x300 box to the actual space that's used by the drawing, with a little extra padding. This is done to make the user's drawing more closely resemble the MNIST dataset (which the model is based on), to give more accurate detections, especially for smaller numbers.
              1. The 2 `for` loops iterate through each pixel of the 300x300 canvas. It adds the pixel's x and y location to an array *only* if they're not transparent. Pixels are transparent when they've *not* been drawn on.
              2. If the user hasn't drawn anything we return early, so the application doesn't blow up with further processing.
              3. We then sort the pixels. The purpose of this is really just to be able to more easily determine the lowest and highest locations for the x and y coordinates of a pixel.
              4. With the knowledge of those locations we then determine the actual size (in pixels) of what the user drew, as denoted by `resizedWidth` and `resizedHeight`.
              5. With that information a little bit of padding is added around the drawing to more closely resemble the MNIST dataset.
              6. Lastly, we transform the `ImageData` to be this new trimmed and padded version of the user's drawing with the call to `ctx.getImageData`.
        3. The result of `trimToContent` is `ImageData` which is then passed into `convertToBlackAndWhite`.  Which iterates through the pixels changing each one to either black (RGB(0,0,0)) or white (RGB(255,255,255)).  It determines whether a pixel should be black or white based on its alpha (transparency) value. The alpha value will be non-zero if a pixel has been drawn onto, indicating that it should be colored white.  If the alpha value is zero, that means nothing has been drawn on that pixel, meaning it should be black. Again, this is done in effort to more closely resemble the MNIST dataset (white number with a black background) to give more accurate detections.
        4. The result of `convertToBlackAndWhite` then returns `ImageData` that the model then uses to create predictions for numbers 0-9 when calling `detect`.
        5. These predictions are then shown to the user when `setPredictions(predictions)` is called.
        6. The user's original drawing and prediction are then added to the user's session detections with `addSessionDetection(detection)`, so they can go to one place to view all the numbers they've drawn along with what the Digit-Inator thinks they drew.