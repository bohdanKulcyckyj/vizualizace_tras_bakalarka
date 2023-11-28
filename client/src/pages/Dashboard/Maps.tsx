import React from 'react';
import { ButtonType } from '../../interfaces/IButton';
import Table from '../../components/Table';
import Aside from '../../components/Aside';
import { MAP_ALL_MAPS, MAP_DELETE, MAP_USER_MAPS } from '../../api/endpoints';

const tableConfig = (userType: string) => ({
  heading: "",
  colgroup: [30, 25, 15, 15, 15],
  getItemsRoute: userType === "admin" ? MAP_ALL_MAPS : MAP_USER_MAPS,
  newItemRoute: `/${userType}/maps/new`,
  newItemRouteLabel: "new map",
  thead: ["Label", "Created at", "View", "Edit", "Delete"],
  tbody: ["name", "createdAt"],
  buttons: [
    {
      type: ButtonType.REDIRECT,
      label: "View",
      actionUrlConstantPart: `/map/`,
      actionUrlDynamicPartKey: "id",
    },
    {
      type: ButtonType.REDIRECT,
      label: "Edit",
      actionUrlConstantPart: `/${userType}/maps/edit/`,
      actionUrlDynamicPartKey: "id",
    },
    {
      type: ButtonType.DELETE,
      label: "Delete",
      actionUrlConstantPart: MAP_DELETE,
      actionUrlDynamicPartKey: "id",
    }
  ]
});

const Maps = ({ role }) => {
  return (
    <section className="page-section mt-[8rem]">
        <div className="page-section__container">
            <h1 className="text-center mb-[6rem]">Your maps</h1>
            <div className="flex flex-col xl:flex-row">
              <Aside role={role} />
              <Table config={tableConfig(role)} />
            </div>
        </div>
    </section>
  )
}

export default Maps