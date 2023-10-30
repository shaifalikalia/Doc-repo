import React from 'react'
import styles from './Preferences.module.scss'
import Table from 'components/table'
import './IPTable.scss'

function IPTable({  onEdit, actionsDisabled, onStatusChange, onDelete, IPs, t }) {

    IPs = IPs.map(it => ({ ...it, actionsDisabled }))

    const columns = [{
        attrs: { datatitle: t('accountOwner.nameOfIP') },
        dataField: 'name',
        text: t('accountOwner.nameOfIP')
    },
    {
        attrs: { datatitle: t('accountOwner.staticIPAddress') },
        dataField: 'ip',
        text: t('accountOwner.staticIPAddress')
    },
    {
        attrs: { datatitle: t('status') },
        dataField: 'isActive',
        text: t('status'),
        formatter: (cellContent) => {
            return cellContent ? t('active') : t('inactive')
        }
    },
    {
        attrs: { datatitle: t('actions') },
        text: t('actions'),
        formatter: (cellContent, row) => {
            return (
                <div className={styles['static-ip-table-action-buttons-container']}>
                    <button disabled={row.actionsDisabled} onClick={() => onStatusChange(!row.isActive, row)}>{t(row.isActive ? 'deactivate' : 'activate')}</button>
                    <button disabled={row.actionsDisabled} onClick={() => onEdit(row)}>{t('edit')}</button>
                    <button disabled={row.actionsDisabled} className={styles['delete-btn']} onClick={() => onDelete(row)}>{t('delete')}</button>
                 </div>
            )
        }
    }];

    return (
        <>
            <div className='static-ip-table'>
                <Table
                    keyField='id' 
                    data={IPs} 
                    columns={columns} />
            </div>
        </>
    )
}

export default IPTable
