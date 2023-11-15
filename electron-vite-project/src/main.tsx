import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApolloProvider } from '@apollo/client';
import apolloConfig from "./apollo/apolloConfig"


ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={apolloConfig}>
    <App />
  </ApolloProvider>,
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
