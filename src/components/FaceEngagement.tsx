import React, { useEffect, useRef, useState } from 'react';
import { useEngagement } from '../hooks/EngagementContext';

export const FaceEngagement: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { setEngagementData } = useEngagement();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modelStatus, setModelStatus] = useState<string>('Initializing...');
  
  // Add participation tracking state
  const participationRef = useRef({
    lastDetectionTime: Date.now(),
    totalDetections: 0,
    activeDetections: 0,
    expressionChanges: 0,
    lastExpression: '',
    sessionStart: Date.now()
  });

  useEffect(() => {
    let isMounted = true;

    const cleanup = () => {
      console.log('Cleaning up camera resources...');
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          console.log('Stopping track:', track.kind);
          track.stop();
        });
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    const initializeFaceDetection = async () => {
      try {
        // Step 1: Load face-api.js models FIRST
        console.log('Loading face-api.js models...');
        setModelStatus('Loading face detection models...');
        
        const faceapi = await import('face-api.js');
        console.log('face-api.js imported successfully');
        
        // Try different model paths
        const modelPaths = [
          './models',
          '/models',
          '/public/models',
          './public/models'
        ];
        
        let modelsLoaded = false;
        
        for (const modelPath of modelPaths) {
          try {
            console.log(`Trying to load models from: ${modelPath}`);
            setModelStatus(`Loading from: ${modelPath}`);
            
            await Promise.all([
              faceapi.nets.tinyFaceDetector.loadFromUri(`${modelPath}/tiny_face_detector`),
              faceapi.nets.faceExpressionNet.loadFromUri(`${modelPath}/face_expression`),
              faceapi.nets.faceLandmark68Net.loadFromUri(`${modelPath}/face_landmark_68`)
            ]);
            
            console.log(`Models loaded successfully from: ${modelPath}`);
            modelsLoaded = true;
            break;
            
          } catch (pathError) {
            console.log(`Failed to load from ${modelPath}:`, pathError);
            continue;
          }
        }
        
        if (!modelsLoaded) {
          throw new Error('Could not load face-api models from any path');
        }
        
        if (!isMounted) return;
        
        // Step 2: Request camera access AFTER models are loaded
        console.log('Models loaded, requesting camera...');
        setModelStatus('Requesting camera access...');
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480,
            facingMode: 'user' 
          } 
        });
        
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        streamRef.current = stream;
        console.log('Camera access granted');
        
        // Step 3: Set up video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          console.log('Video element ready');
        }
        
        // Step 4: Wait a bit for video to stabilize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!isMounted) {
          cleanup();
          return;
        }
        
        setIsLoading(false);
        setModelStatus('Face detection active');
        
        // Initialize participation tracking
        participationRef.current = {
          lastDetectionTime: Date.now(),
          totalDetections: 0,
          activeDetections: 0,
          expressionChanges: 0,
          lastExpression: '',
          sessionStart: Date.now()
        };
        
        // Step 5: Start face detection
        const startDetection = () => {
          intervalRef.current = setInterval(async () => {
            if (!isMounted || !videoRef.current || videoRef.current.readyState < 2) return;
            
            try {
              const detection = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({
                  inputSize: 416,
                  scoreThreshold: 0.5
                }))
                .withFaceLandmarks()
                .withFaceExpressions();

              const currentTime = Date.now();
              const participation = participationRef.current;
              
              if (detection && detection.expressions && detection.landmarks) {
                const { 
                  happy = 0, 
                  neutral = 0, 
                  sad = 0, 
                  angry = 0, 
                  surprised = 0,
                  fearful = 0,
                  disgusted = 0
                } = detection.expressions;

                // Simplified participation tracking
                participation.totalDetections++;
                participation.lastDetectionTime = currentTime;
                
                // Much simpler participation calculation
                // Base participation: just being present and detected = 40 points
                const baseParticipation = 40;
                
                // Engagement bonus: any non-sad/angry expression = bonus points
                const engagementBonus = (happy + surprised + neutral) * 40;
                
                // Expression activity: any significant expression = bonus
                const expressionActivity = Math.max(happy, surprised, neutral) * 30;
                
                // Face presence bonus: consistent detection = 10 points
                const presenceBonus = 10;
                
                // Simple participation score (much more generous)
                const participationScore = Math.min(100, Math.round(
                  baseParticipation + engagementBonus + expressionActivity + presenceBonus
                ));

                // Calculate engagement based on expressions
                const positiveExpressions = happy + surprised;
                const neutralExpression = neutral;
                const negativeExpressions = sad + angry + fearful + disgusted;
                
                // Basic engagement scoring
                const expressionScore = (positiveExpressions + neutralExpression * 0.7) * 100;
                const attentionScore = Math.max(0, (1 - negativeExpressions) * 100);
                
                // Eye gaze estimation using landmarks
                let gazeScore = 50; // Default
                if (detection.landmarks) {
                  const leftEye = detection.landmarks.getLeftEye();
                  const rightEye = detection.landmarks.getRightEye();
                  const nose = detection.landmarks.getNose();
                  
                  if (leftEye && rightEye && nose) {
                    // Simple gaze estimation based on eye-nose alignment
                    const leftEyeCenter = leftEye.reduce((sum, point) => 
                      ({ x: sum.x + point.x, y: sum.y + point.y }), { x: 0, y: 0 });
                    leftEyeCenter.x /= leftEye.length;
                    leftEyeCenter.y /= leftEye.length;
                    
                    const rightEyeCenter = rightEye.reduce((sum, point) => 
                      ({ x: sum.x + point.x, y: sum.y + point.y }), { x: 0, y: 0 });
                    rightEyeCenter.x /= rightEye.length;
                    rightEyeCenter.y /= rightEye.length;
                    
                    const eyeCenter = {
                      x: (leftEyeCenter.x + rightEyeCenter.x) / 2,
                      y: (leftEyeCenter.y + rightEyeCenter.y) / 2
                    };
                    
                    const noseCenter = nose[Math.floor(nose.length / 2)];
                    const alignment = Math.abs(eyeCenter.x - noseCenter.x);
                    
                    // Higher alignment score means better attention
                    gazeScore = Math.max(0, Math.min(100, 100 - alignment * 2));
                  }
                }
                
                // Much simpler comprehension: neutral + positive expressions
                const comprehensionScore = Math.min(100, Math.round(
                  (neutralExpression * 60) + (positiveExpressions * 40) + 20 // Base 20 points
                ));
                
                // More generous overall engagement calculation
                const engagementScore = Math.round(
                  (expressionScore * 0.25 + attentionScore * 0.25 + participationScore * 0.25 + comprehensionScore * 0.25)
                );

                let level: 'high' | 'medium' | 'low' = 'low';
                if (engagementScore > 70) level = 'high';
                else if (engagementScore > 40) level = 'medium';

                if (isMounted) {
                  setEngagementData(data => ({
                    ...data,
                    score: Math.max(0, Math.min(100, engagementScore)),
                    level,
                    focusMetrics: {
                      attention: Math.round(gazeScore),
                      participation: Math.max(0, Math.min(100, participationScore)),
                      comprehension: Math.max(0, Math.min(100, comprehensionScore)),
                    },
                  }));
                }

                console.log('Engagement detected:', {
                  score: engagementScore,
                  level,
                  expressions: {
                    happy: Math.round(happy * 100),
                    neutral: Math.round(neutral * 100),
                    surprised: Math.round(surprised * 100)
                  },
                  participation: participationScore,
                  comprehension: comprehensionScore,
                  gaze: Math.round(gazeScore)
                });
                
              } else {
                console.log('No face detected');
                // Reset participation tracking when no face is detected
                const timeSinceLastDetection = currentTime - participation.lastDetectionTime;
                if (timeSinceLastDetection > 5000) { // 5 seconds
                  participation.expressionChanges = Math.max(0, participation.expressionChanges - 1);
                }
                
                if (isMounted) {
                  setEngagementData(data => ({
                    ...data,
                    score: 0,
                    level: 'low',
                    focusMetrics: {
                      attention: 0,
                      participation: Math.max(0, data.focusMetrics.participation - 5), // Slower decrease
                      comprehension: 0,
                    },
                  }));
                }
              }
            } catch (detectionError) {
              console.error('Face detection error:', detectionError);
            }
          }, 2000);
        };

        startDetection();
        
      } catch (error) {
        console.error('Initialization error:', error);
        if (isMounted) {
          setError(`Initialization failed: ${error.message}`);
          setIsLoading(false);
          setModelStatus('Initialization failed');
        }
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (isMounted) {
        initializeFaceDetection();
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      cleanup();
    };
  }, [setEngagementData]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Return hidden video element - camera works but isn't visible
  return (
    <div style={{ display: 'none' }}>
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        playsInline
        style={{ 
          width: '200px', 
          height: '150px'
        }} 
      />
      {/* Optional: Add a small status indicator if you want to show camera is active */}
      {!error && !isLoading && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          📹 Face Detection Active
        </div>
      )}
    </div>
  );
};