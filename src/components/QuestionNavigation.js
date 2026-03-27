function QuestionNavigation({questions,setIndex}){

return(

<div>

{questions.map((q,i)=>(

<button key={i} onClick={()=>setIndex(i)}>
{i+1}
</button>

))}

</div>

)

}

export default QuestionNavigation;