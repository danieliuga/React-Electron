import { useState, useEffect } from 'react'
import './Form.css'
import { useMutation } from '@apollo/client';
import * as Queries from '../apollo/apolloQuery';


// para el console.log = control + shift + i
interface FormProps { }

const Form: React.FC<FormProps> = () => {
  const [nameColor, setnameColor] = useState('')
  const [hex, setHex] = useState('')
  const [addColor] = useMutation(Queries.addNewColor, {
    onError: (error) => {
      console.error('Error submitting form:', error.message);
    },
  });

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [classSubmmited, setClassSubmmited] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if ((nameColor.length === 0 && hex.length > 0) || (nameColor.length > 0 && hex.length === 0)) {
      setFormSubmitted(false)
      setClassSubmmited('error-message')
      setMessage('Color o Hex incorrecto')
    } else {
      setFormSubmitted(false);
      setClassSubmmited('');
      setMessage('');
    }
  }, [nameColor, hex])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    addColor({
      variables: {
        name: nameColor,
        hex: hex
      },
    })
      .then(() => {
        if (formSubmitted) {
          setFormSubmitted(true)
          setClassSubmmited('submmited')
          setMessage('Submitted successfully! :)')
        }

      })
      .catch((error) => {
        console.error('Mutation error:', error);
      });
      location.reload();
  }

  const handleClear = () => {
    setnameColor('')
    setHex('')
  }

  return (
    <>
      <div className='app'>
        <section className='form'>
          <div className='añadir'>
            <header className='header'>
              <h2>Añadir</h2>
            </header>
            <form onSubmit={handleSubmit}>
              <main className='main'>
                <label htmlFor="nameColor"></label>
                <input
                  type="text"
                  placeholder='Color'
                  value={nameColor}
                  onChange={(e) => setnameColor(e.target.value)}
                />
                <label htmlFor="hex"></label>
                <input
                  type="text"
                  placeholder='hex'
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                />
              </main>
              <div className='error-message'>{
                message
              }</div>
            </form>
            <footer className='footer'>
              <button type='submit' className='submitButton' onClick={handleSubmit}>Submit</button>
              <button type='submit' className='clearButton' onClick={handleClear}>Clear</button>
            </footer>
            {formSubmitted && (
              <div className={`submmited ${classSubmmited}`}>{message}</div>
            )}
            </div>
        </section>
      </div>
    </>
  )
}

export default Form