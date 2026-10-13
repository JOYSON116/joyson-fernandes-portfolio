import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './interactions.css'

import './recruiter.css'
import './pipeline.css'
import './typewriter.css'
import './theme.css'
import App from './App'
createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
