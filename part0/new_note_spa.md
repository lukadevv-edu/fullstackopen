```sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa { content: "test", date: "2026-02-03T14:50:45.638Z" }

    activate server
    server-->>browser: (201 Created) note was created, response: "{"message":"note created"}"

    Note right of browser: The "spa.js" will add this note without reloading the entire page (like in not SPA example)

    deactivate server
```
