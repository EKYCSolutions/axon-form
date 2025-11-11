// pb_hooks/main.pb.js

onBootstrap((e) => {
    e.next()
    console.log("App initialized!")
})

// Update page order 
onRecordCreate((e) => {
    const pageRecord = e.record

    const pagesRes = $app.findRecordsByFilter(
        "pages",
        "",
        "-order",
        1,
        0,
    )

    let highestPageOrder = 0

    if (pagesRes.length > 0) {
        highestPageOrder = pagesRes[0].get("order")
    }

    pageRecord.set("order", highestPageOrder + 1)
    e.next()
}, "pages")
