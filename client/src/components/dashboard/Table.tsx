import { FC, useState, useEffect } from 'react'
import { ITableProps } from '../../interfaces/dashboard/Table'
import { ButtonType, IButton } from '../../interfaces/dashboard/Button'
import { Link } from 'react-router-dom'
import { AiFillPlusCircle } from 'react-icons/ai'
import { toast } from 'sonner'
//buttons
import DeleteButton from './buttons/DeleteButton'
import RedirectButton from './buttons/RedirectButton'
import UnpackButton from './buttons/UnpackButton'
//components
import ConfirmDialog from './ConfirmDialog'

const Table : FC<ITableProps> = ({data, getData, config}) => {
    const [showTheDialog, setShowTheDialog] = useState<boolean>(false)
    const [deleteRoute, setDeleteRoute] = useState<string>('')

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

    const transformColumnData = (_data, _rowIndex) => {
        return (
            <tr key={_rowIndex}>
                {config.tbody.map((_attribute, _dataIndex) => (
                    <td key={_dataIndex}>
                        {_data[_attribute]}
                    </td>
                ))}
                {config.buttons.map((_button, _buttonIndex) => (
                    <td key={config.tbody.length + _buttonIndex}>
                        {retrieveButton(_button, _data)}
                    </td>
                ))}
            </tr>
        )
    }

    useEffect(() => {
        if(showTheDialog) {
            toast(<ConfirmDialog
                showTheDialog={setShowTheDialog}
                setShowTheDialog={setShowTheDialog}
                update={getData}
                deleteRoute={deleteRoute}
            />, { position: 'bottom-center', unstyled: true, duration: 10000, onDismiss: () => setShowTheDialog(false) })
        }
    }, [showTheDialog])

  return (
    <div className="table-component">
        {(config.heading || config.newItemRoute) && <div className="table-component__title flex justify-end my-2">
            {config.newItemRoute && (
                <Link className="flex gap-3" to={config.newItemRoute}>
                    <AiFillPlusCircle className="text-[1.2em] hover:rotate-90 duration-300 ease-in-out"/>
                    <span className="text-[16px] font-normal">{config.newItemRouteLabel}</span>
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
                    return transformColumnData(_col, _index);
                })}
            </tbody>
        </table>
    </div>
  )
}

export default Table