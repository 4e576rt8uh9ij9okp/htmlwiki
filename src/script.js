function download(filename, text){
    let el = document.createElement("a")
    el.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text))
    el.setAttribute("download", filename)

    el.style.display = "none"
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
}

const mainEl = document.getElementById("main")
const editorEl = document.getElementById("editor")
const editEl = document.getElementById("edit")
const saveEl = document.getElementById("save")

function toggleView(){
    [mainEl,editorEl,editEl,saveEl].forEach(
        el => el.classList.toggle("hidden")
    )
}

document.getElementById("location").value = document.location.pathname

let editor;

saveEl.addEventListener("click", () => {
    if(!editor) return

    editor.save()
        .then(data => {
            let htmlParser = edjsHTML()
            let html = htmlParser.parse(data)
            mainEl.innerHTML = html
            toggleView()
            download("index.html", html)
        })
        .catch(error => {
            console.error(error)
        })
})

editEl.addEventListener("click", () => {
    if(document.location.port == ""){
        return window.open("https://github.com/4e576rt8uh9ij9okp/buildpc.org", "_blank").focus()
    }

    editor = new EditorJS({
        holder: "editor",
        onReady: () => {
            new Undo({editor})
            editor.blocks.renderFromHTML(mainEl.innerHTML)
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