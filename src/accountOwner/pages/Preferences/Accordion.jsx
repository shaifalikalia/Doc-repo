import React from 'react'
import styles from './Preferences.module.scss'
import { AnimatePresence, motion, useCycle } from 'framer-motion'
import Text from 'components/Text'

function Accordion({ isChecked, isDisabled, isCheckboxDisabled, onCheckChange, title, errorMessage, children }) {
    const [isCollapsed, ] = useCycle(false, true)

    return (
        <div className={styles['accordion'] + (isDisabled ? ` ${styles['fade']}` : '')}>
            <div className='d-flex align-items-center justify-content-between'>
                
                <div className='d-flex align-items-center'>
                    <div className={`ch-checkbox ${styles['accordion-checkbox']}`}>
                        <label>
                            <input
                                disabled={isDisabled || isCheckboxDisabled}
                                type='checkbox' 
                                onChange={() => onCheckChange(!isChecked)} 
                                checked={isChecked}/>
                            <span>
                                {title}
                            </span>
                        </label>
                    </div>
                </div>

                {/* <motion.div 
                    animate={{ rotateZ: isCollapsed ? 0 : -180 }}>
                    <img src={downArrowIcon} className={styles['accordion-arrow']}/>
                </motion.div> */}

            </div>

            {errorMessage && <Text size='12px' color='#ff002d' marginBottom='10px'>{errorMessage}</Text>}

            {/* Collapsable Content */}
            <motion.div
                initial={false}
                variants={animationVariants}
                animate={isCollapsed ? 'hidden' : 'show'}>
                <AnimatePresence initial={false}>
                    {!isCollapsed && (
                        <motion.div 
                            key='content'
                            initial='hidden'
                            animate='show'
                            exit='hidden'
                            variants={childrenContainerAnimationVariants}>
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

const animationVariants = {
    show: {
        height: 'auto',
        transition: { duration: 0.5 }
    },
    hidden: {
        height: 0,
        transition: { duration: 0.5 }
    }
}

const childrenContainerAnimationVariants = {
    show: {
        opacity: 1,
        transition: { duration: 0.8 }
    },
    hidden: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
}

export default Accordion