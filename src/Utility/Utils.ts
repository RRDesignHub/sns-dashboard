// src/Utility/Utils.ts
import axios from "axios";

const imageUpload = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEBB_KEY}`,
    formData,
  );

  return data.data.display_url;
};

export default imageUpload;
