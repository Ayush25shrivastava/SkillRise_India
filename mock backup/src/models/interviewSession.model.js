/**
 * In-memory session store model representation.
 * In a real app, this would be a Mongoose model.
 */

export class InterviewSession {
    constructor(id, { role, level, skills }) {
        this.id = id;
        this.role = role;
        this.level = level;
        this.skills = skills;
        this.state = "init";
        this.currentQuestion = null;
        this.questionNumber = 1;
        this.history = []; // [{ question, answer, evaluation }]
        this.report = null;
        this.createdAt = new Date();
    }

    addHistory(question, answer, evaluation) {
        this.history.push({ question, answer, evaluation });
    }

    isComplete() {
        return this.history.length >= 5;
    }
}