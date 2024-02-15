import React, { Dispatch, SetStateAction } from "react";
import {
  IHandleFileUploadOptions,
  handleFileUpload,
} from "../../utils/handleFIleUpload";
import { MdOutlineFileUpload } from "react-icons/md";
import { IconContext } from "react-icons";

const PinPopup: React.FC<{
  isPopupOpened: boolean;
  setIsPopupOpened: Dispatch<SetStateAction<boolean>>;
  formState: any;
  setFormState: any;
}> = () => {
  const handleUploadImage = async (e) => {
    const options: IHandleFileUploadOptions = {
      allowedFormats: ["image/jpeg", "image/png", "image/gif", "image/jpg"],
      allowedSizeInMB: 10,
    };
    handleFileUpload({ file: e.target.files[0], options })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <div className="form">
        <div className="mb-6">
          <div className="mb-2">
            <label htmlFor="image">Images</label>
          </div>
          <div className="form__input--file mb-2">
            <label>
              <IconContext.Provider
                value={{
                  color: "#2EEBC9",
                  size: "30px",
                  className: "upload-icon",
                }}
              >
                <span>
                  <MdOutlineFileUpload />
                </span>
              </IconContext.Provider>
              <input
                name="image"
                type="file"
                placeholder="image"
                onChange={(e) => handleUploadImage(e)}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinPopup;
