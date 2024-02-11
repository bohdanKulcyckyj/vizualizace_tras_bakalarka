import React from 'react'
import { ButtonType } from '../../../interfaces/dashboard/Button';
import Aside from '../../../components/Aside';
import Table from '../../../components/dashboard/Table';
import routes from '../../../constants/apiEndpoints';
  
  const tableConfig = {
    heading: "",
    colgroup: [30, 30, 20, 20],
    getItemsRoute: routes.getUsers,
    thead: ["Name", "Email", "Created At", "Delete"],
    tbody: ["name", "email", "createdAt"],
    buttons: [
      {
        type: ButtonType.DELETE,
        label: "Delete",
        actionUrlConstantPart: routes.deleteUser(),
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