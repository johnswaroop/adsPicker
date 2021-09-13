import { useState, useEffect } from 'react'
import adTypeDefault from './data/textClassified/hindustan-times.json'
import { useLocation } from 'react-router'
import imgNameMap from './data/imgNameMap'



const PackCard = (props) => {

    return (
        <div className='packCard'>
            <div className={"packImgCon"}>
                <img src={imgNameMap[props.paperName]} alt="" />
            </div>
            <div className={"packTextCon"}>
                <h3>{props.title}</h3>
                <p>₹ <strong>{props.price}</strong> {(props.type === 'textClassified') ? ("for 5 lines") : "for 3x4"}</p>
            </div>
        </div>
    )

}

const Packs = () => {

    const [adType, setAdType] = useState(adTypeDefault);
    const [type, setType] = useState('textClassified');
    const [category, setCategory] = useState(Object.keys(adType)[1]);
    let location = useLocation();
    console.log(category);
    useEffect(() => {
        import(`./data/${type}/${location.pathname.split('/')[3]}.json`).then((ad) => {
            console.log(ad);
            console.log(Object.keys(ad)[0] + " " + Object.keys(ad)[1]);
            setCategory(Object.keys(ad)[2]);
            setAdType({ ...ad });
        
        })
    }, [type, location.pathname])

    let paperName = location.pathname.split('/')[2];


    return (
        <div className="App">
            <div className="paperNav">
                <h1>{paperName}</h1>
                <div className="selectLanguage">
                    <p>Select Ad-Type :</p>
                    <select name="" id="" value={type} onChange={(e) => { setType(e.target.value) }}>
                        <option value="textClassified">Text Classified Ads</option>
                        <option value="displayAds">Display Classified Ads</option>
                    </select>
                </div>
                <div className="selectLanguage">
                    <p>Select Category :</p>
                    <select name="" id="" value={category} onChange={(e) => { setCategory(e.target.value) }}>
                        {
                            Object.keys(adType).map((cat, index) => {
                                if (index !== 0) {
                                    return (
                                        <option value={cat}>{cat}</option>
                                    )
                                }
                                else {
                                    return null
                                }

                            })
                        }
                    </select>
                </div>
            </div>
            <div className={"packs"} key={category + type}>
                {
                    Object.values(adType[category]).map((obj) => {
                        return (
                            <PackCard
                                paperName={paperName}
                                type={type} title={obj.title}
                                price={obj.price}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Packs;