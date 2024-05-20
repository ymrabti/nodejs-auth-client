import React from 'react'
import moment from 'moment'

const Footer = () => {
    return (
        <div style={{ background: "#303031", color: "#87898A" }} className="z-10 py-6 px-4 md:px-12 text-center footer">
            YOUMRABTI © Copyright {moment().format("YYYY")}
        </div>
    )
}

export default Footer
