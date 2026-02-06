import Lottie from "lottie-react";
import loadingAnimation from "./../../assets/Loading.json";
const Loading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Lottie animationData={loadingAnimation} />
    </div>
  )
}

export default Loading

