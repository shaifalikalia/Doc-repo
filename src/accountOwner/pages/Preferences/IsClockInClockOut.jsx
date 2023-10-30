import Text from 'components/Text'
import React from 'react'

function IsClockInClockOut({ t }) {

    return (
        <div className='d-flex flex-column'>
            <Text color='#2f3245' size='12px' weight='500'>{t('accountOwner.clockInClockOutDesc')}</Text>
        </div>
    )
}

export default IsClockInClockOut