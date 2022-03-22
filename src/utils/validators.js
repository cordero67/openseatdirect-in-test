

export const isValidEventNum = (eventNumString) =>{
    // validates eventNum, which must be a string i.e. '0123456789'
    // we assume 9 to 15 in length in case size grows later we don't need to change this
    return   /^[0-9]{9,15}$/.test(eventNumString)
}



