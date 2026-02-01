import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CopilotKit runtimeUrl="/api/copilot/chat">
      <App />
    </CopilotKit>
  </StrictMode>,
)
