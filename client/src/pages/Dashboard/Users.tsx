import React from 'react'
import { ButtonType } from '../../interfaces/IButton';
import Aside from '../../components/Aside';
import Table from '../../components/Table';

const dummyData = [
    {
        id: 1,
        name: "Petr Klíč",
        email: "petr.klic@seznam.cz",
        createdAt: new Date().toLocaleDateString(),
    },
    {
        id: 2,
        name: "Ivan Gorilko",
        email: "ivan.gorilko@seznam.cz",
        createdAt: new Date().toLocaleDateString(),
    },
    {
        id: 3,
        name: "Zbyněk Vitamvas",
        email: "zbynek.vitamvas@seznam.cz",
        createdAt: new Date().toLocaleDateString(),
    },
    {
        id: 4,
        name: "Prokop Dvěře",
        email: "prokop.dreve@gmail.com",
        createdAt: new Date().toLocaleDateString(),
    },
    {
        id: 4,
        name: "Alžbět Freeman",
        email: "alzbet.freeman@yahoo.com",
        createdAt: new Date().toLocaleDateString(),
    },
  ];
  
  const dummyConfig = {
    heading: "",
    colgroup: [30, 30, 20, 20],
    thead: ["Name", "Email", "Created At", "Delete"],
    tbody: ["name", "email", "createdAt"],
    buttons: [
      {
        type: ButtonType.DELETE,
        label: "Delete",
        actionUrlConstantPart: "/maps/map/",
        actionUrlDynamicPartKey: "id",
      }
    ]
  }

const Users = () => {
  return (
    <section className="page-section mt-[8rem]">
        <div className="page-section__container">
            <h1 className="text-center mb-[6rem]">Users</h1>
            <div className="flex flex-col xl:flex-row">
              <Aside role="admin" />
              <Table config={dummyConfig} data={dummyData} />
            </div>
        </div>
    </section>
  )
}

export default Users