// resume_analyser\client\src\components\FlowVisualizer.jsx
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
const nodes = [

 { id:"1", position:{x:0,y:0}, data:{label:"Resume Upload"}, type:"default" },

 { id:"2", position:{x:200,y:0}, data:{label:"Understand Resume"} },

 { id:"3", position:{x:400,y:0}, data:{label:"Extract Skills"} },

 { id:"4", position:{x:600,y:0}, data:{label:"ATS Score"} },

 { id:"5", position:{x:800,y:0}, data:{label:"Suggestions"} }

];

const edges = [

 { id:"e1", source:"1", target:"2" },

 { id:"e2", source:"2", target:"3" },

 { id:"e3", source:"3", target:"4" },

 { id:"e4", source:"4", target:"5" }

];

export default function FlowVisualizer(){

 return(

  <div style={{height:200}}>

   <ReactFlow nodes={nodes} edges={edges}/>

  </div>

 );

}