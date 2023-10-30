import Text from 'components/Text'
import React from 'react'

function IsTimesheetFromMobileStaticIP({ t }) {

    return (
        <div className='d-flex flex-column'>
            <Text color='#2f3245' size='12px' weight='500'>{t('accountOwner.staticIPonMobileDescription')}</Text>
        </div>
    )
}

export default IsTimesheetFromMobileStaticIP