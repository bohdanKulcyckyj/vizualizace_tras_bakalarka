import { useRef } from "react";
import { axiosWithAuth } from "../../utils/axiosWithAuth";
import gsap from "gsap";

const ConfirmDialog = (props) => {
    const deleteBarRef = useRef();
    if (props.showTheDialog && deleteBarRef.current) {
        gsap.to(deleteBarRef.current, {
            opacity: 1,
            duration: 0.7,
            width: "fit-content",
        });
    }

    const hideTheBar = (deleteItem) => {
        if (deleteBarRef.current) {
            gsap.to(deleteBarRef.current, {
                opacity: 0,
                duration: 0.7,
                width: 0,
                onComplete: function () {
                    props.setShowTheDialog(false);
                    if (deleteItem) {
                        axiosWithAuth
                        .delete(props.deleteRoute)
                        .then((res) => {
                            props.update();
                        });
                    }
                },
            });
        }
    };

    return (
        <div
            className={`confirm-dialog${props.showTheDialog ? ' confirm-dialog--opened' : ''} fixed w-0 opacity-0 overflow-hidden`}
            ref={deleteBarRef}>
            <div className="p-6 flex flex-col justify-center items-center">
                <h2 className="confirm-dialog__title">
                    Are you sure about that?
                </h2>
                <div className="flex gap-5 justify-center items-center mt-5">
                    <button
                        className="confirm-dialog__button confirm-dialog__button--primary"
                        onClick={() => {
                            hideTheBar(true);
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className="confirm-dialog__button confirm-dialog__button--secondary"
                        onClick={() => {
                            hideTheBar(false);
                        }}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;