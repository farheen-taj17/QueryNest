/* =========================
   BACKEND URL
========================= */

const API_URL =
"http://192.168.1.5:5000"

/* =========================
   CHANGE THEME
========================= */

function changeTheme(theme){

    document.body.className = theme

}

/* =========================
   SEARCH
========================= */

async function search(){

    const query =
    document.getElementById(
        "searchInput"
    ).value

    const response =
    await fetch(
        `${API_URL}/search?q=${query}`
    )

    const data =
    await response.json()

    displayResults(data)

}

/* =========================
   DISPLAY RESULTS
========================= */

function displayResults(results){

    const resultsDiv =
    document.getElementById(
        "results"
    )

    resultsDiv.innerHTML = ""

    results.forEach(item=>{

        resultsDiv.innerHTML += `

        <div class="result">

            <h2>${item.title}</h2>

            <p>${item.description}</p>

            <a href="${item.url}" target="_blank">
                ${item.url}
            </a>

        </div>

        `

    })

}

/* =========================
   SEARCH SUGGESTIONS
========================= */

async function getSuggestions(){

    const query =
    document.getElementById(
        "searchInput"
    ).value

    if(query.length < 1){

        document.getElementById(
            "suggestions"
        ).innerHTML = ""

        return

    }

    const response =
    await fetch(
        `${API_URL}/suggest?q=${query}`
    )

    const data =
    await response.json()

    let html = ""

    data.forEach(item=>{

        html += `
        <div class="suggestion-item">
            ${item.title}
        </div>
        `

    })

    document.getElementById(
        "suggestions"
    ).innerHTML = html

}

/* =========================
   VOICE SEARCH
========================= */

function voiceSearch(){

    const recognition =
    new webkitSpeechRecognition()

    recognition.start()

    recognition.onresult =
    function(event){

        document.getElementById(
            "searchInput"
        ).value =
        event.results[0][0].transcript

        search()

    }

}

/* =========================
   IMAGE UPLOAD
========================= */

async function uploadImage(){

    const file =
    document.getElementById(
        "imageInput"
    ).files[0]

    const formData =
    new FormData()

    formData.append(
        "image",
        file
    )

    await fetch(
        `${API_URL}/uploadImage`,
        {
            method:"POST",
            body:formData
        }
    )

    alert("✅ Image Uploaded")

}

/* =========================
   CONVERT PDF
========================= */

async function convertPdf(){

    const file =
    document.getElementById(
        "pdfInput"
    ).files[0]

    const formData =
    new FormData()

    formData.append(
        "image",
        file
    )

    await fetch(
        `${API_URL}/convertPdf`,
        {
            method:"POST",
            body:formData
        }
    )

    alert("✅ PDF Created")

}

/* =========================
   READ DOC
========================= */

async function readDoc(){

    const file =
    document.getElementById(
        "docInput"
    ).files[0]

    const formData =
    new FormData()

    formData.append(
        "doc",
        file
    )

    const response =
    await fetch(
        `${API_URL}/readDoc`,
        {
            method:"POST",
            body:formData
        }
    )

    const data =
    await response.json()

    alert(data.text)

}