// LIBRARIES
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate as Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// ACTIONS
import { currentUser } from './state/actions/layout'
import { USER_LOADING } from './state/constants/layout'
import { Home } from './components/Home'
import { UserWrapper } from './components/user/wrapper'

const AppRoutes = () => {
    const dispatch = useDispatch()

    dispatch({ type: USER_LOADING, payload: true })

    useEffect(() => {
        dispatch(currentUser())
    }, [dispatch])

    return (
        <UserWrapper>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} Component={Home} />
                    <Route path='*' element={<Redirect to="/" />} />
                </Routes>
            </BrowserRouter>
        </UserWrapper>
    )
}

export default AppRoutes