import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import * as faceDetection from "@tensorflow-models/face-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { useLocation, useParams } from "react-router-dom";

const VideoPlayer = ({ video_url = "", title = "course" }) => {
  const { course_id } = useParams();
  const location = useLocation();
  const isYouTube = video_url.includes("youtube.com") || video_url.includes("youtu.be");
  const targetPath = useMemo(() => `/courses/course-details/${course_id}/video`, [course_id]);
  const isOnVideoPage = location.pathname === targetPath;

  const videoRef = useRef(null);
  const webcamRef = useRef(null);
  const manualPauseRef = useRef(false);
  const animationRef = useRef(null);
  const [youtubePlayer, setYoutubePlayer] = useState(null);
  const [detector, setDetector] = useState(null);

  // Load Face Detector and YouTube API
  useEffect(() => {
    const loadResources = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      const faceDetector = await faceDetection.createDetector(faceDetection.SupportedModels.MediaPipeFaceDetector, {
        runtime: "tfjs",
        modelType: "short",
      });
      setDetector(faceDetector);

      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.onload = setupYouTubePlayer;
        document.body.appendChild(tag);
      } else {
        setupYouTubePlayer();
      }
    };

    const setupYouTubePlayer = () => {
      const el = document.getElementById("youtube-player");
      if (el && !youtubePlayer) {
        const player = new window.YT.Player("youtube-player", {
          events: {
            onReady: (event) => setYoutubePlayer(event.target),
            onStateChange: (event) => {
              manualPauseRef.current = event.data === window.YT.PlayerState.PAUSED;
            },
          },
        });
      }
    };

    loadResources();
  }, [video_url]);

  const detect = async () => {
    if (!detector || !webcamRef.current || webcamRef.current.readyState !== 4) {
      animationRef.current = requestAnimationFrame(detect);
      return;
    }

    try {
      const faces = await detector.estimateFaces(webcamRef.current);
      const detected = faces.length > 0;

      if (!manualPauseRef.current) {
        if (isYouTube && youtubePlayer) {
          detected ? youtubePlayer.playVideo() : youtubePlayer.pauseVideo();
        } else if (videoRef.current?.isConnected) {
          detected ? videoRef.current.play() : videoRef.current.pause();
        }
      }
    } catch (err) {
      console.error("Face detection error:", err);
    }

    animationRef.current = requestAnimationFrame(detect);
  };
  // Webcam & Detection Logic
  useEffect(() => {
    let detectTimeout;

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
          webcamRef.current.onloadeddata = () => webcamRef.current.play();
        }
      } catch (err) {
        console.error("Webcam error:", err);
      }
    };

    const stopWebcam = () => {
      if (webcamRef.current && webcamRef.current.srcObject) {
        const stream = webcamRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        webcamRef.current.srcObject = null;
      }
    };

   

    if (isOnVideoPage) {
      startWebcam();
      detectTimeout = setTimeout(() => {
        animationRef.current = requestAnimationFrame(detect);
      }, 1000);
    } else {
      stopWebcam();
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      stopWebcam();
      clearTimeout(detectTimeout);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isOnVideoPage, detector, youtubePlayer]);

  // Manual pause tracking for HTML5 video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const trackPause = () => (manualPauseRef.current = video.paused);
    video.addEventListener("play", trackPause);
    video.addEventListener("pause", trackPause);
    return () => {
      video.removeEventListener("play", trackPause);
      video.removeEventListener("pause", trackPause);
    };
  }, []);

  // Pause on tab hidden
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (isYouTube && youtubePlayer) youtubePlayer.pauseVideo();
        else if (videoRef.current) videoRef.current.pause();
        manualPauseRef.current = true;
        cancelAnimationFrame(animationRef.current);
      } else {
        manualPauseRef.current = false;
        if (webcamRef.current && detector) {
          animationRef.current = requestAnimationFrame(() => detect());
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [youtubePlayer, isYouTube, detector]);

  const getYouTubeEmbedUrl = (url) => {
    try {
      const videoId =
        new URL(url).searchParams.get("v") ||
        url.split("youtu.be/")[1]?.split("?")[0] ||
        url.split("shorts/")[1]?.split("?")[0];
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&controls=1`
        : "";
    } catch (e) {
      console.error("Invalid YouTube URL:", e);
      return "";
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%" minHeight="35vh" bgcolor="black" color="white" p={3} position="relative">
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>{title}</Typography>
      <video ref={webcamRef} style={{ display: "none" }} playsInline muted />

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
              />
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
            <video ref={videoRef} width="100%" height="auto" controls style={{ borderRadius: "10px" }}>
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
