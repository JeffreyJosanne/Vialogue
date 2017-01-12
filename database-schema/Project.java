public class Project {
	// Primary Key
	int id;

	int parent_id;
	int original_parent_id;
	String name;
	boolean is_dubbed;

	int category_id;
	Category category;

	int language_id;
	Language language;

	int author_id;
	Author author;

	int resolution_x;
	int resolution_y;
	
	Slide[] slides;

	int project_video_id;
	ProjectVideo video;

	int project_questions_id;
	ProjectQuestions questions;
}