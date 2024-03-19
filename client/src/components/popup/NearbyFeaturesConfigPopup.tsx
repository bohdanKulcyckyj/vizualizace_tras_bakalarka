import { FC, Dispatch, SetStateAction, useState } from "react";
import Select from 'react-select'
import { INearbyFeature } from "../../interfaces/NearbyFeatures";
import { featureOptions } from "../../data/NearbyFeaturesOptions";

interface ISelectOption {
  label: string;
  value: INearbyFeature
}

const NearbyFeaturesConfigPopup: FC<{
  selectedOptions: INearbyFeature[]
  setSelectedOptions: Dispatch<SetStateAction<INearbyFeature[]>>
  onSubmit: () => void;
}> = ({ selectedOptions, setSelectedOptions, onSubmit }) => {

  const toSelectOption = (opt: INearbyFeature) => {
    return {
      label: opt.label,
      value: opt
    }
  }

  const handleChange = (e) => {
    console.log(e)
    setSelectedOptions(e.map((_item: ISelectOption) => _item.value))
  }

  return (
    <div>
      <div className="form">
        <div className="mb-6">
            <label>Select nearby features</label>
            <Select 
              defaultValue={selectedOptions.map(toSelectOption)} 
              options={featureOptions.map(toSelectOption)} 
              closeMenuOnSelect={false} 
              placeholder={"Choose features"}
              onChange={(e) => handleChange(e)}
              isMulti  />
            <div className="flex justify-center mt-10">
              <button className="primary-button" onClick={onSubmit}>Save</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyFeaturesConfigPopup;
