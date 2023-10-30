import Button from 'components/Button'
import Input from 'components/Input'
import Text from 'components/Text'
import React, { useEffect, useState } from 'react'
import { Modal } from 'reactstrap'
import ModalBody from 'reactstrap/lib/ModalBody'
import IPTable from './IPTable'
import styles from './Preferences.module.scss'
import crossIcon from './../../../assets/images/cross.svg'
import { useUpdateIPActiveStatusMutation, useAddIPMutation, useDeleteIPMutation, useUpdateIPMutation } from 'repositories/static-ip-repository'
import toast from 'react-hot-toast'
import constants from './../../../constants'

const IP_LIMIT = 20

function StaticIPPreference({ isDisabled, officeId, IPs, t }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalType, setModalType] = useState(null)
    const [IPToUpdate, setIPToUpdate] = useState(null)

    const addIPMutation = useAddIPMutation()
    const updateIPMutation = useUpdateIPMutation()
    const deleteIPMutation = useDeleteIPMutation()
    const updateIPActiveStatusMutation = useUpdateIPActiveStatusMutation()

    const onSubmit = async (id, name, address) => {
        if (id === null) {
            await addIP(name, address)
        } else {
            await updateIP(id, name, address)
        }
    }

    const addIP = async (name, address) => {
        try {
            await addIPMutation.mutateAsync({ name, address, officeId })
            closeModal()
            toast.success(t('accountOwner.ipAddedSuccessfully'))
        } catch (e) {
            toast.error(e.message)
        }
    }

    const updateIP = async (id, name, address) => {
        try {
            await updateIPMutation.mutateAsync({ id, name, address, officeId })
            closeModal()
            toast.success(t('accountOwner.ipUpdatedSuccessfully'))
        } catch (e) {
            toast.error(e.message)
        }
    }

    const deleteIP = async () => {
        try {
            await deleteIPMutation.mutateAsync({ id: IPToUpdate.id, officeId })
            closeModal()
            toast.success(t('accountOwner.ipDeletedSuccessfully'))
        } catch (e) {
            toast.error(e.message)
        }
    }

    const updateIPActiveStatus = async () => {
        try {
            await updateIPActiveStatusMutation.mutateAsync({ id: IPToUpdate.id, officeId, newStatus: !IPToUpdate.isActive })
            closeModal()
            toast.success(t('accountOwner.ipStatusUpdatedSuccessfully'))
        } catch (e) {
            toast.error(e.message)
        }
    }

    const onEdit = (IP) => {
        setIPToUpdate(IP)
        setIsModalOpen(true)
        setModalType(modalTypes.updateIP)
    }

    const onStatusChange = (newStatus, IP) => {
        setIPToUpdate(IP)
        setIsModalOpen(true)
        if (newStatus) {
            setModalType(modalTypes.activateIP)
        } else {
            setModalType(modalTypes.deactivateIP)
        }
    }

    const onDelete = (IP) => {
        setIPToUpdate(IP)
        setIsModalOpen(true)
        setModalType(modalTypes.deleteIP)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setIPToUpdate(null)
        setModalType(null)
    }

    return (
        <>
        <div className='d-flex flex-column'>
            <Text color='#2f3245' size='12px' weight='500'>{t('accountOwner.staticIPDescription')}</Text>

            <div className={styles['static-ip-add-button-container']}>
                <Button
                    disabled={IPs.length === IP_LIMIT || isDisabled}
                    boxShadow='4px 5px 14px 0 #e4e9dd' 
                    onClick={() => {
                        setIsModalOpen(true)
                        setModalType(modalTypes.addIP)
                    }}>
                    {t('accountOwner.addNewStaticIP')}
                </Button>
            </div>

            <div className={styles['static-ip-table-container']}>
                <IPTable 
                    actionsDisabled={isDisabled}
                    onEdit={onEdit}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                    IPs={IPs} 
                    t={t}/>
            </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
            <Modal 
                isOpen={isModalOpen}
                toggle={closeModal}
                className='modal-dialog-centered' 
                modalClassName='custom-modal'>
                <span className='close-btn' onClick={closeModal}>
                    <img src={crossIcon} alt='close' />
                </span>
                <ModalBody>
                    <ModalContent
                        modalType={modalType}
                        IPToUpdate={IPToUpdate}
                        closeModal={closeModal}

                        addIPMutation={addIPMutation}
                        updateIPMutation={updateIPMutation}
                        onSubmit={onSubmit}

                        deleteIPMutation={deleteIPMutation}
                        deleteIP={deleteIP}

                        updateIPActiveStatusMutation={updateIPActiveStatusMutation}
                        updateIPActiveStatus={updateIPActiveStatus}

                        t={t}/>
                </ModalBody>
            </Modal>
        )}
        {/* Modal */}

        </>
    )
}

function ModalContent({ 
    modalType,
    IPToUpdate,
    closeModal,

    addIPMutation,
    updateIPMutation,
    onSubmit,

    deleteIPMutation,
    deleteIP,

    updateIPActiveStatusMutation,
    updateIPActiveStatus,

    t
}) {
    if (modalType === modalTypes.addIP || modalType === modalTypes.updateIP) {
        return (
            <>
            <Text 
                size='25px' 
                weight='500' 
                color='#111b45' 
                marginBottom='40px'>
                {t(modalType === modalTypes.addIP ? 'accountOwner.newStaticIP' : 'accountOwner.updateStaticIP')}
            </Text>
            <Form
                IP={IPToUpdate}
                isSubmitting={addIPMutation.isLoading || updateIPMutation.isLoading}
                onSubmit={onSubmit}
                onCancel={closeModal}
                t={t} />
            </>
        )
    } else if (modalType === modalTypes.activateIP || modalType === modalTypes.deactivateIP) {
        return (
            <div className='d-flex flex-column'>
                <Text 
                    size='25px' 
                    weight='500' 
                    color='#111b45' >
                    {t('confirmation')}
                </Text>
                <Text weight={500} marginTop='20px' marginBottom='20px'>
                    {modalType === modalTypes.deactivateIP ? 
                        t('accountOwner.ipDeactivationConfirmationText') : 
                        t('accountOwner.ipActivationConfirmationText')}
                </Text>
                <div className={styles['modal-buttons-container']}>
                    <Button 
                        disabled={updateIPActiveStatusMutation.isLoading}
                        onClick={updateIPActiveStatus}
                        className={styles['action-btn']}>
                        {t('yes')}, {t(modalType === modalTypes.deactivateIP ? 'deactivate' : 'activate')}
                    </Button>
                    <Button 
                        borderedSecondary 
                        onClick={closeModal}
                        className={styles['cancel-btn']}>
                        {t('cancel')}
                    </Button>
                </div>
            </div>
        )
    } else if (modalType === modalTypes.deleteIP) {
        return (
            <div className='d-flex flex-column'>
                <Text 
                    size='25px' 
                    weight='500' 
                    color='#111b45' >
                    {t('confirmation')}
                </Text>
                <Text weight={500} marginTop='20px' marginBottom='20px'>{t('accountOwner.ipDeleteConfirmationText')}</Text>
                <div className={styles['modal-buttons-container']}>
                    <Button 
                        disabled={deleteIPMutation.isLoading}
                        onClick={deleteIP}
                        className={styles['action-btn']}>
                        {t('yes')}, {t('delete')}
                    </Button>
                    <Button 
                        borderedSecondary 
                        onClick={closeModal}
                        className={styles['cancel-btn']}>
                        {t('cancel')}
                    </Button>
                </div>
            </div>
        )
    } else {
        return null
    }
}

function Form({ IP, isSubmitting, onSubmit, onCancel, t }) {
    const [id, setId] = useState(null)
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [errors, setErrors] = useState({})

    const isValid = () => {
        let _errors = {}
        let _isValid = true

        if (!constants.regex.validIP.test(address)) {
            _errors.address = t('form.errors.invalidIP')
            _isValid = false
        }

        if (!_isValid) {
            setErrors(_errors)
        }

        return _isValid
    }

    const onSave = () => {
        if (!isValid()) {
            return
        }
        onSubmit(id, name.trim(), address.trim())
    }

    useEffect(() => {
        if (IP) {
            setId(IP.id)
            setName(IP.name)
            setAddress(IP.ip)
        }
    }, [IP])

    return (
        <div>
            <Input
                Title={t('name')}
                Placeholder={t('accountOwner.nameOfIPExample')}
                MaxLength={36}
                Value={name}
                HandleChange={e => setName(e.target.value)}
                Error={errors.name} />

            <Input
                Title={t('accountOwner.ipAddress')}
                Placeholder={t('accountOwner.ipAddressExample')}
                MaxLength={15}
                Value={address}
                HandleChange={e => setAddress(e.target.value)}
                Error={errors.address} />

            <div className={styles['modal-buttons-container']}>
                <Button
                    className={styles['action-btn']}
                    disabled={name.trim().length === 0 || address.trim().length === 0 || isSubmitting}
                    onClick={onSave}>
                    {t('save')}
                </Button>
                <Button 
                    className={styles['cancel-btn']}
                    borderedSecondary
                    disabled={isSubmitting}
                    onClick={onCancel}>
                    {t('cancel')}
                </Button>
            </div>
        </div>
    )
}

const modalTypes = {
    addIP: 'addIP',
    updateIP: 'updateId',
    activateIP: 'activateIP',
    deactivateIP: 'deactivateIP',
    deleteIP: 'deleteIP'
}

export default StaticIPPreference