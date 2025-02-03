// CODE STARTS FROM HERE

console.log(PDFLib)







// ----------------------------------------------------------------------Selecting Elements

let Choose_File = document.body.querySelector(".Choose-File");

let PDF_Input = document.body.querySelector("#File-Input");

let Files_Name = document.body.querySelector(".Files-Name");

let Download_Button = document.body.querySelector(".Download-File-Button");








// ----------------------------------------------------------------------Adding EventListerner to PDF Input

let Selected_Files = [];

PDF_Input.addEventListener("change", function (event) {
    let files = event.target.files;

    if (files.length > 0) {
        Files_Name.textContent = files.length + " file(s) selected Click to Edit";

        Files_Name.style.fontWeight = "bold"
        Choose_File.textContent = "Merge PDFs"
        Download_Button.style.background = "linear-gradient(90deg, rgb(215, 59, 95), rgba(201, 63, 235, 0.67))"

        let Selected_Files = Array.from(files);
        console.log("FIles - " + Selected_Files)

    }

    else {
        Selected_Files = [];
        Files_Name.style.fontWeight = "normal"
        Files_Name.textContent = "Drop your PDF files here"
        Choose_File.textContent = "Choose File"
        Download_Button.style.background = "linear-gradient(90deg, rgb(86, 119, 204), rgba(120, 63, 235, 0.671))"
    }

})









// ---------------------------------------------------------------------- MErging PDFs

async function PDF_Merger(files) {
    let { PDFDocument } = PDFLib;
    let Merged_PDF = await PDFDocument.create();


    files.sort(function (a, b) {
        return a.lastModified - b.lastModified;
    })

    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        let ArrayBuffer = await file.arrayBuffer();

        let PDF_Doc = await PDFDocument.load(ArrayBuffer);

        let Page_Copies = await Merged_PDF.copyPages(PDF_Doc, PDF_Doc.getPageIndices());

        for (let index = 0; index < Page_Copies.length; index++) {
            page = Page_Copies[index];
            Merged_PDF.addPage(page);
        }

    }

    let Merged_PDF_File = await Merged_PDF.save();

    return Merged_PDF_File;
}










// ---------------------------------------------------------------------- Handling Merged PDF DOWNLOAD

async function PDF_Handler() {
    let files = Array.from(PDF_Input.files);

    if (files.length < 1) {
        alert("please select atleast one or more files")
        return;
    }

    let Merged_PDF = await PDF_Merger(files);

    let PDFBlob = new Blob([Merged_PDF], { type: "application/pdf" });
    let FileURL = URL.createObjectURL(PDFBlob);

    // Creating <a> for Download link

    let a = document.createElement("a");
    a.href = FileURL;
    a.download = "Merged.pdf";
    // document.body.appendChild(a);
    a.click();
    a.remove();
    console.log(a)

    URL.revokeObjectURL(FileURL)

}











// ---------------------------------------------------------------------- Triggering DOWNLOAD Button

Download_Button.addEventListener("click", function (event) {
    if (Choose_File.textContent === "Merge PDFs") {
        PDF_Handler();
        event.preventDefault();
        Files_Name.style.fontWeight = "normal"
        Files_Name.textContent = "Drop your PDF files here"
        Choose_File.textContent = "Choose File"
        Download_Button.style.background = "linear-gradient(90deg, rgb(86, 119, 204), rgba(120, 63, 235, 0.671))"

        Selected_Files = [];
    }
});