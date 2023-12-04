
import { useMutation, useQuery } from '@apollo/client';
import './List.css'
import * as Queries from '../apollo/apolloQuery';

function List() {
  const { loading, data  } = useQuery(Queries.getAllColors)
  const [deleteColor] = useMutation(Queries.deleteColor)

  const deleteOneColor = (name: any) => {
    deleteColor({
      variables: {
        name: name
      }
    })
    location.reload()
  }
  if (loading == false) {
    //console.log(data)
  }

  return (
    <div className='list'>
      <div className='scroll-container'>
        {loading == false && data?.allColors.map((Color: any) => {
          const divStyle = {
            backgroundColor: Color.hex,
          }
          const shadowStyle = {
            boxShadow: `5px 5px 5px 0px ${Color.hex}`,
          }
          return (
            <div key={Color.name} className='colors'>
              <table style={shadowStyle}>
                <tbody>
                  <tr className='tr'>
                  <td>{Color.name}</td>
                  <td>{Color.hex}</td>
                  <td>{Color.file}</td>
                  <td><button className='tdButton' onClick={() => deleteOneColor(Color.name)}>Delete</button></td>
                </tr>
                <tr><td colSpan={3} className='bgcolor' style={divStyle} /></tr>
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default List;