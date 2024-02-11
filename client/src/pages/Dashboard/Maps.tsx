import { ButtonType } from '../../interfaces/dashboard/Button';
import Table from '../../components/dashboard/Table';
import Aside from '../../components/Aside';
import apiRoutes from '../../constants/apiEndpoints';
import routes from '../../constants/routes';
import { UserRole } from '../../interfaces/User';

const tableConfig = (userType: UserRole) => ({
  heading: "",
  colgroup: [25, 15, 15, 15, 15, 15],
  getItemsRoute: userType === UserRole.ADMIN ? apiRoutes.getAllUsersMaps : apiRoutes.getUserMaps,
  newItemRoute: routes.dashboard.newMap(userType),
  newItemRouteLabel: "new map",
  thead: ["Label", "Created at", "View model", "Model", "Map", "Delete"],
  tbody: ["name", "createdAt"],
  buttons: [
    {
      type: ButtonType.REDIRECT,
      label: "View",
      actionUrlConstantPart: `/map-model/`,
      actionUrlDynamicPartKey: "id",
    },
    {
      type: ButtonType.REDIRECT,
      label: "Edit",
      actionUrlConstantPart: `/${userType.toString()}/map-model/`,
      actionUrlDynamicPartKey: "id",
    },
    {
      type: ButtonType.REDIRECT,
      label: "Edit",
      actionUrlConstantPart: `/${userType.toString()}/map/`,
      actionUrlDynamicPartKey: "id",
    },
    {
      type: ButtonType.DELETE,
      label: "Delete",
      actionUrlConstantPart: apiRoutes.deleteMap(),
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