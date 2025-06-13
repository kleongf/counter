import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const videoRef = useRef(null);
  const START_TIME = 0;

  const [counts, setCounts] = useState(() => {
    const saved = localStorage.getItem('buttonData');
    return saved ? JSON.parse(saved).counts : [0, 0, 0, 0];
  });

  const [timestamps, setTimestamps] = useState(() => {
    const saved = localStorage.getItem('buttonData');
    return saved ? JSON.parse(saved).timestamps : { 0: [], 1: [], 2: [], 3: [] };
  });

  const [markerTime, setMarkerTime] = useState(() => {
    const saved = localStorage.getItem('videoMarker');
    return saved ? parseFloat(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('buttonData', JSON.stringify({ counts, timestamps }));
  }, [counts, timestamps]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const videoURL = URL.createObjectURL(file);
      setVideoFile(videoURL);
    } else {
      alert('Please upload a valid video file.');
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const timeToSeek = markerTime ?? START_TIME;
      videoRef.current.currentTime = timeToSeek;
    }
  };

  const incrementCount = (index) => {
    const time = videoRef.current?.currentTime ?? 0;
    setCounts((prev) => {
      const updated = [...prev];
      updated[index]++;
      return updated;
    });
    setTimestamps((prev) => {
      const updated = { ...prev };
      if (!updated[index]) updated[index] = [];
      updated[index] = [...updated[index], time];
      return updated;
    });
  };

  const decrementCount = (index) => {
    setCounts((prev) => {
      const updated = [...prev];
      updated[index] = Math.max(0, updated[index] - 1);
      return updated;
    });
  };

  const resetCounts = () => {
    setCounts([0, 0, 0, 0]);
    setTimestamps({ 0: [], 1: [], 2: [], 3: [] });
  };

  const saveMarker = () => {
    if (videoRef.current) {
      const marker = videoRef.current.currentTime;
      localStorage.setItem('videoMarker', marker.toString());
      setMarkerTime(marker);
      alert(`Saved marker at ${marker.toFixed(2)} seconds.`);
    }
  };

  const clearMarker = () => {
    localStorage.removeItem('videoMarker');
    setMarkerTime(null);
    alert('Marker cleared.');
  };

  return (
    <div className="flex flex-col p-8 font-sans h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Transportation Counter</h1>

      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <div className="flex flex-1 w-full">
        <div className="flex-1 max-w-1/2 h-full flex justify-center items-start">
          {videoFile && (
            <video
              src={videoFile}
              ref={videoRef}
              onLoadedMetadata={handleLoadedMetadata}
              controls
              className="max-h-screen max-w-[50vw] rounded object-contain"
              // className="h-full max-w-[50vw] border border-gray-300 rounded"
            />
          )}
        </div>

        <div className="w-1/2 flex flex-col items-center">
          {videoFile && (
            <div className="mb-6 text-center">
              <button
                onClick={saveMarker}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
              >
                Save Timestamp
              </button>
              <button
                onClick={clearMarker}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear Timestamp
              </button>
              {markerTime !== null && (
                <div className="mt-2 text-sm text-gray-700">
                  Current saved marker: {markerTime.toFixed(2)}s
                </div>
              )}
            </div>
          )}

          {/* <div className="grid grid-cols-2 gap-6">
            {['Bike', 'E-bike', 'Vehicle', 'Pedestrian'].map((label, index) => (
              <div key={label} className="text-center">
                <button
                  onClick={() => incrementCount(index)}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 mr-2"
                >
                  + {label}
                </button>
                <button
                  onClick={() => decrementCount(index)}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                >
                  - {label}
                </button>
                <div className="mt-2 font-semibold">Count: {counts[index]}</div>
              </div>
            ))}
          </div> */}

          <div className="grid grid-cols-2 gap-6">
            {['Bike', 'E-bike', 'Vehicle', 'Pedestrian'].map((label, index) => (
              <div key={label} className="text-center">
                <button
                  onClick={() => incrementCount(index)}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 mr-2"
                >
                  +
                </button>
                <button
                  onClick={() => decrementCount(index)}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                >
                  -
                </button>
                <div className="mt-2 font-semibold">{label}: {counts[index]}</div>
              </div>
            ))}
          </div>

          <button
            onClick={resetCounts}
            className="mt-6 bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800"
          >
            Reset All Counts
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;





