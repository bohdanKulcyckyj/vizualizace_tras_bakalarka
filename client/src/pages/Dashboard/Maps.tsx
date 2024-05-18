import { ButtonType } from '../../interfaces/dashboard/Button'
import Table from '../../components/dashboard/Table'
import Aside from '../../components/Aside'
import routes from '../../constants/routes'
import { UserRole } from '../../interfaces/User'
import apiEndpoints from '../../constants/apiEndpoints'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUserMap, getUserMaps } from '../../api/maps'
import Loading from '../../components/Loading'
import { useMainContext } from '../../context/MainContext'

const tableConfig = (userType: UserRole) => ({
  heading: '',
  colgroup: [20, 15, 15, 15, 20, 15],
  getItemsRoute:
    userType === UserRole.ADMIN
      ? apiEndpoints.getAllUsersMaps
      : apiEndpoints.getUserMaps,
  newItemRoute: routes.dashboard.newMap(userType),
  newItemRouteLabel: 'new map',
  thead: ['Label', 'Created at', 'Overview', 'Model', 'Map', 'Delete'],
  tbody: ['name', 'createdAt'],
  buttons: [
    {
      type: ButtonType.REDIRECT,
      label: 'View model',
      actionUrlConstantPart: `/map-model/`,
      actionUrlDynamicPartKey: 'id',
      newWindow: true,
    },
    {
      type: ButtonType.REDIRECT,
      label: 'Edit model',
      actionUrlConstantPart: `/${userType.toString()}/map-model/`,
      actionUrlDynamicPartKey: 'id',
    },
    {
      type: ButtonType.REDIRECT,
      label: 'Select map area',
      actionUrlConstantPart: `/${userType.toString()}/map/`,
      actionUrlDynamicPartKey: 'id',
    },
    {
      type: ButtonType.DELETE,
      label: 'Delete map',
      actionUrlConstantPart: apiEndpoints.deleteMap(),
      actionUrlDynamicPartKey: 'id',
    },
  ],
})

const Maps = () => {
  const { loggedUser } = useMainContext()
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryFn: getUserMaps,
    queryKey: ["userMaps"],
  })

  const { mutateAsync: handleDeleteMap } = useMutation({
    mutationFn: async (url: string) => deleteUserMap(url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMaps'] })
    } 
  })

  if(!data) {
    return <Loading />
  }

  return (
    <section className='page-section mt-[8rem]'>
      <div className='page-section__container'>
        <h1 className='text-center mb-[6rem]'>My maps</h1>
        <div className='flex flex-col xl:flex-row'>
          <Aside />
          <Table data={data ?? []} handleDelete={handleDeleteMap} config={tableConfig(loggedUser.role)} />
        </div>
      </div>
    </section>
  )
}

export default Maps
