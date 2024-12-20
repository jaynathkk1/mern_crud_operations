import React, { createContext, useState } from 'react'

export const addData = createContext();
export const updateData = createContext();
export const dltdata = createContext();

const ContextProvider = ({ children }) => {

    const [useradd, setUseradd] = useState("");
    const [update, setUpdate] = useState("");
    //const [deletedata, setDLtdata] = useState("");

    return (
        <>
            <addData.Provider value={{ useradd, setUseradd }}>
                <updateData.Provider value={{ update, setUpdate }}>
                    {children}
                </updateData.Provider>
            </addData.Provider>
        </>
    )
}

export default ContextProvider