import { useState } from "react";
import toast from "react-hot-toast";

function useImagePreview() {
  const [imgUrl, setImgUrl] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImgUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Invalid file type");
    }
  }
  return { imgUrl, handleImageChange, setImgUrl };
}

export default useImagePreview;
