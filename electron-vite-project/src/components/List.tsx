import { useQuery } from '@apollo/client';
import './List.css'
import * as Queries from '../apollo/apolloQuery';

function List() {
  const { loading, data } = useQuery(Queries.getAllColors)

  return (
    <div className='list'>
      <div className='scroll-container'>
        {loading == false && data.allColors.map((Color: any) => {
          const divStyle = {
            backgroundColor: Color.hex,
          }
          return (
            <div key={Color.name} className='colors' >
              {Color.name}
              {Color.hex}
              <div className='bgcolor' style={divStyle}>

              </div>
            </div>
          )
        })}
      </div>

    </div>
  );
};

export default List;
