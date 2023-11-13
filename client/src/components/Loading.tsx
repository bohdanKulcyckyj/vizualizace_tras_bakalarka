import React, { useEffect } from "react";
import { useMainContext } from "../context/MainContext";

const Loading = () => {
    const { isLoading } = useMainContext();

    useEffect(() => {
        if(isLoading) {
            document.body.classList.add("overflow-y-hidden");
        } else {
            document.body.classList.remove("overflow-y-hidden");
        }
    }, [isLoading])

  return (
    <div className={`loading__container ${isLoading ? "loading__container--active" : ""}`}>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
