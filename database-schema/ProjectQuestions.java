public class ProjectQuestions {
	int id;
	Question[] question;

	// for updation purposes
	boolean is_deleted;
	int time_deleted; // in actual implementation, will use "modified" field of parse
	int user_no;
}