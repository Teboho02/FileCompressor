'use client'
import { useState, ChangeEvent } from 'react';
import Image from 'next/image';


export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageWidthPercentage, setImageWidthPercentage] = useState<number>(100);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleWidthChange = (percentage: number): void => {
    setImageWidthPercentage(percentage);
  };

  const handleCompress = (): void => {
    // Placeholder for compression logic
    alert('Compress functionality not yet implemented.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200 p-4">
      <h1 className="text-3xl font-bold mb-6">Compress image</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4 w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600"
        />
        
        {selectedImage && (
          <div className="mt-4">
            <Image
              src={selectedImage}
              alt="Selected"
              width={500 * (imageWidthPercentage / 100)}
              height={500}
              className="object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md flex justify-around">
        {[25, 50, 75, 85].map((percentage) => (
          <button
            key={percentage}
            onClick={() => handleWidthChange(percentage)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              imageWidthPercentage === percentage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {percentage}%
          </button>
        ))}
      </div>

      <button
        onClick={handleCompress}
        className="mt-6 px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-500 transition"
      >
        Compress
      </button>
    </div>
  );
}


