import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getTokenFromCookie } from '../utils/jwt'
import { ITableProps } from '../interfaces/ITable'
import { ButtonType, IButton } from '../interfaces/IButton'
import { Link } from 'react-router-dom'
import { AiFillPlusCircle } from 'react-icons/ai'
//buttons
import DeleteButton from './Buttons/DeleteButton'
import RedirectButton from './Buttons/RedirectButton'
import UnpackButton from './Buttons/UnpackButton'
//components
import ConfirmDialog from './ConfirmDialog'

const Table : React.FC<ITableProps> = ({config}) => {
    const [data, setData] = useState<any[]>([])
    const [showTheDialog, setShowTheDialog] = useState<boolean>(false)
    const [deleteRoute, setDeleteRoute] = useState<string>('')
    const [update, updateState] = useState<number>(0)

    const forceUpdate = () => {
        updateState(update + 1)
    }

    useEffect(() => {
        let token = getTokenFromCookie()
        const requestConfig = {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
        axios.get(config.getItemsRoute, requestConfig)
        .then(res => setData(res.data))
        .catch(err => console.error(err))
        //axios.get('https://localhost:7214/gpx/export2.gpx', requestConfig)
        //.then(res => console.log(res))
        //.catch(err => console.error(err))
    }, [update])

    const retrieveButton = (buttonData : IButton, rowData: any) => {
        switch(buttonData.type) {
            case ButtonType.REDIRECT:
                return (
                    <RedirectButton data={buttonData} rowData={rowData} />
                )
            case ButtonType.DELETE:
                return (
                    <DeleteButton 
                        data={buttonData}
                        rowData={rowData}
                        setShowTheDialog={setShowTheDialog}
                        setDeleteRoute={setDeleteRoute}
                    />
                )
            case ButtonType.UNPACK:
                return (
                    <UnpackButton data={buttonData} />
                )
            default:
                return (
                    <button className='primary-button'>{buttonData.label}</button>
                )
        }
    }

    const transformColumnData = (_data) => {
        return (
            <tr>
                {config.tbody.map((_attribute, _index) => (
                    <td key={_index}>
                        {_data[_attribute]}
                    </td>
                ))}
                {config.buttons.map((_button, _index) => (
                    <td key={100 + _index}>
                        {retrieveButton(_button, _data)}
                    </td>
                ))}
            </tr>
        )
    }

  return (
    <div className="table-component">
        <ConfirmDialog
            showTheDialog={showTheDialog}
            setShowTheDialog={setShowTheDialog}
            update={forceUpdate}
            deleteRoute={deleteRoute}
        />

        {(config.heading || config.newItemRoute) && <div className="table-component__title flex justify-end my-2">
            {config.newItemRoute && (
                <Link className="flex gap-3" to={config.newItemRoute}>
                    <span className="text-[16px] font-normal">{config.newItemRouteLabel}</span>
                    <AiFillPlusCircle className="text-[1.2em] hover:rotate-90 duration-300 ease-in-out"/>
                </Link>
            )}
            {config.heading && <h2>{config.heading}</h2>}
        </div>}
        <table className="table-component__table">
            <colgroup>
                {config.colgroup.map((_colWidth, _index) => (
                    <col key={_index} style={{width: _colWidth + "%"}} />
                ))}
            </colgroup>
            <thead>
                <tr>
                    {config.thead.map((_label, _index) => (
                        <th key={_index}>{_label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((_col, _index) => {
                    return transformColumnData(_col);
                })}
            </tbody>
        </table>
    </div>
  )
}

export default Table