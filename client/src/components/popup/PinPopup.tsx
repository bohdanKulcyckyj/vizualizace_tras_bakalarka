import React, { Dispatch, SetStateAction } from "react";
import {
  IHandleFileUploadOptions,
  handleFileUpload,
} from "../../utils/handleFileUpload";
import { MdOutlineFileUpload } from "react-icons/md";
import { IconContext } from "react-icons";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IMapObjectOptions, PIN_TYPE } from "../../interfaces/dashboard/Map";
import { PIN_COLORS } from "../../interfaces/dashboard/Map";
import { Color } from "three";

const PinPopup: React.FC<{
  formState: IMapObjectOptions;
  setFormState: Dispatch<SetStateAction<IMapObjectOptions>>;
  onSubmit: () => void;
}> = ({ formState, setFormState, onSubmit }) => {
  const handleUploadImage = async (e) => {
    const options: IHandleFileUploadOptions = {
      allowedFormats: ["image/jpeg", "image/png", "image/gif", "image/jpg"],
      allowedSizeInMB: 10,
    };
    handleFileUpload({ file: e.target.files[0], options })
      .then((res) => {
        const newFormState = formState
        if(newFormState?.images) {
          newFormState.images.push(res.data.file)
        } else {
          newFormState.images = [res.data.file]
        }
        setFormState({...newFormState})
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <div className="form">
        <div className="mb-6">
          <div className="mb-8">
            <label htmlFor="image">New Pin</label>
          </div>
          <div className="mb-2">
            <input
              className="w-full"
              name="point-label"
              type="text"
              placeholder="Label"
              value={formState?.label ?? ""}
              onChange={(e) => {
                setFormState({ ...formState, label: e.target.value });
              }}
            />
          </div>
          {formState.pinType === PIN_TYPE.PIN_SIGN && (
            <div className="pins-container flex gap-2">
              {formState && Object.values(PIN_COLORS).map((_value, _index) => {
                return (
                <div
                  key={_index}
                  className={(String(formState.color) == _value.toString() ? "active " : "") + "cursor-pointer"}
                  onClick={() =>
                    setFormState({
                      ...formState,
                      color: _value.toString(),
                    })
                  }
                >
                  <IconContext.Provider
                    value={{
                      color: `${_value.toString()}`,
                      size: "30px",
                      className: "pin-icon",
                    }}
                  >
                    <span>
                      <FaMapMarkerAlt />
                    </span>
                  </IconContext.Provider>
                </div>
              )})}
            </div>
          )}
          {formState.pinType === PIN_TYPE.PIN_IMAGE && (
            <div className="mt-6">
              <label className="block mb-2" htmlFor="image">Upload image</label>
              <div className="form__input--file max-w-[200px] mb-2">
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
              {formState?.images?.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {formState.images.map((_image) => (
                    <div>
                      <img
                        className="w-full h-full object-cover"
                        src={_image}
                        alt="WanderMap3D - new pin"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex justify-center mt-10">
            <button className="primary-button" onClick={onSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinPopup;