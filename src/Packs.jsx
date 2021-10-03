import { useState, useEffect } from 'react'
import adTypeDefault from './data/textClassified/hindustan-times.json'
import { useLocation } from 'react-router'
import imgNameMap from './data/imgNameMap'
import closeIcon from './close.png'
import axios from 'axios'

const Razorpay = window.Razorpay;

var options = {
    "key": "rzp_test_VnSs033Scyq7MW", // Enter the Key ID generated from the Dashboard
    "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "ads4publish.com",
    "description": "Test Transaction",
    "order_id": "order_DBJOWzybf0sJbb", //This is a sample Order ID. Pass the `id` obtained in the previous step
    "handler": function (response) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature)
    },
    "notes": {
        "address": "https://ads4publish.com/"
    },
    "theme": {
        "color": "#3399cc"
    }
};

const Calculator = (props) => {
    let location = useLocation();
    let paperName = location.pathname.split('/')[2]
    const [stat, setstat] = useState({ lines: 0, chars: 0 })

    let cost5 = (stat.chars > 0) ? parseInt(props.price) : 0;
    let costAdd = (stat.lines > 5 ? (stat.lines - 5) * (props.price / 5) : 0);

    const handleStat = (e) => {
        console.log(e.target.value.length)
        setstat((s) => {
            s.chars = e.target.value.length;
            s.lines = Math.ceil(e.target.value.length / 24);
            return { ...s };
        })
    }

    const paymentRequest = async () => {
        try {
            let res = await axios.get('/payment');
            console.log(res);
            options.order_id = res.data.order.id;
            var rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert(response.error.code);
                alert(response.error.description);
                alert(response.error.source);
                alert(response.error.step);
                alert(response.error.reason);
                alert(response.error.metadata.order_id);
                alert(response.error.metadata.payment_id);
            });
           rzp1.open();
        }
        catch (er) {
            console.log(er);
        }

    }

    return (
        <div className="calculator">
            <img className={'closeIcon'} src={closeIcon} alt="" onClick={() => { props.setcalcVisible(false) }} />
            <div className={"info"}>
                <span className={'img'}>
                    <img src={imgNameMap[props.paperName]} alt="" />
                </span>
                <span className="paperData">
                    <h1><strong>{paperName}</strong>  ({props.category})</h1>
                    <h3>{props.title}</h3>
                    <p>₹ <strong>{props.price}</strong> {(props.type === 'textClassified') ? ("for 5 lines") : ("for 3x4")}</p>
                </span>

            </div>
            <div className={"edit"}>
                <div className="editStats">
                    <textarea placeholder={"Type you Add here"} name="" id="" cols="30" rows="10" onChange={handleStat} maxlength={20 * 24}></textarea>
                    <h3>No of Lines : <strong>{stat.lines}</strong></h3>
                    <h3>No of characters : <strong>{stat.chars}</strong></h3>
                    <h3>No of characters/line : <strong>{"24"}</strong></h3>
                    <h3>Max no of lines Allowed : <strong>{"20"}</strong></h3>
                </div>
                <div className={"calculateCash"}>
                    <h3>Cost calculation : ₹{props.price} for first 5 lines + ₹{props.price / 5} for additional lines</h3>
                    <span className="row">
                        <h1 className={'tag'}>First 5 lines : </h1><h1 className={'price'}>₹{cost5}</h1>
                    </span>
                    <span className="row">
                        <h1 className={'tag'}>Additional lines {(stat.lines > 5 ? stat.lines - 5 : 0)} x ₹{props.price / 5} : </h1><h1 className={'price'}>₹{costAdd}</h1>
                    </span>
                    <hr />
                    <span className="row">
                        <h1 className={'tag'}>Total (exculuding taxes and GST) : </h1><h1 style={{ color: 'green' }} className={'price'}>₹{(costAdd + cost5)}</h1>
                    </span>
                    <span className="checkout">
                        <p className={"reset"}>Reset</p>
                        <button onClick={paymentRequest}>Checkout</button>
                    </span>
                </div>
            </div>
        </div>
    )
}

const PackCard = (props) => {

    const [calcVisible, setcalcVisible] = useState(false);

    const handleCalc = () => {
        setcalcVisible(!calcVisible);
    }

    return (
        <>
            {calcVisible && <Calculator {...props} calcVisible={calcVisible} setcalcVisible={setcalcVisible} />}
            <div className='packCard' onClick={(props.type === 'textClassified') ? handleCalc : null}>
                <div className={"packImgCon"}>
                    <img src={imgNameMap[props.paperName]} alt="" />
                </div>
                <div className={"packTextCon"}>
                    <h3>{props.title}</h3>
                    <p>₹ <strong>{props.price}</strong> {(props.type === 'textClassified') ? ("for 5 lines") : ("for 3x4")}</p>
                </div>
            </div>
        </>
    )

}

const Packs = () => {

    const [adType, setAdType] = useState(adTypeDefault);
    const [type, setType] = useState('textClassified');
    const [category, setCategory] = useState(Object.keys(adType)[1]);
    let location = useLocation();

    useEffect(() => {
        import(`./data/${type}/${location.pathname.split('/')[3]}.json`).then((ad) => {
            console.log(ad);
            setCategory(Object.keys(ad)[2]);
            setAdType({ ...ad });
        })

        axios.get(`https://ads4publish.com/api/${type}/${location.pathname.split('/')[3]}.json`).then((res)=>{
            console.log(res);
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
                                category={category}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Packs;