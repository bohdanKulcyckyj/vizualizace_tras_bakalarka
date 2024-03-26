import { useState, useEffect } from 'react'
import { ButtonType } from '../../interfaces/dashboard/Button'
import Table from '../../components/dashboard/Table'
import Aside from '../../components/Aside'
import routes from '../../constants/routes'
import { UserRole } from '../../interfaces/User'
import { IMapDTO } from '../../interfaces/dashboard/MapModel'
import { axiosWithAuth } from '../../utils/axiosWithAuth'
import apiEndpoints from '../../constants/apiEndpoints'
import { toast } from 'sonner'

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

const Maps = ({ role }) => {
  const [data, setData] = useState<IMapDTO[]>([])

  const getData = async () => {
    try {
      const res = await axiosWithAuth.get(apiEndpoints.getUserMaps)
      const formattedData = res.data.map((_row) => {
        if (Object.hasOwn(_row, 'createdAt')) {
          const tmpCreatedAt = new Date(_row.createdAt).toLocaleDateString()
          return {
            ..._row,
            createdAt: tmpCreatedAt,
          }
        }
      })
      setData(formattedData as IMapDTO[])
    } catch (e) {
      toast.error('Unable to fetch map data')
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <section className='page-section mt-[8rem]'>
      <div className='page-section__container'>
        <h1 className='text-center mb-[6rem]'>My maps</h1>
        <div className='flex flex-col xl:flex-row'>
          <Aside role={role} />
          <Table data={data} getData={getData} config={tableConfig(role)} />
        </div>
      </div>
    </section>
  )
}

export default Maps
