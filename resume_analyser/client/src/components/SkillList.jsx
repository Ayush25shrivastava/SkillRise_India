export default function SkillList({skills}){

 return(

  <div>

   <h3>Extracted Skills</h3>

   <ul>

    {skills.map((skill,index)=>(
      <li key={index}>{skill}</li>
    ))}

   </ul>

  </div>

 );

}