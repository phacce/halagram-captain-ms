


module.exports = (joi, message)=>{
    return ()=>{
        return joi.string().regex(/^[0-9a-fA-F]{24}$/).validate()
    }
}