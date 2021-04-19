import React from 'react'
import styles from '../styles/index.module.css'


function Status(props) {
    return (
        <div className={styles.status}>
            {props.status}
        </div>
    );
}


export default Status;