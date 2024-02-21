import React, {
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import gsap from "gsap";
import { IconContext } from "react-icons/lib";
import { GrClose } from "react-icons/gr";

const Popup: React.FC<{
  isPopupOpened: boolean;
  setIsPopupOpened: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  onClose?: () => void;
}> = ({ isPopupOpened, setIsPopupOpened, children, onClose }) => {
  const pricePopupRef = useRef(null);
  const timeline = gsap.timeline({
    defaults: { duration: 0.2, ease: "power1.out" },
  })
  const popupId = Math.random().toString(36).substr(2, 9)

  const togglePopup = (action = null) => {
    const popup = document.querySelector(`#popup-window-${popupId}`);
    if (popup) {
      popup.classList.toggle("active");

      if (
        popup.classList.contains("active") &&
        (!action || action !== "close")
      ) {
        timeline.to(`#popup-window-${popupId}`, { display: "flex" });
        timeline.fromTo(
          `#popup-window__text-${popupId}`,
          { scale: 0, y: 0 },
          { scale: 1, y: 0, opacity: 1, ease: "power1.out", duration: 0.2 }
        );
        setIsPopupOpened(true);
      } else {
        timeline.fromTo(
          `#popup-window__text-${popupId}`,
          { y: 0, opacity: 1 },
          { y: 100, opacity: 0, ease: "power1.out", duration: 0.2 }
        );
        timeline.to(`#popup-window-${popupId}`, {
          display: "none",
          duration: 0.1,
        });
        setIsPopupOpened(false);
      }
    }
  }

  const popupCoverClickHandle = (e) => {
    if (
      pricePopupRef.current !== e.target &&
      !pricePopupRef.current.contains(e.target)
    ) {
      closePopup()
    }
  }

  const closePopup = () => {
    togglePopup("close");
    if(onClose) {
      onClose()
    }
  }

  useEffect(() => {
    togglePopup();
  }, [isPopupOpened]);

  return (
    <>
      {isPopupOpened && (
        <div
          className="popup-window"
          id={"popup-window-" + popupId}
          onClick={(e) => popupCoverClickHandle(e)}
        >
          <div
            ref={pricePopupRef}
            id={"popup-window__text-" + popupId}
            className="popup-window__text pt-4 px-2 sm:px-8 pb-8"
          >
            <div className="flex justify-end mb-2">
              <IconContext.Provider
                value={{
                  size: "20px",
                  className: "popup-window__close-button",
                }}
              >
                <div>
                  <GrClose
                    className="cursor-pointer"
                    onClick={closePopup}
                  />
                </div>
              </IconContext.Provider>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
