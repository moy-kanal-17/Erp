import { useState } from "react"

export const Test = () => {

    const [count,SetCount] = useState(0)
    const [state,Setstate] = useState('')
    const [type] = useState('')
    //  const dach=(action,state)=>{
    //     if(type == 'ChangeColor'){
    //         console.log('change');
            
    //     }
    // }


    return(
        <>
        <h1>{count}</h1>
        <button onClick={()=>SetCount(count+1)}>+</button>
        <br />
        <button onClick={()=>SetCount(count-1)}>-</button>
        {/* <button onClick={()=>dach(type='ChangeColor')}>Change Color</button> */}
        </>
    )
}


export default Test