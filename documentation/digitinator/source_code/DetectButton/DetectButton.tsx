  
import React, { MutableRefObject, useContext } from 'react';
import detect from '../../services/mnist/numberDetection';
import GradientButton from '../shared/buttons/GradientButton';
import IconText from '../shared/IconText';
import { FiBarChart2 } from 'react-icons/fi';
import { HasLoadedModelContext } from '../../services/HasLoadedModelContext';
import ErrorMessage from '../shared/ErrorMessage';
import LoadingSpinner from '../shared/LoadingSpinner';
import { detectButtonText } from './detectButtonText';
import { Detection } from '../../types/Detection';

interface DetectButtonProps {
    canvasRef: MutableRefObject<HTMLCanvasElement>;
    setPredictions: (predictions: number[]) => void;
    addSessionDetection: (detection: Detection) => void;
}

const DetectButton = ({ canvasRef, setPredictions, addSessionDetection }: DetectButtonProps) => {
    const hasntLoadedModel = !useContext(HasLoadedModelContext);

    return (
        <>
            <GradientButton onClick={() => { detectButtonHandler(canvasRef.current, setPredictions, addSessionDetection) }} disabled={hasntLoadedModel}>
                <>
                    <IconText icon={<FiBarChart2 />} text={detectButtonText} />{" "}
                    &nbsp;<LoadingSpinner isLoading={hasntLoadedModel} />
                </>
            </GradientButton>
            <br />
            <ErrorMessage isShown={hasntLoadedModel}>The model is currently loading, please wait.</ErrorMessage>
        </>
    );
}

const detectButtonHandler = async (
    canvas: HTMLCanvasElement,
    setPredictions: (predictions: number[]) => void,
    addSessionDetection: (detection: Detection) => void
) => {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as any;
    const predictions = await detect(convertToBlackAndWhite(trimToContent(ctx)));
    setPredictions(predictions);

    const detection = { image: canvas.toDataURL(), predictions: [...predictions] };
    addSessionDetection(detection);
};

const trimToContent = (ctx: CanvasRenderingContext2D): ImageData => {
    const canvas = ctx.canvas;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const pixels = { x: [] as number[], y: [] as number[] };
    for (let y = 0; y < canvasHeight; y++) {
        for (let x = 0; x < canvasWidth; x++) {
            const currentPixelAlphaIndex = ((y * canvasWidth + x) * 4) + 3;
            const isNotTransparent = imageData.data[currentPixelAlphaIndex] > 0;
            if (isNotTransparent) {
                pixels.x.push(x);
                pixels.y.push(y);
            }
        }
    }

    const hasntDrawnAnything = pixels.x.length <= 0;
    if (hasntDrawnAnything) return imageData;

    const sortFunction = (a: any, b: any): any => a - b;
    pixels.x.sort(sortFunction);
    pixels.y.sort(sortFunction);

    const FIRST_PIXEL_INDEX = 0;
    const lastPixelIndex = pixels.x.length - 1;

    const resizedWidth = pixels.x[lastPixelIndex] - pixels.x[FIRST_PIXEL_INDEX] + 1;
    const resizedHeight = pixels.y[lastPixelIndex] - pixels.y[FIRST_PIXEL_INDEX] + 1;

    const PADDING_FACTOR = 0.3;
    const paddingStart = resizedHeight * PADDING_FACTOR;
    const paddingEnd = paddingStart * 2;
    return ctx.getImageData(
        pixels.x[0] - paddingStart,
        pixels.y[0] - paddingStart,
        resizedWidth + paddingEnd,
        resizedHeight + paddingEnd
    );
}

// Mutates the passed in imageData
const convertToBlackAndWhite = (imageData: ImageData): ImageData => {
    const WHITE = 255;
    const BLACK = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
        const redIndex = i;
        const greenIndex = i + 1;
        const blueIndex = i + 2;
        const alphaIndex = i + 3;

        const colorValueResult = imageData.data[alphaIndex] !== 0 ? WHITE : BLACK;
        imageData.data[redIndex] = colorValueResult;
        imageData.data[greenIndex] = colorValueResult;
        imageData.data[blueIndex] = colorValueResult;
        imageData.data[alphaIndex] = colorValueResult;
    }

    return imageData;
};

export default DetectButton;