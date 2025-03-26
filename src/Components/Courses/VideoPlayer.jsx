import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import * as faceDetection from "@tensorflow-models/face-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { useLocation, useParams } from "react-router-dom";

const VideoPlayer = ({ video_url = "", title = "course" }) => {
  const {course_id} = useParams()
  const videoRef = useRef(null);
  const webcamRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const manualPauseRef = useRef(false);
  const location = useLocation();
  const targetPath = `/courses/course-details/${course_id}/video`;

  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [youtubePlayer, setYoutubePlayer] = useState(null);
  const isYouTube =
    video_url.includes("youtube.com") || video_url.includes("youtu.be");

  // when we go to different path the webcam automatically goes off
  useEffect(() => {
    const stopWebcam = async () => {
      if (webcamRef.current?.srcObject) {
        webcamRef.current.srcObject.getTracks().forEach((track) => track.stop());
        webcamRef.current.srcObject = null;
      }
    };
    
    const result = stopWebcam();
    console.log(result);  // Logs Promise {<pending>} → fulfilled with undefined
  
    // Start webcam only on the target path
    if (location.pathname === targetPath) {
      setIsWebcamActive(true);
    } else {
      setIsWebcamActive(false);
      stopWebcam();  // Stop the webcam when leaving the page
    }
  
    // Cleanup on component unmount
    return () => stopWebcam();
  }, [location.pathname, targetPath]);

  const getYouTubeEmbedUrl = (url) => {
    try {
      const videoId =
        new URL(url).searchParams.get("v") ||
        url.split("youtu.be/")[1]?.split("?")[0] ||
        url.split("shorts/")[1]?.split("?")[0];
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&controls=1`
        : "";
    } catch (error) {
      console.error("Invalid YouTube URL:", error);
      return "";
    }
  };

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      await tf.setBackend("webgl");

      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig = { runtime: "tfjs", modelType: "short" };
      const faceDetector = await faceDetection.createDetector(
        model,
        detectorConfig
      );

      setDetector(faceDetector);
      setIsModelLoaded(true);
    };

    loadModel();
  }, []);

  useEffect(() => {
    const startWebcam = async () => {
      if (!isWebcamActive) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
          webcamRef.current.onloadedmetadata = () => webcamRef.current.play();
        }
      } catch (error) {
        console.error("Webcam access denied:", error);
      }
    };

    startWebcam();

    return () => {
      if (webcamRef.current?.srcObject) {
        webcamRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
        webcamRef.current.srcObject = null;
      }
    };
  }, [isWebcamActive]);

  useEffect(() => {
    if (!isYouTube) return;

    const onYouTubeIframeAPIReady = () => {
      if (!document.getElementById("youtube-player")) return;
      const player = new window.YT.Player("youtube-player", {
        events: {
          onReady: (event) => setYoutubePlayer(event.target),
        },
      });
    };

    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onload = onYouTubeIframeAPIReady;
      document.body.appendChild(script);
    } else {
      onYouTubeIframeAPIReady();
    }
  }, [video_url]);

  useEffect(() => {
    if (!detector || !isModelLoaded) return;

    let animationFrameId;

    const detectFaces = async () => {
      if (!webcamRef.current?.videoWidth || manualPauseRef.current) {
        animationFrameId = requestAnimationFrame(detectFaces);
        return;
      }

      try {
        const faces = await detector.estimateFaces(webcamRef.current);
        const isFaceDetected = faces.length > 0;

        if (isYouTube && youtubePlayer) {
          if (!manualPauseRef.current) {
            isFaceDetected
              ? youtubePlayer.playVideo()
              : youtubePlayer.pauseVideo();
          }
        } else if (!isYouTube && videoRef.current) {
          if (!manualPauseRef.current) {
            isFaceDetected ? videoRef.current.play() : videoRef.current.pause();
          }
        }
      } catch (error) {
        console.error("Face detection error:", error);
      }

      animationFrameId = requestAnimationFrame(detectFaces);
    };

    detectFaces();
    return () => cancelAnimationFrame(animationFrameId);
  }, [detector, isModelLoaded, youtubePlayer]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isYouTube && youtubePlayer) youtubePlayer.pauseVideo();
        if (!isYouTube && videoRef.current) videoRef.current.pause();
        manualPauseRef.current = true;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [youtubePlayer]);

  // Track manual play/pause
  useEffect(() => {
    const handleManualPausePlay = () => {
      if (!isYouTube && videoRef.current) {
        manualPauseRef.current = videoRef.current.paused;
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("play", handleManualPausePlay);
      videoRef.current.addEventListener("pause", handleManualPausePlay);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("play", handleManualPausePlay);
        videoRef.current.removeEventListener("pause", handleManualPausePlay);
      }
    };
  }, [videoRef.current]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
      minHeight="35vh"
      bgcolor="black"
      color="white"
      p={3}
      position="relative"
    >
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        {title}
      </Typography>

      <video ref={webcamRef} style={{ display: "none" }} playsInline />

      <Box position="relative" width="90%" maxWidth="800px">
        {video_url ? (
          isYouTube ? (
            <Box position="relative">
              <iframe
                id="youtube-player"
                width="100%"
                height="400"
                src={getYouTubeEmbedUrl(video_url)}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ borderRadius: "10px" }}
              ></iframe>
              <Typography
                position="absolute"
                top={20}
                left={15}
                bgcolor="rgba(0, 0, 0, 0.6)"
                color="white"
                px={2}
                py={1}
                fontSize="12px"
                borderRadius="5px"
              >
                MindSprint
              </Typography>
            </Box>
          ) : (
            <video
              ref={videoRef}
              width="100%"
              height="auto"
              controls
              style={{ borderRadius: "10px" }}
            >
              <source src={video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )
        ) : (
          <Typography>No video available</Typography>
        )}
      </Box>
    </Box>
  );
};

export default VideoPlayer;
