import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
  Box,
} from "@chakra-ui/react";
import Cropper from "react-easy-crop";
import { cropImage } from "../../utils/helper";

const ImageCrop = ({ open, image, onComplete, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const handleCropComplete = async () => {
    try {
      const croppedImageDataURL = await cropImage(
        imageSrc,
        croppedAreaPixels,
        console.log
      );
      onComplete(croppedImageDataURL);
    } catch (error) {
      toast.error("Error cropping image:", error);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Box
            width={"100%"}
            height={"300px"}
            position="relative"
            background="#333"
          >
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={(_, croppedAreaPixels) => {
                setCroppedAreaPixels(croppedAreaPixels);
              }}
              onZoomChange={onZoomChange}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleCropComplete}>
            Finish
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

ImageCrop.propTypes = {
  open: PropTypes.bool.isRequired,
  image: PropTypes.instanceOf(File),
  onComplete: PropTypes.func,
  onClose: PropTypes.func,
};

ImageCrop.defaultProps = {
  open: false,
};

export default ImageCrop;
