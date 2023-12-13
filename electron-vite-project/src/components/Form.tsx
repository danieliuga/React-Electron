import { useState, useEffect, useRef } from 'react'
import './Form.css'
import { useMutation } from '@apollo/client';
import * as Queries from '../apollo/apolloQuery';

// para el console.log = control + shift + i
interface FormProps { }

const Form: React.FC<FormProps> = () => {
  const [nameColor, setnameColor] = useState('')
  const [hex, setHex] = useState('')
  const [fileName, setFileName] = useState<any>("")

  const [addColor] = useMutation(Queries.addNewColor, {
    onError: (error) => {
      console.error('Error submitting form:', error.message);
    },
  });
  const [data, setData] = useState<{ file: string | null; fileContent: string | null }>();
  const [errorData, setErrorData] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [fileImage, setFileImage] = useState<any>("")
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);


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
        hex: hex,
        fileName: fileName,
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
    setFileImage(null)
    setFileBytes(null)
    setFileImage(null)
  }

  const readFileOnUpload = (uploadedFile: any) => {
    const fileName = uploadedFile.name;


    const textFileReader = new FileReader();
    textFileReader.onloadend = () => {
      if (textFileReader.result !== null) {
        try {
          setData(JSON.parse(textFileReader.result as string));
          setErrorData(null);
        } catch (e) {
          setErrorData("Not valid JSON file!" as any);
        }
      }
    };

    const dataUrlFileReader = new FileReader();
    dataUrlFileReader.onloadend = (onFileReadEndEvent: any) => {
      const image = new Image();
      image.src = onFileReadEndEvent.target.result;

      image.onload = () => {
        setData({
          file: image.src,
          fileContent: textFileReader.result as string,
        });
        setErrorData(null);
      };
      image.onerror = () => {
        setErrorData("Not valid Image!");
        setData({
          file: null,
          fileContent: null,
        });
      };
      setFileImage(image.src)      

    };


    const bytesFileReader = new FileReader();
    bytesFileReader.onloadend = () => {
      if (bytesFileReader.result !== null) {
        const arrayBuffer = bytesFileReader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        setFileBytes(bytes);

        if (bytes.length > 0) {
          const base64String = btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''));

          const jsonObject = { file: base64String };
          //console.log('JSON:', JSON.stringify(jsonObject));

          setFileBytes(bytes);
        } else {
          console.error('El array de bytes está vacío.');
        }
      }
    };

    if (uploadedFile !== undefined) {

      textFileReader.readAsText(uploadedFile);
      dataUrlFileReader.readAsDataURL(uploadedFile);

      setFileName(fileName);

      return textFileReader.result as string | null;
    }
    setFile(uploadedFile)
    setFileName(null)

    return null;
  };

  const handleDownload = () => {
    const jsonData = {
      name: nameColor,
      hex,
      filename: fileName,
      fileImage: fileImage
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
              <div>
                <img className='file' src={fileImage} alt="" />
              </div>
            </form>
            <footer className='footer'>
              <button type='submit' className='submitButton' onClick={handleSubmit}>Submit</button>
              <button type='submit' className='clearButton' onClick={handleClear}>Clear</button>
            </footer>
            {formSubmitted && (
              <div className={`submmited ${classSubmmited}`}>{message}</div>
            )}
            {file !== null && (
              <div>
                <button onClick={handleDownload}>Descargar JSON</button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default Form
