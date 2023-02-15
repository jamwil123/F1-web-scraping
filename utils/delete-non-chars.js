const deleteAllSpecialChars = (str)=>{
    console.log(str.replace(/\s+/g, ""))

}

deleteAllSpecialChars('\n                        Bahrain\n                    ')

module.exports = {
    deleteAllSpecialChars
}