import { Routes, Route } from 'react-router-dom';
import About from './components/Inicial'
import Lista from './components/List'
import Form from './components/Form'

const AppRouter = () => {

    return (
        <Routes>
            <Route path='/' element={<About />} />
            <Route path='/Lista' element={<Lista />} />
            <Route path='/Form' element={<Form />} />
        </Routes>
    )
}

export default AppRouter