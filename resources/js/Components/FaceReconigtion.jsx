import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from 'face-api.js';

export default function FaceRecognition({ width, height, onRecognitionSuccess, setImagem }) {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const videoRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        const loadModels = async () => {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models'),
            ]);
            setModelsLoaded(true);
            startVideo(); // Inicia automaticamente o vídeo após o carregamento dos modelos
        };

        loadModels();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices
            .getUserMedia({ video: { width: 300 } })
            .then(stream => {
                let video = videoRef.current;
                if (video) {
                    video.srcObject = stream;
                    video.play();
                }
            })
            .catch(err => {
                console.error("error:", err);
            });
    };

    const handleVideoOnPlay = () => {
        setInterval(faceMyDetect, 2500);
    };

    const faceMyDetect = async () => {
        if (canvasRef && canvasRef.current && videoRef.current) {
            const video = videoRef.current;
            canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(video);
            const displaySize = {
                width: width,
                height: height
            };
    
            faceapi.matchDimensions(canvasRef.current, displaySize);
    
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
            if (canvasRef.current) {
                const context = canvasRef.current.getContext('2d');
                if (context) {
                    context.clearRect(0, 0, width, height);
                    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                    faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
                    faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
    
                    if (detections.length > 0) {
                 

                        const detection = detections[0]; // Apenas a primeira detecção
                        const confidence = detection.detection.score;
                        const box = detection.detection.box;
                    
    
                      
                        if (confidence >= 0.7) {
                        
                        const faceCanvas = document.createElement('canvas');
                        faceCanvas.width = box.width;
                        faceCanvas.height = box.height;
                        const faceContext = faceCanvas.getContext('2d');
    
                        // Desenha apenas o rosto no novo canvas
                        faceContext.drawImage(video, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);
    
                        // Obtém a imagem do rosto detectado como uma URL de dados
                        const faceImageDataURL = faceCanvas.toDataURL('image/jpeg');
    
                         
                       
                        
        
                         onRecognitionSuccess(faceImageDataURL);
     
      
                        } else {
                            console.log('Arrume a postura');
                        }
                      
                    }
                }
            }
        }
    };

    return (
        <div className="flex justify-center">
            <div className="relative">
                <video ref={videoRef} height={height} width={width} onPlay={handleVideoOnPlay} className="rounded-lg" />
                <canvas ref={canvasRef} className="absolute inset-0" />
            </div>
        </div>
    );
}
