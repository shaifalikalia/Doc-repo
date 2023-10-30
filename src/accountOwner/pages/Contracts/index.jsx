import React, { useState } from 'react'
import { withTranslation } from 'react-i18next';
import Page from 'components/Page'
import { Link } from 'react-router-dom'
import constants from './../../../constants'
import styles from './Contracts.module.scss'
import { useOfficeDetail } from 'repositories/office-repository'
import { useStaffMembers } from 'repositories/contract-repository'
import paginationFactory, { PaginationListStandalone, PaginationProvider } from 'react-bootstrap-table2-paginator'
import BootstrapTable from 'react-bootstrap-table-next'
import Loader from 'components/Loader';
import Empty from 'components/Empty';
import { useSelector } from 'react-redux'
import { decodeId, encodeId } from 'utils';

function Contracts({ history, location, match, t }) {
  
  const officeId = decodeId(match.params.officeId)
  const PAGE_SIZE = 5;
  const [pageNumber, setPageNumber] = useState(1);
  const profile = useSelector(state => state.userProfile.profile);
  const goBack = () => {
    if (profile.isAdmin) {
      
      history.push(
        {
          pathname: constants.routes.staff.officeAdmin.replace(':officeId', match.params.officeId),
          state: location.state
        })
    } else {
      history.push(constants.routes.accountOwner.officeOptions.replace(':officeId', match.params.officeId))
    }
  }
  let officeName = null
  if (location.state && location.state.officeName) {
    officeName = location.state.officeName
  }

  const { isLoading: isLoadingStaff, data: officeStaff } = useStaffMembers(officeId, '', pageNumber, PAGE_SIZE)
  const { isLoading: isLoadingOfficeDetail, data: officeDetail } = useOfficeDetail(officeId)

  let rows = []
  let totalItems = 0

  if (!isLoadingStaff && officeStaff && officeStaff.items) {
    rows = officeStaff.items;
    totalItems = officeStaff.pagination.totalItems
  }

  return (
    <Page
      onBack={goBack}
      isTitleLoading={!officeName && !officeStaff && (isLoadingOfficeDetail || isLoadingStaff)}
      title={officeName || (officeDetail && officeDetail.name)}
      className={styles['page']}>
      {(isLoadingOfficeDetail || isLoadingStaff) && <Loader />}

      <div className={styles['page-subheading']}>{t('contracts.formsAndContract')}</div>
      {rows.length > 0 && <div className="mange-sub-section">
        <ul className={styles['contract-data-list']}>
          {
            rows.map((data, key) => (
              <li key={key} onClick={() => localStorage.setItem('staffName', data.firstName + ' ' + data.lastName)}>
                <Link className={styles['contract-link']} to={{
                  pathname: constants.routes.accountOwner.staffContracts.replace(':officeId', match.params.officeId).replace(':staffId', encodeId(data.id)),
                  state: location.state
                }}>
                  <label className={styles['contract-name']}>{data.firstName} {data.lastName}</label>
                  <span className={styles['contract-btn']}>  {t('contracts.viewContract')}</span>
                </Link>
              </li>
            ))}

        </ul>
        <PaginationProvider
          pagination={paginationFactory({
            custom: true,
            sizePerPage: PAGE_SIZE,
            totalSize: totalItems,
            page: pageNumber,
            onPageChange: setPageNumber
          })}>
          {
            ({ paginationProps, paginationTableProps }) => {
              return (
                <div className='data-table-block'>

                  {/* Paginator component needs table to work, this is why we have used it.  */}
                  <div style={{ display: 'none' }}>
                    <BootstrapTable
                      keyField='id'
                      data={[]}
                      columns={[{ text: 'sometext' }]}
                      {...paginationTableProps} />
                  </div>

                  <div className={'pagnation-block ' + styles["mobile-align-center"]} >
                    {totalItems > PAGE_SIZE && (<PaginationListStandalone {...paginationProps} />)}
                  </div>
                </div>
              )
            }
          }
        </PaginationProvider>
      </div>}
      {
        rows.length === 0 && <Empty Message={t('noStaffMemberFound')} />
      }
    </Page>
  )
}
export default withTranslation()(Contracts)
