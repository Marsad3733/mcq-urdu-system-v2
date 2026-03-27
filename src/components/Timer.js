import {useState,useEffect} from "react";

function Timer(){

const [time,setTime] = useState(1800);

useEffect(()=>{

const interval = setInterval(()=>{

setTime(t=>t-1)

},1000)

return ()=>clearInterval(interval)

},[])

const minutes = Math.floor(time/60);
const seconds = time%60;

return(

<h3>

باقی وقت : {minutes}:{seconds}

</h3>

)

}

export default Timer;