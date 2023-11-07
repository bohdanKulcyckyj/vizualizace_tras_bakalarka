import React from 'react'
import { ButtonType } from '../interfaces/IButton';
import Table from '../components/Table';
import Aside from '../components/Aside';

const dummyData = [
  {
      id: 1,
      createdAt: new Date().toLocaleDateString(),
      label: "Everest",
  },
  {
      id: 2,
      createdAt: new Date().toLocaleDateString(),
      label: "Mont Blank",
  },
  {
      id: 3,
      createdAt: new Date().toLocaleDateString(),
      label: "Springfield",
  },
  {
      id: 4,
      createdAt: new Date().toLocaleDateString(),
      label: "Ternopil",
  },
];

const dummyConfig = {
  heading: "",
  colgroup: [30, 25, 15, 15, 15],
  newItemRoute: "/maps/new",
  newItemRouteLabel: "new map",
  thead: ["Label", "Created at", "View", "Edit", "Delete"],
  tbody: ["label", "createdAt"],
  buttons: [
    {
      type: ButtonType.REDIRECT,
      label: "View",
      actionUrlConstantPart: "/maps/map/",
      actionUrlDynamicPartKey: "id",
    },
    {
      type: ButtonType.REDIRECT,
      label: "Edit",
      actionUrlConstantPart: "/maps/map/",
      actionUrlDynamicPartKey: "id",
    },
    {
      type: ButtonType.DELETE,
      label: "Detele",
      actionUrlConstantPart: "/maps/map/",
      actionUrlDynamicPartKey: "id",
    }
  ]
}

const Dashboard = () => {
  return (
    <section className="page-section mt-[8rem]">
        <div className="page-section__container">
            <h1 className="text-center mb-[6rem]">Your maps</h1>
            <div className="flex flex-col xl:flex-row">
              <Aside role="admin" />
              <Table config={dummyConfig} data={dummyData} />
            </div>
        </div>
    </section>
  )
}

export default Dashboard