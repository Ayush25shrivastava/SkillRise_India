import { parseResume } from "../services/resumeParser.js";
import { extractSkills } from "../services/skillExtractor.js";
import { calculateATS } from "../services/atsScore.js";
import { generateSuggestions } from "../services/suggestionGenerator.js";

export async function analyzeResume(req,res){

 try{

 const text = await parseResume(req.file);

 const skills = await extractSkills(text);

 const score = calculateATS(skills,req.body.jobSkills,0.8);

 const suggestions = await generateSuggestions(text,req.body.jobDescription);
 
  const jobSkills = req.body?.jobSkills || [];
  const jobDescription = req.body?.jobDescription || "";

 res.json({
  skills,
  score,
  suggestions
 });

 }catch(err){
  res.status(500).json({error:err.message});
 }

}