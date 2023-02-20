function download(filename, text){
    let el = document.createElement("a")
    el.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text))
    el.setAttribute("download", filename)

    el.style.display = "none"
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
}

function toggleView(){
    document.getElementById("main").classList.toggle("hidden")
    document.getElementById("editor").classList.toggle("hidden")
    document.getElementById("edit").classList.toggle("hidden")
    document.getElementById("save").classList.toggle("hidden")
}

document.getElementById("location").value = document.location.pathname

let editor;

document.getElementById("save").addEventListener("click", () => {
    if(!editor) return

    editor.save()
        .then(data => {
            let htmlParser = edjsHTML()
            let html = htmlParser.parse(data)
            document.getElementById("main").innerHTML = html
            toggleView()
            download("index.html", html)
        })
        .catch(error => {
            console.error(error)
        })
})

document.getElementById("edit").addEventListener("click", () => {
    editor = new EditorJS({
        holder: "editor",
        onReady: () => {
            new Undo({editor})
            editor.blocks.renderFromHTML(document.getElementById("main").innerHTML)
        },
        tools: {
            header: Header,
            quote: Quote,
            warning: Warning,
            list: {
                class: NestedList,
                config: {
                    defaultStyle: 'unordered'
                }   
            },
            checklist: Checklist,
            image: SimpleImage,
            code: CodeTool,
            raw: RawTool,
            marker: Marker,
            inlineCode: InlineCode,
            underline: Underline,
        },
        autofocus: true
    })

    toggleView()
})