import { useState } from "react";
import "../styles/style.css"
import "../styles/LeftStyle.css"
import "../styles/RightStyle.css"
import Connexion from "./connexion";
import AWS, {AWSError} from 'aws-sdk';

function InputImage() {
    const [image, setImage] = useState<string>();
    const [DataList, setDataList] = useState<any>(null);
    const [confidence, setConfidence] = useState<any>();
    //----------------------------------------
    const DetectFaces = (imageData: string) => {
        let rekognition = new AWS.Rekognition();
        let params = {
            Image: {
                Bytes: imageData
            },
            Attributes: [
                'ALL',
            ]
        };
        rekognition.detectFaces(params, function (err:AWSError, data: any):void {
            if (err) console.log(err, err.stack);
            else {
               // setConfidence(data.FaceDetails[0].Confidence.Value)
                setDataList(Object.entries(data.FaceDetails![0]));
            }
        });
    }

    const ProcessImage = (event: any) => {
        const file: any = event.target.files[0];
        setImage(URL.createObjectURL(event.target.files[0]));
        Connexion();

        let reader = new FileReader();
        reader.onload = (function () {
            return function (e: any) {
                let image: any = null;
                let jpg = true;
                try {
                    image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);
                } catch (e) {
                    jpg = false;
                }
                if (!jpg) {
                    try {
                        image = atob(e.target.result.split("data:image/png;base64,")[1]);
                    } catch (e) {
                        alert("Not an image file Rekognition can process");
                        return;
                    }
                }

                let length = image?.length;
                let imageBytes: any = new ArrayBuffer(length);
                let ua = new Uint8Array(imageBytes);
                for (let i = 0; i < length; i++) {
                    ua[i] = image?.charCodeAt(i);
                }
                DetectFaces(imageBytes);
            };
        })();
        reader.readAsDataURL(file);
    }
    return (
        <div className="main">
            <label htmlFor="input-img">
                <div className="inputField" >Select image</div>
            </label>

            <div className="Container">
                <div className="left-container">
                    <input id="input-img" type="file" accept=".png,.jpg,.jpeg" onChange={ProcessImage}/>
                    <div className="Image">
                        <img alt="" src={image}/>
                    </div>
                </div>
                <div className="right-container">
                    {
                       (DataList || []).map(function (key: string) {
                            return (
                                 <>
                                     { key[0]  === "" ? <p>Loading...</p> : <p className='title'>{key[0]}:</p>}
                                     {
                                         (Object.entries(key[1]) || []).map
                                         ((element: string[]) =>  {
                                             return (
                                                 <div >
                                                     {
                                                        typeof element[1] == 'object' ?
                                                        Object.entries(element[1]).map(e =>
                                                            <>
                                                            {
                                                                <p className="attr" >{e[0] + " : " +
                                                                    e[1]}</p>
                                                            }
                                                            </>
                                                        )
                                                            : <div className="info">
                                                                <div className="left-info" >{element[0]}:</div>
                                                                <div className="right-info" >{element[1]}</div>
                                                    </div>

                                                     }
                                                    
                                                 </div>
                                             )
                                         })
                                     }
                                 </>
                             )
                         })
                     }
                 </div>
            </div>
        </div>
    );
}
export default InputImage;