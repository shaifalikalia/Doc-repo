import React, { Fragment } from 'react';
import Text from 'components/Text';
import styles from "./../ManageCatalogue.module.scss";
import { withTranslation } from 'react-i18next';


const PriceDeliveryCard = ({ t, ...props }) => {
    const { saved = false, id } = props;
    return (
        <Fragment>
            {!saved &&
                 <div id={id} className={styles['custom-input-box-wrapper']}>
                    <div className={styles['custom-input-box'] + " " + styles['btn-input-box']}>
                        <div>
                            <div className={styles['label-big']}>
                                {props.Title}
                            </div>
                            <Text
                                size='12px'
                                marginBottom="5px"
                                weight='400'
                                color='#79869A' >{props.SubTitle}</Text>

                        </div>
                        <div>
                            <button
                                className="button btn-small-40 button-round button-shadow"
                                type='button'
                                title={props.btnText}
                                onClick={props.setModal}
                            >
                                {props.setBtnText}
                            </button>
                        </div>
                    </div>
                    {props.error && <span className="error-msg">{props.error}</span>}
                </div>}
            {saved && <div className={styles["detail-box"]}>
                <div className={styles['label-big']}>  {props.Title}  </div>
                <div className={styles['custom-input-box']}>
                    <Text
                        size='12px'
                        marginBottom="px"
                        weight='400'
                        color='#535B5F' >{props.savedDetailText}</Text>

                    <Text
                        size='14px'
                        marginBottom="px"
                        weight='400'
                        color='#535B5F' >{props.priceText}</Text>
                    <div className={styles.link}>
                        <span
                            className="link-btn"
                            title={props.btnText} 
                            onClick={props.setModal}
                        >
                            {props.viewBtnText}
                        </span>
                    </div>
                </div>
            </div>}
        </Fragment>
    );
};

export default withTranslation()(PriceDeliveryCard);