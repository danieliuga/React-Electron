import { useState, useEffect, useRef } from 'react'
import './Form.css'
import { useMutation } from '@apollo/client';
import * as Queries from '../apollo/apolloQuery';
// import { readFile } from 'fs/promises';

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
  const [file, setFile] = useState<File>()
  const [data, setData] = useState(null)
  const [errorData, setErrorData] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [classSubmmited, setClassSubmmited] = useState('')
  const [message, setMessage] = useState('')
  const [fileImage, setFileImage] = useState<any>("")

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

    const fileAsString = readFileOnUpload(file)

    addColor({
      variables: {
        name: nameColor,
        hex: hex,
        file: fileAsString
      },
    })
      .then((data) => {
        console.log(data);

        setFormSubmitted(true)
        setClassSubmmited('submmited')
        setMessage('Submitted successfully! :)')
      })
      .catch((error) => {
        console.error('Mutation error:', error);
      });

    setFormSubmitted(true);
    setClassSubmmited('');
    setMessage('');
    //location.reload();
  }

  const handleClear = () => {
    setnameColor('')
    setHex('')
  }

  const readFileOnUpload = (uploadedFile: any) => {
    // Crear un FileReader para leer como texto
    const textFileReader = new FileReader();
    textFileReader.onloadend = () => {
      if (textFileReader.result !== null) {
        try {
          setData(JSON.parse(textFileReader.result as string));
          setErrorData(null);
        } catch (e) {
          setErrorData("**Not valid JSON file!**" as any);
        }
      }
    };

    // Crear otro FileReader para leer como data URL
    const dataUrlFileReader = new FileReader();
    dataUrlFileReader.onloadend = (onFileReadEndEvent: any) => {
      const image = new Image();
      image.src = onFileReadEndEvent.target.result;
      
      image.onload = () => {
        setData(onFileReadEndEvent.target.result);
        setErrorData(null);
      };
      image.onerror = () => {
        setErrorData("Not valid Image!");
        setData(null);
      };

      setFileImage(image.src)
      
    };

    if (uploadedFile !== undefined) {
      // Leer el contenido como texto
      textFileReader.readAsText(uploadedFile);

      // Leer el contenido como data URL
      dataUrlFileReader.readAsDataURL(uploadedFile);

      // Si hay datos disponibles, retorna el string; de lo contrario, retorna null
      return textFileReader.result as string | null;
    }
    setFile(uploadedFile)
    return null;
  };

  const readFileWhenSubmit = (event: any) => {
    event.preventDefault();
    if (fileRef.current && fileRef.current.files) {
      const uploadedFile = fileRef.current.files[0];
      
      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        if (fileReader.result !== null) {
          try {
            setData(JSON.parse(fileReader.result as string));
            setErrorData(null);
          } catch (e) {
            setErrorData("**Not valid JSON file!**" as any);
          }
        }
      };
      console.log("uploadFile: ", uploadedFile);

      if (uploadedFile !== undefined) fileReader.readAsText(uploadedFile);

    } else {
      console.error("fileRef.current is null");
    }

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
              <main className='main' >
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
                <input
                  type="file"
                  ref={fileRef}
                  onChange={(e) => e.target.files && readFileOnUpload(e.target.files[0])}
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
            <form onSubmit={(e) => { readFileWhenSubmit(e) }}>
              <button >Display File Content</button>
            </form>
          </div>
          <div >
            {/* <img src={fileImage} alt="" /> */}
            {/* {fileImage} */}
          </div>
        </section>
      </div>
    </>
  )
}

export default Form