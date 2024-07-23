import { useState, useCallback } from "react";
import getCroppedImg from "../../utils/imageUtils";
import Cropper from "react-easy-crop";
import styled from "styled-components";
import { IconChevronLeft } from "../../assets/icons";

const ImageEditor = ({ Image, onCropImage, onFinishEdit, onCancelEdit }) => {
  const [selectedImage, setSelectedImage] = useState(Image);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        selectedImage,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
      onCropImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  const handleRotation = () => {
    setRotation((rotation + 90) % 360);
  };

  const handleCrop = async () => {
    if (!selectedImage) return;
    const croppedImageUrl = await getCroppedImg(selectedImage, crop);
    setCroppedImage(croppedImageUrl);
    showCroppedImage();
    onFinishEdit();
  };

  return (
    <ImageEditorRenderer>
     <span
            title="back"
            className="back"
            onClick={onCancelEdit}
          >
            <IconChevronLeft />| back
          </span>

      <div className="crop-container">
        <Cropper
          image={selectedImage}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={4 / 4}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          rotate={rotation}
        />
      </div>

      <div className="i-ed-btns">
        <button title="Rotate" className="btn-rotate" onClick={handleRotation}>
          Rotate
        </button>
        <button title="Done" className="btn-crop" onClick={handleCrop}>
          Done
        </button>
      </div>
    </ImageEditorRenderer>
  );
};

export default ImageEditor;
const ImageEditorRenderer = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 99;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 15px 30px;

  .crop-container {
    position: relative;
    height: 400px;
    width: 500px;
  }
.back {
    position: absolute;
    top: 14%;
    left: 5px;
    padding: 5px 10px;
    border:1px solid #ededed;
    border-radius: 5px;
    background: #fff;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 99;
  }
  .i-ed-btns button {
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #176984;
    color: #fff;
    font-weight: 500;
    transition: 0.3s ease-in-out;
    border: none;
    margin-top: 10px;
  }
  .i-ed-btns .btn-crop {
    border: 2px solid #176984;
    background-color: transparent;
    color: #176984;
    margin-left: 5px;
  }
  .i-ed-btns button:hover {
    transform: scale(1.01);
  }
`;
