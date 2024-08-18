import * as React from "react"
import * as ReactDOM from "react-dom/client"
import App from "./app"
import "./styles.css"
import "./i18n"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
