export const downloadPDF = async ({fileBlob, documentName}) => {
    const downloadUrl = window.URL.createObjectURL(fileBlob)
    const link = window.document.createElement("a")
    link.href = downloadUrl
    link.setAttribute('download', `${documentName}.pdf`)
    window.document.body.appendChild(link)
    link.click()
}