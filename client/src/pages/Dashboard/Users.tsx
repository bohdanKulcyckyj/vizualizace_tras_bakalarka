import React from 'react'
import { ButtonType } from '../../interfaces/IButton';
import Aside from '../../components/Aside';
import Table from '../../components/Table';
import { USER_ALL_USERS } from '../../api/endpoints';
  
  const tableConfig = {
    heading: "",
    colgroup: [30, 30, 20, 20],
    getItemsRoute: USER_ALL_USERS,
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
              <Table config={tableConfig} />
            </div>
        </div>
    </section>
  )
}

export default Users