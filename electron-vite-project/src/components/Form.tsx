import { useState, useEffect, useRef } from 'react'
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
  const [file, setFile] = useState<File | null>();
  //const [data, setData] = useState(null)
  const [data, setData] = useState<{ file: string | null }>();

  const [errorData, setErrorData] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [classSubmmited, setClassSubmmited] = useState('')
  const [message, setMessage] = useState('')

  const [fileImage, setFileImage] = useState<any>("")
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null); // Nuevo estado

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

    //const fileAsString = readFileOnUpload(file)
    //console.log('File Bytes:', fileBytes);

    const fileBase64 = fileBytes ? btoa(String.fromCharCode.apply(fileBytes)) : null;
    //console.log('File Base64:', fileBase64);

    addColor({
      variables: {
        name: nameColor,
        hex: hex,
        file: fileImage
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
    setFile(null)
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
    //ESTO FUNCIONA MAS O MENOS
    // Crear otro FileReader para leer como data URL
    const dataUrlFileReader = new FileReader();
    dataUrlFileReader.onloadend = (onFileReadEndEvent: any) => {
      const image = new Image();
      image.src = onFileReadEndEvent.target.result;

      image.onload = () => {
        setData({
          file: image.src,
        });
        setErrorData(null);
      };
      image.onerror = () => {
        setErrorData("Not valid Image!");
        setData({
          file: null,
        });
      };
      setFileImage(image.src)

    };

    //ESTO FUNCIONA
    // Crear otro FileReader para leer como array de bytes
    const bytesFileReader = new FileReader();
    bytesFileReader.onloadend = () => {
      if (bytesFileReader.result !== null) {
        const arrayBuffer = bytesFileReader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        //console.log('Bytes del archivo:', bytes);
        setFileBytes(bytes);

        if (bytes.length > 0) {
          const base64String = btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''));
          //console.log('Base64:', base64String);

          const jsonObject = { file: base64String };
          //console.log('JSON:', JSON.stringify(jsonObject));

          setFileBytes(bytes);
        } else {
          console.error('El array de bytes está vacío.');
        }
      }
    };

    if (uploadedFile !== undefined) {
      // Leer el contenido como texto
      textFileReader.readAsText(uploadedFile);

      // Leer el contenido como data URL
      dataUrlFileReader.readAsDataURL(uploadedFile);

      bytesFileReader.readAsArrayBuffer(uploadedFile);

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

  const handleDownload = () => {
    const jsonData = {
      name: nameColor,
      hex,
      file: fileImage,
    };
    const jsonString = JSON.stringify(jsonData);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'archivo.json';
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

  };

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
            {fileBytes && (
              <div>
                {/* {fileBytes.join(', ')} */}
                <button onClick={handleDownload}>Descargar JSON</button>
              </div>
            )}
          </div>
          {/* <div >
            <img src={fileImage} alt="" />
            {fileImage}
          </div>
          {fileBytes && (
            <div>
              <p>Bytes del archivo:</p>
              {fileBytes.join(', ')}
            </div>
          )} */}
        </section>
      </div>
    </>
  )
}

export default Form

/* 
  1. adjuntar un file
  2. guardar el file
  3. mostrar el file
  4. pasarlo a bytes el file
  5. crear un json y guradar el file alli
  6. mostrar el json
  7. guardarlo en bdd
  8. boton para descargar el file
*/
