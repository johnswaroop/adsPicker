import imgs from './data/imgs'
import { useState } from 'react'
import { Link } from "react-router-dom";

let options = new Set();
imgs.forEach((img) => {
  options.add(img.language);
})

const PapersSelect = (props) => {
  return (

    <div className={"papers"}>
      {
        imgs.map((img) => {
          if (props.language === img.language) {
            return (
              <Link to={`/packs/${img.name}/${img.paperUrl.split('/')[img.paperUrl.split('/').length - 1]}`}>
                <div className={"paperCard"}>
                  <div className="imgCon">
                    <img src={img.url} alt="" />
                  </div>
                  <div className="textCon">
                    <h1>{img.name}</h1>
                  </div>
                </div>
              </Link>
            )
          }
          else return null
        })
      }
    </div>

  )
}

const PapersAll = () => {
  return (

    <div className={"papers"}>
      {
        imgs.map((img) => {
          return (
            <Link to={`/packs/${img.name}/${img.paperUrl.split('/')[img.paperUrl.split('/').length - 1]}`}>
              <div className={"paperCard"}>
                <div className="imgCon">
                  <img src={img.url} alt="" />
                </div>
                <div className="textCon">
                  <h1>{img.name}</h1>
                </div>
              </div>
            </Link>
          )
        })
      }
    </div>

  )
}

const App = () => {

  const [language, setLanguage] = useState('Language - All');

  return (
    <div className="App">
      <div className="paperNav">
        <h1>AVAILABLE NEWS PAPERS</h1>
        <div className="selectLanguage">
          <p>
            Filter by Language :
          </p>
          <select name="" id="" value={language} onChange={(e) => { setLanguage(e.target.value) }}>
            <option value="Language - All">All Languages</option>
            {
              [...options].map((opt) => {
                return <option value={opt}>{opt.split(' - ')[1]}</option>
              })
            }
          </select>
        </div>
      </div>
      {
        (language === 'Language - All') ? <PapersAll /> : <PapersSelect language={language} />
      }

    </div>
  );
}

export default App;