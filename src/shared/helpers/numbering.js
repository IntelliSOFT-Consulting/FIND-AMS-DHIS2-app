

export const generateAlphaNumericList =(index)=>{
    const alphabetArray = Array.from({ length: 26 }, (_, i) => String.fromCharCode('a'.charCodeAt(0) + i));
    return alphabetArray[index]

}