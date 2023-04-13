import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <span className="ms-1">&copy; 2023 Dev Devils.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        Made by Dev Devils
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
