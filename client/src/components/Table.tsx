import React from 'react'
import { ITableProps } from '../interfaces/ITable'
import { ButtonType, IButton } from '../interfaces/IButton'
import { Link } from 'react-router-dom'
import { AiFillPlusCircle } from 'react-icons/ai'

const Table : React.FC<ITableProps> = ({config, data}) => {

    const retrieveButton = (buttonData : IButton) => {
        switch(buttonData.type) {
            case ButtonType.REDIRECT:
                return (
                    <button className='redirect-button'>{buttonData.label}</button>
                );
            case ButtonType.DELETE:
                return (
                    <button className='delete-button'>{buttonData.label}</button>
                );
            case ButtonType.UNPACK:
                return (
                    <button className='unpack-button'>{buttonData.label}</button>
                )
            default:
                return (
                    <button className='primaryunpack-button'>{buttonData.label}</button>
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
                        {retrieveButton(_button)}
                    </td>
                ))}
            </tr>
        )
    }

  return (
    <div className="table-component">
        {config.heading || config.newItemRoute && <div className="table-component__title flex justify-end my-2">
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